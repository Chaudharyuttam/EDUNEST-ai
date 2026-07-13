# EduNest AI

A modern, responsive educational platform built with React, Vite, and Tailwind CSS.

## 🚀 Features

- **React + Vite**: Lightning-fast development and build process
- **Tailwind CSS**: Beautiful, utility-first styling with dark mode support
- **React Router**: Smooth navigation between pages
- **Responsive Design**: Mobile-first approach with breakpoints for all devices
- **Dark Mode**: Built-in dark mode toggle with persistent storage
- **Modern Components**: Reusable, well-organized component architecture
- **Beautiful UI**: Blue and purple gradient color palette with smooth animations
- **AI-Powered Learning**: Features highlight personalized learning experiences

## 📁 Project Structure

```
edunest/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Navigation bar with theme toggle
│   │   ├── Footer.jsx           # Footer with links and social icons
│   │   ├── HeroSection.jsx      # Hero section with CTA
│   │   ├── FeaturesSection.jsx  # Features showcase
│   │   ├── FeatureCard.jsx      # Reusable feature card
│   │   ├── TestimonialsSection.jsx # Student testimonials
│   │   ├── TestimonialCard.jsx  # Reusable testimonial card
│   │   └── CTASection.jsx       # Call-to-action section
│   ├── pages/
│   │   └── Home.jsx             # Home page
│   ├── utils/
│   │   └── themeContext.jsx     # Dark mode context provider
│   ├── App.jsx                  # Main app component with routing
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global styles with Tailwind
├── index.html                   # HTML entry point
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
├── package.json                 # Project dependencies
└── .gitignore                   # Git ignore rules
```

## 🛠️ Installation

1. **Navigate to the project directory**
   ```bash
   cd edunest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## 🚀 Running the Project

### Development Server
```bash
npm run dev
```
The app will open at `http://localhost:3000` with hot reload enabled.

### Production Build
```bash
npm run build
```
Creates an optimized production build in the `dist/` folder.

### Preview Build
```bash
npm run preview
```
Preview the production build locally.

### Linting
```bash
npm run lint
```

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color palette:
- **Primary**: Blue gradient colors
- **Secondary**: Purple gradient colors

### Dark Mode
The dark mode is automatically enabled/disabled based on system preferences and can be toggled via the theme button in the navbar.

### Components
All components are located in `src/components/` and can be easily customized:
- **Navbar.jsx**: Update navigation links and branding
- **Footer.jsx**: Add social links and footer content
- **HeroSection.jsx**: Modify headline and CTA text
- **FeaturesSection.jsx**: Add/remove features
- **TestimonialsSection.jsx**: Update testimonials
- **CTASection.jsx**: Customize call-to-action messaging

## 📦 Dependencies

- **react**: ^18.2.0 - UI library
- **react-dom**: ^18.2.0 - React DOM binding
- **react-router-dom**: ^6.21.0 - Routing library
- **lucide-react**: ^0.292.0 - Icon library
- **tailwindcss**: ^3.3.6 - CSS framework
- **vite**: ^5.0.8 - Build tool

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Environment Setup

No environment variables required for basic functionality. The project is ready to use out of the box.

## 🔧 Development Tips

- Use `lucide-react` icons instead of importing images for better performance
- Components use Tailwind's dark mode class for theme switching
- CSS animations are defined in `index.css` using `@layer` directives
- All buttons follow consistent styling with `.btn-primary` and `.btn-secondary` utilities

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.
