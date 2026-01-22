# 🚀 Quick Start Guide

Get PsyCoach running in 2 minutes!

## Prerequisites

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)

## Setup

```bash
# 1. Navigate to the project
cd PsAICoach

# 2. Install dependencies
pnpm install

# 3. Start the development server
pnpm dev
```

The app will automatically open at **http://localhost:5173** 🎉

## What to Try

### 1. **Conversation Tab** 💬
- Type "I'm feeling anxious" 
- See the AI detect the emotion and respond with empathy
- Notice the reflection prompt that appears

### 2. **Journal Tab** 📔
- Write a journal entry (it will be encrypted!)
- Save it and see the confirmation
- Try exporting your journal

### 3. **CBT Tools Tab** 🧩
- Explore cognitive distortions
- Read reframing strategies
- Review behavioral experiments

### 4. **Reality Check Tab** 🔍
- Type a concerning thought
- Get a reality-testing checklist
- Review grounding techniques

### 5. **Insights Dashboard** 📊
- See mock therapist insights
- Review mood trends
- Check safety alerts

## Testing Crisis Detection

Try these messages (they won't actually contact anyone - it's a demo):

- "I'm feeling really anxious today" → Supportive response
- "I don't want to hurt myself" → Normal response (negation detected!)
- "I want to hurt myself" → Crisis protocol activated ⚠️

## Key Features to Explore

### Encrypted Journal
1. Write a journal entry
2. Close the browser
3. Reopen and check the journal - it's still there!
4. Open DevTools → Application → LocalStorage → See the encrypted data

### Mood Tracking
- The chart shows a 14-day mood trend
- In production, this would update as you use the app

### Grounding Exercises
- Click on any grounding technique in the Reality Check tab
- Each has step-by-step instructions

## What Makes This Special

### 🏗️ **Agent Architecture**
```javascript
// Located in: web/modules/agent.js
const agent = new PsyCoachAgent();
await agent.processMessage("I'm anxious");
```
- Clean separation of concerns
- Easy to swap AI providers
- Tools can be called by AI or directly

### 🔐 **Encrypted Storage**
```javascript
// Located in: web/modules/secureStorage.js
const storage = new SecureStorage();
await storage.saveSecure('key', { data: 'sensitive' });
```
- AES-GCM 256-bit encryption
- Unique IV per encryption
- All in-browser, no server

### 🛠️ **Tool System**
```javascript
// Located in: web/modules/tools.js
await agent.executeGroundingExercise('high', 'breathing');
await agent.executeCBTReframing('I always fail');
await agent.executeRealityCheck('I heard voices');
```
- 5 built-in tools
- Easy to add more
- AI-callable or UI-direct

## File Structure

```
PsAICoach/
├── web/
│   ├── modules/           # All the logic
│   │   ├── agent.js       # Main orchestrator
│   │   ├── aiProvider.js  # AI abstraction
│   │   ├── tools.js       # AI tools
│   │   ├── crisisDetector.js
│   │   ├── journalManager.js
│   │   ├── secureStorage.js
│   │   └── uiUtils.js
│   ├── app.js             # UI logic
│   ├── data.js            # Mock data
│   ├── index.html         # HTML
│   └── styles.css         # Styles
├── package.json           # Dependencies
├── vite.config.js         # Build config
└── README.md              # Full docs
```

## Next Steps

### To Add Real AI:
Read `AI_INTEGRATION_GUIDE.md`

### To Understand Architecture:
Read `ARCHITECTURE.md`

### To Deploy:
```bash
pnpm build  # Creates dist/ folder
```

Then deploy `dist/` to any static host (Vercel, Netlify, etc.)

## Common Commands

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm preview  # Preview production build
```

## Troubleshooting

**Port 5173 already in use?**
```bash
# Kill the process
lsof -ti:5173 | xargs kill -9
# Or use a different port
pnpm dev --port 3000
```

**Module not found?**
```bash
# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Encryption not working?**
- Must use HTTPS or localhost
- Check browser console for errors
- Verify Web Crypto API is available

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

Requires: ES6 modules, Web Crypto API, CSS Grid

## Resources

- **Full Documentation**: [README.md](./README.md)
- **Architecture Guide**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **AI Integration**: [AI_INTEGRATION_GUIDE.md](./AI_INTEGRATION_GUIDE.md)

## Get Help

If something's not working:
1. Check the browser console for errors
2. Verify all files are present
3. Try `pnpm install` again
4. Check Node.js version (`node --version` should be 18+)

---

**You're all set!** Explore the app and see how the agent architecture works. 🧠✨

