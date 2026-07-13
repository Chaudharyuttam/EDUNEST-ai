/**
 * services/chatService.js
 * AI service layer — handles all Gemini API communication.
 *
 * Demo Mode Fallback:
 * If GEMINI_API_KEY is not configured or is invalid, it falls back to a
 * smart, context-aware rule-based responder. It parses the user's input
 * and dynamically matches exact questions, concepts, coding terms,
 * and career queries to deliver highly tailored, specific answers.
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'
import env from '../config/env.js'
import { AppError } from '../middleware/errorHandler.js'
import logger from '../utils/logger.js'

// ── Safety guardrails ──────────────────────────────────────────────────────────
const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,       threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
]

// ── Generation configuration ───────────────────────────────────────────────────
const GENERATION_CONFIG = {
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 2048,
}

// ── System instruction ─────────────────────────────────────────────────────────
const SYSTEM_INSTRUCTION = `You are EduNest AI, an expert learning assistant built for students 
preparing for placements, technical interviews, and academic exams. 

Your personality:
- Clear, concise, and encouraging
- Always explain concepts with real-world examples
- Format code with proper markdown code blocks
- Break complex topics into numbered steps when helpful
- Never give harmful, unethical, or off-topic advice

Your expertise includes: Data Structures & Algorithms, Web Development (React, Node.js), 
System Design, Databases (SQL/NoSQL), Computer Science fundamentals, Career guidance, 
and Study planning.`

// ── Smart context-aware mock responder ─────────────────────────────────────────
const getMockResponse = (message) => {
  const msg = message.toLowerCase().trim()

  // 1. GREETINGS
  if (/^(hi|hello|hey|sup|yo|hola|namaste|greetings)[\s!.]*$/.test(msg)) {
    return `👋 **Hello! I'm EduNest AI** — your placement preparation mentor.

I can help you with:
- 🧠 **DSA & Algorithms** — arrays, trees, graphs, dynamic programming, binary search
- 💻 **Web Development** — React, Node.js, REST APIs, system design
- 📄 **Resume & Interview Prep** — mock questions, HR tips, coding rounds
- 🗺️ **Study Planning** — personalised roadmaps and daily schedules
- 🔢 **CS Fundamentals** — OS, DBMS, CN, OOP concepts

What would you like to learn today? Feel free to ask me anything! 🚀`
  }

  // 2. EXPLAIN BINARY SEARCH WITH CODE
  if (msg.includes('binary search')) {
    return `## Binary Search Explained

Binary Search is an efficient algorithm for finding an item from a **sorted** list of items. It works by repeatedly dividing in half the portion of the list that could contain the item, until you've narrowed down the possible locations to just one.

### How It Works:
1. Start with the middle element of the sorted array.
2. If the target is equal to the middle element, you're done.
3. If the target is less than the middle element, repeat the search on the left half.
4. If the target is greater than the middle element, repeat the search on the right half.

### Complexity:
- **Time Complexity:** $O(\log n)$ (half the search space at each step)
- **Space Complexity:** $O(1)$ (iterative approach)

### JavaScript Implementation:
\`\`\`javascript
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    // Avoid integer overflow in other languages
    const mid = Math.floor(left + (right - left) / 2);

    if (arr[mid] === target) {
      return mid; // Target found, return index
    }

    if (arr[mid] < target) {
      left = mid + 1; // Search right half
    } else {
      right = mid - 1; // Search left half
    }
  }

  return -1; // Target not found
}

// Example usage:
const sortedArray = [1, 3, 5, 7, 9, 11, 13, 15];
console.log(binarySearch(sortedArray, 7));  // Output: 3
console.log(binarySearch(sortedArray, 10)); // Output: -1
\`\`\`

Would you like to solve a LeetCode problem using Binary Search next?`
  }

  // 3. REACT USEEFFECT
  if (msg.includes('useeffect') || msg.includes('react hook') || msg.includes('hooks work')) {
    return `## React's useEffect Hook

The \`useEffect\` hook lets you perform side effects (data fetching, subscriptions, manual DOM mutations) in functional components. It serves the same purpose as \`componentDidMount\`, \`componentDidUpdate\`, and \`componentWillUnmount\` in React class components.

### Syntax Structure:
\`\`\`javascript
useEffect(() => {
  // 1. Your side effect logic goes here
  
  return () => {
    // 2. Optional cleanup function goes here
    // Runs before the effect is re-executed or component unmounts
  };
}, [dependencies]); // 3. Dependency array
\`\`\`

### The Dependency Array Matrix:
| Dependency Array | When It Runs | Use Case |
|-------------------|--------------|----------|
| **No array** (\`undefined\`) | After *every* render | Logging / manual DOM updates |
| **Empty array** (\`[]\`) | Once, after initial render | Fetching user profile on load |
| **With values** (\`[userId]\`) | When any dependency changes | Fetching data when user ID updates |

### Practical Example (API Fetching + Cleanup):
\`\`\`javascript
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetch(\`https://api.example.com/users/\${userId}\`)
      .then(res => res.json())
      .then(data => {
        if (active) {
          setUser(data);
          setLoading(false);
        }
      });

    // Cleanup function
    return () => {
      active = false; // prevents setting state on unmounted component
    };
  }, [userId]); // Re-runs fetch only when userId changes

  if (loading) return <p>Loading user...</p>;
  return <div>{user.name}</div>;
}
\`\`\`

Would you like me to explain dependency optimization or cleanups further?`
  }

  // 4. DESIGN A URL SHORTENER
  if (msg.includes('url shortener') || msg.includes('design a url') || msg.includes('bit.ly')) {
    return `## System Design: Designing a URL Shortener (e.g., Bit.ly)

This is a classic system design interview question. Here is the architectural breakdown:

### 1. Requirements & Core Features
- **Functional:**
  - Given a long URL, generate a shorter, unique alias (e.g., \`bit.ly/xyz123\`).
  - Accessing the short link should redirect to the original URL with minimal latency.
- **Non-Functional:**
  - High availability, low latency redirection (< 100ms).
  - Short links should not be predictable or easy to guess (security).

### 2. High-Level Architecture
\`\`\`
[User] ──(Request Short Link)──► [Load Balancer] ──► [Web Server] ──► [Database]
                                                       │
                                                (Cache Lookup)
                                                       ▼
                                                [Redis Cache]
\`\`\`

### 3. Key Design Decisions

#### A. Database Schema
Since we only store URL mappings (Short Key ◄─► Long URL), a NoSQL database like **Cassandra** or **MongoDB** fits well. It handles massive read/write scales easily.
- **Table:** \`URL_Map\`
  - \`short_key\` (Primary Key, VARCHAR/String)
  - \`original_url\` (VARCHAR/String)
  - \`created_at\` (Timestamp)

#### B. Encoding / Key Generation Algorithm
To convert the unique database ID to a short URL, we use **Base62** encoding (\`[A-Z, a-z, 0-9]\`).
- A 6-character short key gives: $62^6 = 56.8$ Billion unique URLs.
- A 7-character short key gives: $62^7 = 3.5$ Trillion unique URLs.

#### C. Redirection HTTP Code
- **301 Redirect (Permanent):** The browser caches the redirect. Subsequent clicks go straight to the target URL without hitting our servers. Best for reducing server load.
- **302 Redirect (Temporary):** The browser hits our server every time. Best if you need accurate analytics on link clicks.

#### D. Caching Strategy
Redirections are read-heavy. We can use a **Redis cache** storing the top 20% most active short keys to keep redirection latency under 10ms.

Would you like to design the counter service (Key Generation Service) next?`
  }

  // 5. TOP DSA TOPICS FOR AMAZON / FAANG
  if (msg.includes('amazon') || msg.includes('faang') || msg.includes('top dsa topics') || msg.includes('placement topics')) {
    return `## Top DSA Topics for Amazon & FAANG Interviews

Based on interview trends, here are the most frequently asked Data Structures & Algorithms patterns at Amazon and similar top-tier product companies.

### 📊 Priority Matrix:
1. **High Priority (Must Master):**
   - **Trees & Graphs:** DFS, BFS, Binary Tree traversals, Lowest Common Ancestor (LCA).
   - **Sliding Window:** Maximum of all subarrays of size K, Longest substring without repeating chars.
   - **Two Pointers:** Pair with given sum, 3Sum, Container with most water.
   - **Dynamic Programming (DP):** 0-1 Knapsack, Longest Common Subsequence (LCS), Coin Change.
2. **Medium Priority:**
   - **Heaps:** Find K closest elements, Merge K sorted lists.
   - **Binary Search:** Search in rotated sorted array, Find peak element.
   - **Design:** LRU Cache implementation (very common).
3. **Low Priority (Basic Awareness):**
   - **Tries:** Word Search, Autocomplete basics.
   - **Bit Manipulation:** Single number, Counting bits.

### 💡 Practice Recommendation Plan:
- Solve **100-120 handpicked LeetCode problems** focused on patterns rather than memorizing questions.
- Practice the **STAR method** for Amazon's Leadership Principles (behavioural rounds).
- Do at least **2-3 mock system design rounds** if you are targeting SDE-2 or higher.

Would you like me to walk through a specific LeetCode problem frequently asked at Amazon?`
  }

  // 6. GENERAL REACTION OR CONCEPT QUESTION (Dynamic Template)
  // If the user asks something like "Explain X", "What is Y", "How to build Z"
  const explainMatch = message.match(/(?:explain|what is|how does|tell me about|how to write|write a)\s+([a-zA-Z0-9_\-\s.+]+)/i)
  if (explainMatch && explainMatch[1]) {
    const topicName = explainMatch[1].trim()
    return `## Explaining "${topicName}" (Demo Mode)

You asked about **${topicName}**. Since I am currently running in Demo Mode (without a Gemini API key), here is a structured cheat sheet to help you master this concept for placements:

### 1. Conceptual Summary
**${topicName}** represents a key concept in software engineering. Mastery of this topic requires understanding:
- How it simplifies development or optimizes performance.
- When to use it over alternative approaches.
- Edge cases and common pitfalls.

### 2. Interview Prep Checklist for "${topicName}"
- [ ] **Core Definition:** Can you explain it in under 60 seconds to a technical interviewer?
- [ ] **Implementation:** Can you write a basic implementation on a whiteboard?
- [ ] **Trade-offs:** What are the time/space complexities or performance bottlenecks?
- [ ] **Practical Application:** Can you reference a real project where you used this?

### 3. Suggested Related Placement Topics:
- If this is a coding concept, check out **Arrays & Algorithms** at [/roadmap](/roadmap).
- For design patterns, check out **System Design Basics**.

---
> ⚙️ **Want full AI answers?** Add your \`GEMINI_API_KEY\` to your \`server/.env\` file. The system will immediately unlock fully customized, real-time replies for any technical questions.

What other topic should we explore next?`
  }

  // 7. KEYWORDS MATCHING FOR GENERAL CATEGORIES
  if (msg.includes('dsa') || msg.includes('algorithm') || msg.includes('data structure')) {
    return `## Master DSA for Placements

Data Structures & Algorithms (DSA) form the foundation of technical screening.

### Core Structures to Practice:
- **Arrays & Strings** — Two Pointers, Sliding Window
- **LinkedLists** — Fast & Slow Pointers, Reversing
- **Stacks & Queues** — Monotonic stack patterns
- **Trees & Graphs** — BFS, DFS, Dijkstra's algorithm
- **Dynamic Programming** — Memoization vs Tabulation

Try asking me: *"Explain binary search with code"* or check your custom study path in the [Roadmap Section](/roadmap).`
  }

  if (msg.includes('react') || msg.includes('frontend') || msg.includes('web dev')) {
    return `## Frontend & React Placement Preparation

React is the most popular frontend library in tech interviews.

### High-Yield React Interview Concepts:
- **Virtual DOM** & Diffing Algorithm (Reconciliation)
- **State Management** — Redux Toolkit, Context API
- **Hooks** — useState, useEffect, useMemo, useCallback
- **Performance** — Lazy loading, Code splitting, Virtual list rendering
- **Rendering Lifecycle** — Mounting, Updating, Unmounting

Try asking me: *"How does React's useEffect work?"* to see a deep dive example.`
  }

  if (msg.includes('system design') || msg.includes('architecture')) {
    return `## System Design Preparation Guide

System design evaluates your architectural mindset.

### Core Building Blocks:
1. **Load Balancer** (Nginx, HAProxy)
2. **Caching** (Redis, Memcached)
3. **Database** (SQL Replication vs NoSQL Sharding)
4. **Message Broker** (Kafka, RabbitMQ)
5. **DNS & CDN** (Cloudflare)

Try asking me: *"Design a URL shortener"* to walk through a complete system design interview case study.`
  }

  // DEFAULT MENU
  return `## EduNest AI — Your Placement Mentor

Great question! I'm here to help you crack placements.

Here are some topics I can explain in detail:

🔢 **DSA & Algorithms**
Arrays, LinkedLists, Trees, Graphs, DP, Sorting, Binary Search

💻 **Web Development**
React, Node.js, JavaScript, REST APIs, MongoDB

🏗️ **System Design**
Load balancing, Caching, Database design, Microservices

🎯 **Interview Prep**
Behavioural questions, HR rounds, Salary negotiation

📄 **Resume & Career**
ATS optimisation, LinkedIn tips, Portfolio projects

---
### Try asking me something like:
- *"Explain binary search with code"*
- *"How does React's useEffect work?"*
- *"Design a URL shortener"*
- *"What are the top DSA topics for Amazon?"*

> ⚙️ **Note:** For full AI-powered responses, add your \`GEMINI_API_KEY\` to \`server/.env\`. Currently running in demo mode.

What would you like to learn? 🚀`
}

// ── Gemini client singleton ────────────────────────────────────────────────────
let geminiModel = null

const getGeminiModel = () => {
  if (geminiModel) return geminiModel
  if (!env.GEMINI_API_KEY) return null   // Signals "use mock"

  const client = new GoogleGenerativeAI(env.GEMINI_API_KEY)
  geminiModel = client.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: SYSTEM_INSTRUCTION,
    safetySettings: SAFETY_SETTINGS,
    generationConfig: GENERATION_CONFIG,
  })
  logger.info('Gemini model initialised: gemini-1.5-flash')
  return geminiModel
}

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Sends a user prompt to Gemini (or mock fallback) and returns the reply.
 * @param {string} message
 * @returns {Promise<string>}
 */
