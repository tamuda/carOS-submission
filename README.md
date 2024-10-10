# CarOS - Intelligent Car Diagnostics System

A premium, Apple-inspired car diagnostics application with OBD-II integration, built with Next.js, TypeScript, and modern UI frameworks.

## 🚀 Features

- **Progressive Web App (PWA)** 📱 - Install on your iPhone like a native app!
- **Real-time Dashboard** - Monitor vehicle metrics with glassmorphic cards
- **Interactive Metric Cards** - Click any metric to learn what it means (RPM, Coolant, etc.)
- **AI Diagnostics** - Natural language insights for car issues
- **AI Video Mechanic** 🎥 - **REAL voice calls with AI using OpenAI Realtime API!**
  - Turn on your camera and mic
  - AI mechanic sees through your camera
  - Real-time voice conversation with push-to-talk
  - Step-by-step repair guidance
  - Live transcription of conversation
- **Interactive Full Scan** - 6-step diagnostic scan with live instructions
- **Predictive Insights** - Forecast future maintenance needs
- **Multi-Step Loader** - Beautiful Aceternity-inspired connection flow
- **Apple-Inspired Design** - Premium glassmorphism with smooth animations
- **OBD-II Integration** - Connect to your car's diagnostic port

## 🎨 Design System

- **Glassmorphism Effects** - Frosted glass cards with backdrop blur
- **Subtle Animations** - Smooth, Apple-like transitions using Framer Motion
- **Dark Theme** - Elegant dark gradient background
- **No Neon Colors** - Replaced cheap neon glows with premium white/gray tones
- **Responsive Layout** - Mobile-first design optimized for car dashboards

## 🛠️ Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui + Aceternity UI
- **Animations:** Framer Motion
- **Icons:** Heroicons (via SVG paths)

## 📦 Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Set up environment variables
# Create a .env.local file in the root directory and add:
# OPENAI_API_KEY=sk-proj-your-key-here

# Get your OpenAI API key from: https://platform.openai.com/api-keys

# Run development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### 🔑 OpenAI API Key Setup

The AI Video Mechanic feature requires an OpenAI API key with access to the Realtime API:

1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Create a `.env.local` file in the root directory
4. Add: `OPENAI_API_KEY=sk-proj-your-key-here`
5. Restart the dev server

**Note:** The Realtime API is currently in beta and requires GPT-4 API access.

## 📱 Install as iPhone App (PWA)

CarOS is a Progressive Web App that you can install on your iPhone:

### Installation Steps:

1. **Open Safari** on your iPhone
2. **Navigate to** your deployed CarOS URL
3. **Tap the Share button** (square with arrow pointing up)
4. **Scroll down** and tap "Add to Home Screen"
5. **Tap "Add"** in the top right
6. **Done!** CarOS now appears on your home screen like a native app

### PWA Features:

- ✅ Works offline (cached assets)
- ✅ Full-screen experience (no browser UI)
- ✅ App icon on home screen
- ✅ Fast loading with service worker
- ✅ iOS status bar integration
- ✅ Native-like performance

## 🏗️ Project Structure

```
carAI/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with fonts
│   │   ├── page.tsx             # Main app with screen routing
│   │   └── globals.css          # Global styles + glassmorphism
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx       # shadcn button
│   │   │   ├── card.tsx         # shadcn card
│   │   │   └── multi-step-loader.tsx  # Aceternity loader
│   │   ├── splash-screen.tsx    # Welcome screen
│   │   ├── connect-vehicle.tsx  # OBD-II connection
│   │   ├── dashboard.tsx        # Main dashboard
│   │   ├── ai-diagnostics.tsx   # Diagnostics screen
│   │   ├── predictive-insights.tsx  # Predictions
│   │   ├── profile-settings.tsx # Settings
│   │   └── navigation.tsx       # Bottom nav
│   └── lib/
│       └── utils.ts             # Utility functions
└── package.json
```

## 🎯 Screens

1. **Splash Screen** - Animated logo with floating animation
2. **Connect Vehicle** - Multi-step loader for OBD-II pairing
3. **Dashboard** - Vehicle health overview with live metrics
4. **AI Diagnostics** - Error code analysis with recommendations
5. **Predictive Insights** - Maintenance forecasting
6. **Profile Settings** - Vehicle info and preferences

## 🎨 Design Highlights

### Glassmorphism Classes

- `.glass-card` - Standard frosted glass effect
- `.glass-card-premium` - Enhanced glass with stronger blur
- `.glass-morphism` - Gradient glass variant

### Animations

- `float` - Subtle floating motion
- `pulse-subtle` - Gentle pulsing
- `radar-wave` - Expanding circles
- `shimmer` - Light sweep effect
- `slide-up` - Fade up entrance
- `scale-in` - Scale up entrance

## 🔧 Customization

### Colors

The app uses white/gray tones for a premium feel:

- Primary: White (`#FFFFFF`)
- Background: Dark gradient (`#0a0a0a` to `#050505`)
- Accents: White with opacity (`white/60`, `white/80`)

### Fonts

- **Display:** Geist Sans
- **Monospace:** Geist Mono

## 📱 OBD-II Integration (Future)

To integrate with real OBD-II devices:

1. Add Web Bluetooth API or serial port connection
2. Implement OBD-II protocol parser
3. Map PIDs to dashboard metrics
4. Add real-time data streaming

## 🚀 Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 📄 License

MIT

## 🙏 Credits

- UI Components: [shadcn/ui](https://ui.shadcn.com/)
- Animations: [Aceternity UI](https://ui.aceternity.com/)
- Icons: [Heroicons](https://heroicons.com/)
- Framework: [Next.js](https://nextjs.org/)

---

**Built with ❤️ for car enthusiasts**
