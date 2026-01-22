# 🏗️ PsyCoach Architecture Documentation

## Overview

PsyCoach is built with a **modular agent-based architecture** that separates concerns and makes it easy to swap AI providers, add new tools, and extend functionality.

## Core Principles

1. **Separation of Concerns**: Each module has a single, well-defined responsibility
2. **Provider Abstraction**: AI provider is abstracted to allow easy swapping
3. **Tool Pattern**: Tools are self-contained, reusable, and AI-callable
4. **Security First**: Encryption, validation, and crisis detection built-in
5. **Progressive Enhancement**: Works without AI, better with AI

## Module Breakdown

### 1. Agent Layer (`agent.js`)

**Purpose**: Orchestrates the entire conversation flow

**Responsibilities**:
- Manages conversation history
- Coordinates tool execution
- Handles crisis escalation
- Provides fallback responses

**Key Methods**:
```javascript
async processMessage(userMessage)
  → Processes user input through crisis detection, mood tracking, and response generation

async executeGroundingExercise(intensity, preferredType)
  → Directly invokes grounding tool for UI

async executeCBTReframing(thought)
  → Directly invokes CBT reframing tool

async executeRealityCheck(experience, type)
  → Directly invokes reality check tool

clearHistory()
  → Resets conversation state

exportConversation()
  → Exports conversation for analysis/backup
```

### 2. AI Provider Layer (`aiProvider.js`)

**Purpose**: Abstracts AI provider implementation

**Implementations**:
- `AIProvider` (base class)
- `MockAIProvider` (current, pattern-based)
- `VercelAIProvider` (ready for Vercel AI SDK)

**Key Methods**:
```javascript
async chat(messages, options)
  → Single-turn conversation

async *chatStream(messages, options)
  → Streaming conversation (for real-time responses)

registerTool(name, tool)
  → Registers a callable tool

getTools()
  → Lists available tools

executeTool(name, args)
  → Executes a registered tool
```

**Adding a New Provider**:
```javascript
class CustomAIProvider extends AIProvider {
  constructor(config) {
    super(config);
    // Initialize your AI service
  }

  async chat(messages, options) {
    // Call your AI API
    // Return standardized response
  }

  async *chatStream(messages, options) {
    // Stream from your AI API
    // Yield chunks
  }
}
```

### 3. Tools Layer (`tools.js`)

**Purpose**: Provides callable functions that AI agents can use

**Tool Structure**:
```javascript
class ToolName {
  constructor() {
    this.description = 'What this tool does';
    this.parameters = {
      type: 'object',
      properties: {
        param1: {
          type: 'string',
          description: 'Parameter description'
        }
      },
      required: ['param1']
    };
  }

  async execute({ param1 }) {
    // Tool logic
    return {
      action: 'action_taken',
      result: 'result_data'
    };
  }
}
```

**Available Tools**:

1. **CrisisDetectionTool**
   - Detects crisis keywords and patterns
   - Analyzes conversation context
   - Returns severity and appropriate responses
   - Provides crisis resources

2. **MoodTrackingTool**
   - Extracts mood indicators from messages
   - Tracks mood over time
   - Analyzes trends (improving/declining/stable)
   - Stores data in localStorage

3. **GroundingExerciseTool**
   - Selects appropriate grounding exercise based on intensity
   - Provides step-by-step instructions
   - Types: sensory, breathing, physical, cognitive

4. **CBTReframingTool**
   - Identifies cognitive distortions
   - Suggests reframing strategies
   - Provides Socratic questions

5. **RealityCheckTool**
   - Guides reality testing
   - Type-specific checklists (auditory, visual, paranoid)
   - Intensity tracking

**Adding a New Tool**:
```javascript
// In tools.js
export class MyNewTool {
  constructor() {
    this.description = 'Description for AI to understand when to use this';
    this.parameters = {
      type: 'object',
      properties: {
        // Define parameters
      },
      required: ['requiredParam']
    };
  }

  async execute({ requiredParam }) {
    // Your logic here
    return {
      action: 'what_happened',
      data: 'result_data',
      response: 'message_to_user'
    };
  }
}

// In agent.js, register the tool
registerTools() {
  this.provider.registerTool('my_new_tool', new MyNewTool());
}
```

### 4. Crisis Detection (`crisisDetector.js`)

**Purpose**: Advanced crisis detection with context awareness

**Features**:
- Multi-phrase detection with severity levels
- Negation awareness ("don't want to hurt myself" vs "want to hurt myself")
- Sentiment analysis
- Conversation history tracking
- Escalation pattern detection