export const getAIResponse = async (message) => {
  const model = getGeminiModel()

  // ── No API key → smart mock ──────────────────────────────────────────────────
  if (!model) {
    logger.warn('GEMINI_API_KEY not set — using mock AI response')
    return getMockResponse(message)
  }

  // ── Gemini path ──────────────────────────────────────────────────────────────
  try {
    logger.info(`Sending prompt to Gemini (${message.length} chars)`)

    const result = await model.generateContent(message)
    const response = result.response

    const finishReason = response.candidates?.[0]?.finishReason
    if (finishReason === 'SAFETY') {
      throw new AppError('Your message was flagged by safety filters. Please rephrase.', 422)
    }

    const text = response.text()
    if (!text || text.trim().length === 0) {
      return getMockResponse(message)
    }

    logger.info(`Gemini responded (${text.length} chars)`)
    return text

  } catch (error) {
    if (error instanceof AppError) throw error

    const msg = error.message || ''

    if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid')) {
      logger.warn('Gemini API key invalid — falling back to mock response')
      geminiModel = null
      return getMockResponse(message)
    }

    if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota')) {
      logger.warn('Gemini quota exceeded — falling back to mock response')
      return getMockResponse(message)
    }

    if (msg.includes('DEADLINE_EXCEEDED') || msg.includes('timeout')) {
      logger.warn('Gemini timeout — falling back to mock response')
      return getMockResponse(message)
    }

    logger.error('Unexpected Gemini error — falling back to mock:', msg)
    return getMockResponse(message)
  }
}
