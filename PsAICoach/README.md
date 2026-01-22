# PsAICoSys

**Your AI-Powered Mental Health Companion**

PsAICoSys (Psychosis AI Companion System) is a Next.js-based companion app designed to support individuals managing psychosis and schizophrenia symptoms. Built with modern web technologies including React, TypeScript, and Tailwind CSS.

## ✨ Features

### 🧠 AI Companion Chat
- Always-available conversational support
- Context-aware responses
- Crisis detection and resource links
- Persistent chat history

### 📸 Reality Validation with AR
- Camera capture with AR overlay
- Timestamped reality checks
- Grid overlay for spatial validation
- Photo and video support

### 📖 Reflective Journaling
- Daily prompts and mood tracking
- Persistent local storage
- Mood trend visualization
- Recent moments timeline

### 🛠️ CBT & Wellness Tools
- **Reality Check**: Validate uncertain experiences
- **Grounding Exercises**: 5-4-3-2-1 technique
- **CBT Toolkit**: Identify and reframe cognitive distortions
- **Mood Tracking**: Monitor emotional patterns

### 📊 Insights Dashboard
- Usage statistics
- Mood summaries
- Weekly highlights
- Streak tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm installed

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

The app will be available at:
- **Main App**: http://localhost:3000
- **Landing Page**: http://localhost:3000/landing

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Font Awesome 6
- **Charts**: Chart.js (planned)
- **Storage**: LocalStorage with encryption (planned)

## 📂 Project Structure

```
PsAICoSys/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── layout.tsx         # Root layout with metadata
│   │   ├── page.tsx           # Main companion app
│   │   ├── landing/           # Marketing landing page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── CompanionHeader.tsx
│   │   ├── BottomNavigation.tsx
│   │   ├── QuickCaptureBar.tsx
│   │   ├── CameraModal.tsx
│   │   ├── CrisisBanner.tsx
│   │   └── sections/          # Main app sections
│   │       ├── ConversationSection.tsx
│   │       ├── JournalSection.tsx
│   │       ├── ToolsSection.tsx
│   │       └── InsightsSection.tsx
│   ├── contexts/              # React contexts
│   │   └── AppContext.tsx     # Global app state
│   └── lib/                   # Utilities (future)
├── public/                    # Static assets
├── web/                       # Legacy vanilla JS version (deprecated)
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── next.config.ts             # Next.js configuration
```

## 🎨 Design Philosophy

- **Companion-First**: Always-on header with avatar and status
- **Accessible Navigation**: Bottom tab bar for mobile-first experience
- **Quick Actions**: One-tap access to camera, video, and voice
- **Glass Morphism**: Modern, professional UI with depth
- **Gradient Accents**: Consistent purple-to-pink brand colors

## 🔐 Privacy & Safety

- **Local-First**: All data stored locally on device
- **No Server**: No personal data sent to external servers (currently)
- **Crisis Resources**: Integrated links to 988, Crisis Text Line, 911
- **Disclaimer**: PsAICoSys is a wellness tool, not a replacement for professional medical care

## 🛣️ Roadmap

- [ ] Web Speech API integration for voice
- [ ] Video recording with AR overlay
- [ ] Chart.js integration for mood trends
- [ ] PWA support for offline usage
- [ ] End-to-end encryption for local storage
- [ ] Export journal entries
- [ ] Customizable themes
- [ ] Multi-language support

## 📝 License

MIT License - See LICENSE file for details

## ⚠️ Disclaimer

PsAICoSys is a prototype wellness companion and educational tool. It is **not** a substitute for professional medical diagnosis, treatment, or therapy. Always consult with qualified healthcare providers for mental health concerns.

### Emergency Resources
- **Crisis Hotline**: 988 (24/7)
- **Crisis Text Line**: Text HOME to 741741
- **Emergency Services**: 911

## 💡 Contributing

This is a research prototype. Contributions, feedback, and suggestions are welcome!

---

Built with 💜 for mental health awareness and support
