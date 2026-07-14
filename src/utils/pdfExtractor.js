/**
 * src/utils/pdfExtractor.js
 *
 * Universal PDF text extractor — works with pdfjs-dist v6.x
 *
 * Strategy:
 *  1. Use pdfjs-dist to extract digital text (fast, text-based PDFs)
 *  2. If text yield is < 80 chars/page, treat as scanned → OCR with Tesseract.js
 *
 * Worker is loaded from the local node_modules via Vite's `new URL(..., import.meta.url)`
 * pattern — this guarantees version alignment and zero CDN dependency.
 */

// ── PDF.js worker setup ────────────────────────────────────────────────────────
// Using Vite's URL-import to bundle the worker from local node_modules.
// This avoids CDN mismatches and works offline.
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import tesseractWorkerUrl from 'tesseract.js/dist/worker.min.js?url'
import tesseractCoreUrl from 'tesseract.js-core/tesseract-core.wasm.js?url'

let _pdfjsLib = null

// PDF.js transfers the ArrayBuffer passed to getDocument() to its worker. Always
// give it a fresh copy so a later extraction attempt (such as OCR) can still read
// the original uploaded file.
const copyPdfBytes = (arrayBuffer) => new Uint8Array(arrayBuffer.slice(0))

async function getPdfLib() {
  if (_pdfjsLib) return _pdfjsLib

  const pdfjsLib = await import('pdfjs-dist')

  // Point worker to the local build file using Vite's explicit URL import
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl

  _pdfjsLib = pdfjsLib
  return pdfjsLib
}

// ── Page canvas renderer (for OCR) ────────────────────────────────────────────
async function renderPageToCanvas(page, scale = 2.0) {
  const viewport = page.getViewport({ scale })
  const canvas = document.createElement('canvas')
  canvas.width  = Math.floor(viewport.width)
  canvas.height = Math.floor(viewport.height)
  const ctx = canvas.getContext('2d')
  await page.render({ canvasContext: ctx, viewport }).promise
  return canvas
}

// ── Digital text extraction ────────────────────────────────────────────────────
async function extractDigitalText(arrayBuffer) {
  const pdfjsLib = await getPdfLib()

  // Use a copy of the buffer — pdf.js transfers ownership
  const pdf = await pdfjsLib.getDocument({
    data: copyPdfBytes(arrayBuffer),
    useSystemFonts: true,   // avoids missing font warnings
    disableFontFace: false,
  }).promise

  let fullText = ''

  for (let i = 1; i <= pdf.numPages; i++) {
    const page    = await pdf.getPage(i)
    const content = await page.getTextContent()

    const pageText = content.items
      .map(item => ('str' in item ? item.str : ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()

    fullText += pageText + '\n\n'
    page.cleanup()
  }

  const avgCharsPerPage = fullText.trim().length / pdf.numPages
  // pdfjs-dist v6 exposes cleanup() on PDFDocumentProxy; destroy() is not
  // available in all builds and was throwing after successful extraction.
  pdf.cleanup()

  return {
    text:        fullText.trim(),
    pageCount:   pdf.numPages,
    isTextBased: avgCharsPerPage >= 80,
  }
}

// ── OCR text extraction (scanned PDFs) ────────────────────────────────────────
async function extractOcrText(arrayBuffer, onProgress) {
  const pdfjsLib = await getPdfLib()
  const { createWorker } = await import('tesseract.js')

  const pdf    = await pdfjsLib.getDocument({ data: copyPdfBytes(arrayBuffer) }).promise
  // Keep the worker and WebAssembly core local to this app. The library defaults
  // to a CDN URL, which can be blocked by a deployment's CSP or network policy.
  const worker = await createWorker('eng', 1, {
    workerPath: tesseractWorkerUrl,
    corePath: tesseractCoreUrl,
  })

  let fullText = ''

  for (let i = 1; i <= pdf.numPages; i++) {
    const page   = await pdf.getPage(i)
    const canvas = await renderPageToCanvas(page, 2.0)

    const { data: { text } } = await worker.recognize(canvas)
    fullText += text.replace(/\s+/g, ' ').trim() + '\n\n'

    // Free canvas memory
    canvas.width  = 0
    canvas.height = 0

    if (onProgress) {
      onProgress(Math.round((i / pdf.numPages) * 100))
    }
    page.cleanup()
  }

  await worker.terminate()
  pdf.cleanup()

  return fullText.trim()
}

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Extracts text from any PDF — text-based or scanned.
 *
 * @param {File} file        - Browser File object from an <input type="file">
 * @param {Function} onStatus - Progress callback: ({ stage, progress }) => void
 *   stage values: 'reading' | 'extracting' | 'ocr' | 'done'
 * @returns {Promise<{ text: string, method: 'digital'|'ocr', pageCount: number }>}
 */
export async function extractPdfText(file, onStatus = () => {}) {
  onStatus({ stage: 'reading', progress: 10 })

  const arrayBuffer = await file.arrayBuffer()

  onStatus({ stage: 'extracting', progress: 25 })

  // ── Step 1: Try digital extraction ──────────────────────────────────────────
  let digitalResult
  try {
    digitalResult = await extractDigitalText(arrayBuffer)
  } catch (err) {
    console.warn('[pdfExtractor] Digital extraction failed:', err.message)
    digitalResult = { text: '', pageCount: 1, isTextBased: false }
  }

  const { text: digitalText, pageCount } = digitalResult

  // If digital extraction successfully found text, use it directly (scanned PDFs have 0 digital text)
  if (digitalText && digitalText.length > 100) {
    onStatus({ stage: 'done', progress: 100 })
    return { text: digitalText, method: 'digital', pageCount }
  }

  // ── Step 2: OCR fallback ─────────────────────────────────────────────────────
  onStatus({ stage: 'ocr', progress: 30 })

  let ocrText = ''
  try {
    ocrText = await extractOcrText(arrayBuffer, (pct) => {
      onStatus({ stage: 'ocr', progress: 30 + Math.round(pct * 0.65) })
    })
  } catch (err) {
    console.warn('[pdfExtractor] OCR failed:', err.message)
  }

  onStatus({ stage: 'done', progress: 100 })

  // Return whichever extracted more content
  const finalText = ocrText.length > digitalText.length ? ocrText : digitalText

  if (!finalText || finalText.trim().length < 50) {
    throw new Error(
      'Could not extract readable text from this PDF. ' +
      'Please ensure the file is not password-protected or corrupted.'
    )
  }

  return { text: finalText, method: 'ocr', pageCount }
}
