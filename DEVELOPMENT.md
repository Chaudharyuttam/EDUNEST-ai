# Development Guidelines

## 🎯 Project Overview

EduNest AI is a modern educational platform built with React, Vite, and Tailwind CSS. The project follows a component-based architecture with clear separation of concerns.

## 📁 Folder Structure

```
src/
├── components/      # Reusable React components
├── pages/          # Page components
├── utils/          # Utility functions and hooks
├── constants/      # Configuration and constants
├── assets/         # Images, fonts, and other assets
└── App.jsx         # Main app component
```

## 🧩 Component Best Practices

### Creating New Components

1. **Functional Components Only**: Use React hooks, no class components
2. **Naming**: Use PascalCase for component files (e.g., `MyComponent.jsx`)
3. **Structure**: 
   ```jsx
   import React from 'react'
   import { SomeIcon } from 'lucide-react'
   
   const MyComponent = ({ prop1, prop2 }) => {
     return (
       <div className="...">
         {/* Content */}
       </div>
     )
   }
   
   export default MyComponent
   ```

4. **Props**: Always define and document required props
5. **Styling**: Use Tailwind CSS classes, no CSS-in-JS libraries
6. **Icons**: Use `lucide-react` for all icons

### Reusable Components

Keep components focused and reusable:
- **FeatureCard**: Display feature information with icon
- **TestimonialCard**: Display testimonials with ratings
- **Navbar**: Navigation and theme toggle
- **Footer**: Site footer with links

## 🎨 Styling Guidelines

### Tailwind CSS

- Use utility classes for all styling
- Follow the blue (primary) and purple (secondary) color palette
- Responsive design: mobile-first approach
  ```jsx
  className="text-sm md:text-base lg:text-lg"
  ```

### Dark Mode

- Use `dark:` prefix for dark mode styles
- All components should support dark mode
- Theme toggle is handled via `useTheme()` hook
  ```jsx
  className="bg-white dark:bg-slate-900"
  ```

### Custom Classes

Reusable utilities defined in `index.css`:
- `.btn-primary`: Primary button style
- `.btn-secondary`: Secondary button style
- `.card`: Card container style
- `.container-custom`: Max-width container
- `.section-title`: Section heading style
- `.section-subtitle`: Section subtitle style

## 🔧 Routing

Using React Router v6:
```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
</Routes>
```

Add new routes in `App.jsx` inside the Routes component.

## 🌓 Dark Mode

Dark mode is managed through:
1. **ThemeContext**: Manages theme state globally
2. **useTheme Hook**: Access theme in any component
3. **localStorage**: Persists theme preference
4. **System Preference**: Respects OS dark mode setting

Usage:
```jsx
const { isDark, toggleTheme } = useTheme()
```

## 📦 Icons

Using `lucide-react` for all icons:
```jsx
import { Menu, X, Moon, Sun } from 'lucide-react'

<Menu size={24} className="text-primary-600" />
```

[Browse available icons](https://lucide.dev)

## 🚀 Performance Tips

1. **Code Splitting**: React Router automatically code-splits pages
2. **Image Optimization**: Use emoji or icons instead of image files
3. **Component Memoization**: Use `React.memo()` for expensive components
4. **Lazy Loading**: Use `React.lazy()` for route-based code splitting

## 🧪 Testing

Future: Add Jest and React Testing Library

## 📝 Code Style

- **ES6+**: Modern JavaScript syntax
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Comments**: Add JSDoc comments for complex logic
- **Formatting**: Consistent indentation (2 spaces)

Example:
```jsx
/**
 * Displays a feature card with icon and description
 * @param {Object} props - Component props
 * @param {React.Component} props.icon - Icon component
 * @param {string} props.title - Card title
 * @param {string} props.description - Card description
 */
const FeatureCard = ({ icon: Icon, title, description }) => {
  // Component logic
}
```

## 🔐 Security

- No hardcoded secrets in code
- Use `.env` files for environment variables
- Sanitize user inputs if accepting any
- Follow React security best practices

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

## 📚 Resources

- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Vite Docs](https://vitejs.dev)
- [React Router Docs](https://reactrouter.com)
- [Lucide Icons](https://lucide.dev)

## ❓ FAQ

**Q: How do I add a new page?**
A: Create a new file in `src/pages/`, then add a route in `App.jsx`.

**Q: How do I customize colors?**
A: Edit `tailwind.config.js` to change the primary and secondary color values.

**Q: How do I use the theme hook?**
A: Import `useTheme` from `utils/themeContext.jsx` and use it in any component.

**Q: Can I use CSS modules or styled-components?**
A: No, the project uses only Tailwind CSS for consistency and performance.

## 🐛 Common Issues

**Issue**: Tailwind classes not working
- **Solution**: Restart dev server, ensure all CSS files are imported

**Issue**: Dark mode not persisting
- **Solution**: Clear localStorage and browser cache

**Issue**: Icons not displaying
- **Solution**: Ensure `lucide-react` is installed (`npm install lucide-react`)