**Detection Flow**:
```
User Message
    ↓
Keyword Detection
    ↓
Negation Check ──→ Reduce Severity
    ↓
Sentiment Analysis
    ↓
Context Analysis (history)
    ↓
Risk Level Calculation
    ↓
Return: isCrisis / elevated / normal
```

### 5. Conversation Management (`conversationManager.js`)

**Purpose**: Manages conversation flow and response generation

**Features**:
- Pattern-based response matching
- Multiple response variations
- Integration with crisis detector
- Reflective prompts

### 6. Journal Management (`journalManager.js`)

**Purpose**: Manages encrypted journal entries

**Features**:
- Secure storage using SecureStorage
- Random daily prompts
- Entry management (save, load, delete)
- Export functionality

**Data Flow**:
```
User Input → journalManager.saveEntry()
    ↓
JSON.stringify()
    ↓
secureStorage.encrypt() [AES-GCM]
    ↓
localStorage.setItem()
```

### 7. Secure Storage (`secureStorage.js`)

**Purpose**: Provides AES-GCM encryption for localStorage

**Encryption Process**:
```
1. Generate/Load AES-GCM 256-bit key
2. Store key in localStorage (already encrypted by browser)
3. For each save:
   - Generate random 12-byte IV
   - Encrypt data with key + IV
   - Combine IV + encrypted data
   - Base64 encode
   - Store in localStorage
4. For each load:
   - Retrieve from localStorage
   - Base64 decode
   - Extract IV and encrypted data
   - Decrypt with key + IV
   - Parse JSON
```

**Security Considerations**:
- Keys stay in browser
- Each encryption uses unique IV
- Web Crypto API (native, secure)
- No key transmission

### 8. UI Utilities (`uiUtils.js`)

**Purpose**: Reusable UI helper functions

**Functions**:
- `timestamp()` - Format current time
- `formatDate()` - Format dates
- `showNotification()` - Toast notifications
- `debounce()` - Debounce function calls
- `animateValue()` - Number animations
- `renderCardList()` - Render lists with templates

## Data Flow

### Message Flow

```
User Types Message
    ↓
app.js: conversationForm submit
    ↓
pushMessage(text, 'user') → UI
    ↓
agent.processMessage(text)
    ↓
crisisDetector.detect(text)
    ├─→ Crisis Detected → Crisis Response + Banner
    ├─→ Elevated Concern → Warning Response
    └─→ Normal → Continue
        ↓
    moodTool.execute() [background]
        ↓
    provider.chat(messages)
        ↓
    pattern matching → response
        ↓
    pushMessage(response, 'bot') → UI
        ↓
    Update insight card
```

### Journal Flow

```
User Writes Entry
    ↓
journalManager.saveEntry(text)
    ↓
Create entry object { id, date, text }
    ↓
Load existing entries (decrypt)
    ↓
Append new entry
    ↓
Encrypt all entries
    ↓
Save to localStorage
    ↓
Show feedback to user
```

### Reality Check Flow

```
User Describes Experience
    ↓
realityForm submit
    ↓
agent.executeRealityCheck(text, type)
    ↓
realityCheckTool.execute({ experience, type })
    ↓
inferType(experience) → auditory/visual/paranoid
    ↓
getChecklist(type) → specific steps
    ↓
Return checklist + intro
    ↓
Render in UI with animation
```

## State Management

### Conversation State
- **Location**: `agent.messages[]`
- **Structure**: Array of message objects
- **Persistence**: In-memory (cleared on refresh)
- **Future**: Could persist to encrypted localStorage

### Journal State
- **Location**: localStorage (encrypted)
- **Key**: `psycoach-journal-encrypted`
- **Structure**: Array of entry objects
- **Encryption**: AES-GCM with unique key per user

### Mood State
- **Location**: localStorage
- **Key**: `psycoach-mood-log`
- **Structure**: Array of mood entries
- **Limit**: Last 100 entries

### Crisis State
- **Location**: `crisisDetector.conversationHistory[]`
- **Purpose**: Track conversation context
- **Limit**: Last 10 messages
- **Used For**: Escalation pattern detection

## Integration Patterns

### Adding Vercel AI SDK

1. **Install Dependencies**:
```bash
pnpm add ai @ai-sdk/openai
```

2. **Create Provider**:
```javascript
import { openai } from '@ai-sdk/openai';
import { generateText, streamText } from 'ai';

export class VercelAIProvider extends AIProvider {
  async chat(messages, options) {
    const result = await generateText({
      model: openai('gpt-4-turbo'),
      messages,
      tools: this.getToolsForAI(),
      system: this.getSystemPrompt()
    });
    return result;
  }
}
```

