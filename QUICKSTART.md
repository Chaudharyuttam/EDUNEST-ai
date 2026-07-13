# 🚀 Quick Start Guide

Welcome to EduNest AI! Here's everything you need to get started.

## ⚡ Quick Setup (2 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will automatically open at `http://localhost:3000`

## 📂 What's Included

### ✅ Complete Project Setup
- ✨ React 18 with Vite
- 🎨 Tailwind CSS with dark mode
- 🧭 React Router for navigation
- 🎭 8+ reusable components
- 🌓 Dark/Light theme toggle
- 📱 Fully responsive design
- 🎯 Beautiful animations

### 📁 Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── Navbar.jsx       # Navigation bar
│   ├── Footer.jsx       # Footer
│   ├── HeroSection.jsx  # Hero with CTA
│   ├── FeaturesSection.jsx
│   ├── FeatureCard.jsx
│   ├── TestimonialsSection.jsx
│   ├── TestimonialCard.jsx
│   ├── CTASection.jsx
│   └── index.js         # Component exports
├── pages/               # Page components
│   └── Home.jsx         # Home page
├── utils/               # Utilities
│   └── themeContext.jsx # Dark mode context
├── constants/           # Configuration
│   └── config.js        # App constants
├── assets/              # Images, fonts, etc
├── App.jsx              # Main app
├── main.jsx             # Entry point
└── index.css            # Global styles
```

## 🎯 Key Features

### 🎨 Beautiful Design
- Modern blue & purple gradient palette
- Smooth animations and transitions
- Dark mode support with persistence
- Mobile-first responsive design

### 🧩 Reusable Components
Each component is self-contained and easy to customize:
- **Navbar**: Sticky navigation with theme toggle
- **HeroSection**: Main landing section with stats
- **FeatureCard**: Display feature with icon & description
- **TestimonialCard**: User testimonials with ratings
- **Footer**: Multi-column footer with social links
- **CTASection**: Call-to-action with gradient background

### 🌓 Dark Mode
- Automatic theme detection (OS preference)
- One-click toggle in navbar
- Persistent storage (localStorage)
- All components support both themes

## 🛠️ Available Commands

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## 🎨 Customization

### 1. Change Colors
Edit `tailwind.config.js`:
```js
colors: {
  primary: { /* Your blue colors */ },
  secondary: { /* Your purple colors */ }
}
```

### 2. Add Navigation Links
Edit `src/components/Navbar.jsx`:
```jsx
const menuItems = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  // Add more items here
]
```

### 3. Update Hero Section
Edit `src/components/HeroSection.jsx` to change:
- Headline text
- Description
- Call-to-action buttons
- Statistics

### 4. Add New Pages
1. Create page in `src/pages/MyPage.jsx`
2. Add route in `src/App.jsx`:
```jsx
<Route path="/my-page" element={<MyPage />} />
```

### 5. Add New Components
1. Create in `src/components/MyComponent.jsx`
2. Export in `src/components/index.js`
3. Use in other components

## 📚 Component Usage Examples

### Using a Component
```jsx
import { FeatureCard } from '../components'
import { Zap } from 'lucide-react'

export default function MyPage() {
  return (
    <FeatureCard 
      icon={Zap}
      title="Fast Performance"
      description="Lightning quick load times"
    />
  )
}
```

### Using Dark Mode Hook
```jsx
import { useTheme } from '../utils/themeContext'

export default function MyComponent() {
  const { isDark, toggleTheme } = useTheme()
  
  return (
    <button onClick={toggleTheme}>
      {isDark ? 'Light Mode' : 'Dark Mode'}
    </button>
  )
}
```

### Using Icons
```jsx
import { Menu, X, Moon, Sun, Zap } from 'lucide-react'

export default function MyComponent() {
  return (
    <div>
      <Menu size={24} className="text-primary-600" />
      <Moon size={20} />
      <Zap className="text-secondary-500" />
    </div>
  )
}
```

## 🎯 Styling Guidelines

### Button Styles
```jsx
{/* Primary button */}
<button className="btn-primary">Click me</button>

{/* Secondary button */}
<button className="btn-secondary">Click me</button>
```

### Card Component
```jsx
<div className="card">
  {/* Card content */}
</div>
```

### Container
```jsx
<div className="container-custom">
  {/* Content with max-width and padding */}
</div>
```

### Responsive Text
```jsx
<h1 className="text-2xl md:text-4xl lg:text-5xl">
  Responsive Heading
</h1>
```

### Dark Mode
```jsx
<div className="bg-white dark:bg-slate-900 text-black dark:text-white">
  Content that changes with theme
</div>
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Deploy to GitHub Pages
1. Update `vite.config.js` with correct base path
2. Run `npm run build`
3. Deploy `dist/` folder

## 📖 Learn More

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)
- [React Router](https://reactrouter.com)
- [Lucide Icons](https://lucide.dev)

## ❓ Need Help?

1. Check `DEVELOPMENT.md` for detailed guidelines
2. Review component examples in `src/components/`
3. Read `tailwind.config.js` for style configuration
4. Check `src/constants/config.js` for site settings

## 🎉 You're Ready!

Your modern React application is ready to go. Start the dev server and begin building!

```bash
npm run dev
```

Happy coding! 🚀