3. **Update Agent**:
```javascript
const agent = new PsyCoachAgent({
  provider: new VercelAIProvider({ apiKey: import.meta.env.VITE_OPENAI_API_KEY })
});
```

### Adding Backend API

1. **Create API Client**:
```javascript
class APIClient {
  async sendMessage(message) {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
      headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
  }
}
```

2. **Create API Provider**:
```javascript
class APIAIProvider extends AIProvider {
  constructor(apiClient) {
    super();
    this.client = apiClient;
  }

  async chat(messages) {
    return await this.client.sendMessage(messages[messages.length - 1]);
  }
}
```

3. **Use in Agent**:
```javascript
const client = new APIClient();
const agent = new PsyCoachAgent({
  provider: new APIAIProvider(client)
});
```

## Performance Considerations

### Optimization Techniques Used

1. **Lazy Loading**: Modules loaded only when needed
2. **Debouncing**: Input handlers debounced
3. **Request Animation Frame**: Smooth animations
4. **CSS Transitions**: GPU-accelerated
5. **Minimal Dependencies**: Only Chart.js for visualization

### Monitoring Points

- Message processing time
- Encryption/decryption time
- Tool execution time
- UI render time

## Security Best Practices

### Current Implementation

✅ Input validation (trim, check length)
✅ Output escaping (textContent, not innerHTML where possible)
✅ AES-GCM encryption for sensitive data
✅ No eval() or unsafe code execution
✅ CSP-ready (no inline scripts)
✅ Crisis detection with multiple layers

### Future Enhancements

- [ ] Rate limiting on API calls
- [ ] Content Security Policy headers
- [ ] Backend authentication (JWT)
- [ ] Audit logging
- [ ] CSRF protection
- [ ] XSS protection headers

## Testing Strategy

### Recommended Tests

**Unit Tests**:
- Crisis detector with various inputs
- Encryption/decryption roundtrip
- Tool parameter validation
- Mood trend calculation

**Integration Tests**:
- End-to-end conversation flow
- Journal save/load cycle
- Reality check execution
- Multi-tab sync

**E2E Tests**:
- Complete user journeys
- Crisis detection flow
- Mobile responsiveness

**Example Test**:
```javascript
describe('CrisisDetector', () => {
  test('detects explicit crisis', () => {
    const detector = new CrisisDetector();
    const result = detector.detect('I want to hurt myself');
    expect(result.isCrisis).toBe(true);
    expect(result.severity).toBe('high');
  });

  test('handles negation correctly', () => {
    const detector = new CrisisDetector();
    const result = detector.detect("I don't want to hurt myself");
    expect(result.isCrisis).toBe(false);
  });
});
```

## Deployment

### Production Checklist

- [ ] Environment variables configured
- [ ] API keys secured
- [ ] Error tracking (Sentry, etc.)
- [ ] Analytics (privacy-respecting)
- [ ] CDN for assets
- [ ] HTTPS enforced
- [ ] Backup strategy
- [ ] Monitoring and alerts

### Build Command

```bash
pnpm build
```

Output: `dist/` directory with optimized static files

### Environment Variables

```bash
# .env.production
VITE_API_URL=https://api.psycoach.example.com
VITE_OPENAI_API_KEY=your_key_here
```

## Troubleshooting

### Common Issues

**Issue**: Encryption fails
**Solution**: Check browser support for Web Crypto API (HTTPS required)

**Issue**: Crisis detection too sensitive
**Solution**: Adjust severity thresholds in `crisisDetector.js`

**Issue**: UI feels slow
**Solution**: Check console for errors, reduce animation duration

**Issue**: Journal won't save
**Solution**: Check localStorage quota, clear old data

## Future Architecture

### Microservices Approach

```
┌─────────────────┐
│   Web Client    │
└────────┬────────┘
         │
    ┌────▼────┐
    │  Gateway │
    └────┬────┘
         │
    ┌────┴────────────────┐
    │                     │
┌───▼───┐           ┌────▼─────┐
│  Auth │           │   Chat   │
└───────┘           └────┬─────┘
                         │
              ┌──────────┼──────────┐
              │          │          │
         ┌────▼───┐ ┌───▼────┐ ┌──▼──────┐
         │ Crisis │ │  Mood  │ │ Journal │
         └────────┘ └────────┘ └─────────┘
```

### Event-Driven Architecture

```
User Action → Event Bus
    ↓
Listeners:
  - Crisis Monitor
  - Mood Tracker
  - Analytics
  - Backup
```

---

**This architecture enables**:
- Easy AI integration
- Tool extensibility
- Security by design
- Performance optimization
- Future scalability

