# 🤖 AI Integration Guide

This guide shows you how to integrate real AI into PsyCoach using various providers.

## Quick Start: Vercel AI SDK

The easiest way to add real AI is using Vercel's AI SDK.

### Step 1: Install Dependencies

```bash
pnpm add ai @ai-sdk/openai @ai-sdk/anthropic
```

### Step 2: Add Environment Variables

Create `.env`:

```bash
VITE_OPENAI_API_KEY=sk-...
# or
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

### Step 3: Uncomment the Provider

In `web/modules/aiProvider.js`, uncomment the `VercelAIProvider` class (lines ~60-120).

### Step 4: Update Agent Initialization

In `web/app.js`, replace the agent initialization:

```javascript
// Old:
const agent = new PsyCoachAgent();

// New:
import { VercelAIProvider } from './modules/aiProvider.js';
import { openai } from '@ai-sdk/openai';

const agent = new PsyCoachAgent({
  provider: new VercelAIProvider({
    model: openai('gpt-4-turbo'),
    apiKey: import.meta.env.VITE_OPENAI_API_KEY
  })
});
```

### Step 5: Test It!

```bash
pnpm dev
```

Open the app and start a conversation. You should now get real AI responses!

## Provider Options

### OpenAI (GPT-4)

```javascript
import { openai } from '@ai-sdk/openai';

const agent = new PsyCoachAgent({
  provider: new VercelAIProvider({
    model: openai('gpt-4-turbo'),
    apiKey: import.meta.env.VITE_OPENAI_API_KEY
  })
});
```

**Pros**: Excellent reasoning, good at following instructions
**Cons**: More expensive, slower than GPT-3.5

### Anthropic (Claude)

```javascript
import { anthropic } from '@ai-sdk/anthropic';

const agent = new PsyCoachAgent({
  provider: new VercelAIProvider({
    model: anthropic('claude-3-5-sonnet-20241022'),
    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY
  })
});
```

**Pros**: Very good at empathy and nuance, longer context
**Cons**: Slightly different behavior than GPT

### Groq (Fast Open Models)

```javascript
import { createGroq } from '@ai-sdk/groq';

const groq = createGroq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY
});

const agent = new PsyCoachAgent({
  provider: new VercelAIProvider({
    model: groq('llama-3.1-70b-versatile')
  })
});
```

**Pros**: Very fast, lower cost
**Cons**: May require more prompt tuning

## Streaming Responses

For real-time streaming (like ChatGPT), update your message handler:

### In `app.js`:

```javascript
// Replace the submit handler
dom.conversationForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const text = dom.conversationInput.value.trim();
  if (!text) return;

  pushMessage(text, 'user');
  dom.conversationInput.value = '';

  // Create placeholder for streaming response
  const botMessageElement = createStreamingMessage();
  let fullResponse = '';

  try {
    // Stream the response
    await agent.processMessageStream(text, (chunk) => {
      fullResponse += chunk;
      updateStreamingMessage(botMessageElement, fullResponse);
    });

    // Update insight after complete
    const insight = agent.getLastInsight();
    if (insight) {
      dom.insightText.textContent = insight;
    }

  } catch (error) {
    console.error('Streaming error:', error);
    updateStreamingMessage(botMessageElement, 'Sorry, I had trouble processing that.');
  }
});

function createStreamingMessage() {
  const li = document.createElement('li');
  li.className = 'message bot';
  li.innerHTML = '<span class="message-content"></span><time></time>';
  dom.conversationLog.appendChild(li);
  return li;
}

function updateStreamingMessage(element, text) {
  const content = element.querySelector('.message-content');
  const time = element.querySelector('time');
  content.textContent = text;
  time.textContent = UIUtils.timestamp();
  dom.conversationLog.scrollTop = dom.conversationLog.scrollHeight;
}
```

## Custom System Prompt

The default system prompt is good, but you can customize it:

### In `aiProvider.js`:

```javascript
export class VercelAIProvider extends AIProvider {
  getDefaultSystemPrompt() {
    return `You are PsyCoach, a compassionate mental health companion trained in CBT and supportive therapy techniques.

Core Principles:
- Always validate emotions before offering solutions
- Use person-first language ("person experiencing depression" not "depressed person")
- Encourage professional help for serious concerns
- Be warm, non-judgmental, and patient
- Ask open-ended questions to encourage reflection
- Notice and gently challenge cognitive distortions

Crisis Protocol:
- If user expresses suicidal ideation, immediately activate crisis resources
- Use the crisis_detection tool for any concerning messages
- Prioritize safety over all other concerns

Available Tools:
${this.getTools().map(t => `- ${t.name}: ${t.description}`).join('\n')}

Communication Style:
- Use "I" statements ("I notice..." not "You are...")
- Validate before exploring ("That sounds really difficult. Tell me more...")
- Summarize and reflect back what you hear
- Offer choices rather than directives

Remember: You're a supportive companion, not a replacement for therapy.`;
  }
}
```

## Tool Configuration

### Adjusting When Tools Are Called

The AI decides when to call tools, but you can influence this in the tool descriptions:

```javascript
export class MoodTrackingTool {
  constructor() {
    // More specific description = more targeted usage
    this.description = `
      Track user's mood when they explicitly mention their emotional state.
      Look for phrases like "I'm feeling...", "My mood is...", "I feel...".
      DO NOT call this for every message, only when mood is clearly stated.
    `;
    // ...
  }
}
```

### Adding Tool Requirements

Make certain tools mandatory for specific situations:

```javascript
// In aiProvider.js
async chat(messages, options = {}) {
  const lastMessage = messages[messages.length - 1].content.toLowerCase();
  
  // Force crisis detection for concerning keywords
  const forcedTools = [];
  if (lastMessage.includes('hurt') || lastMessage.includes('suicide')) {
    forcedTools.push('crisis_detection');
  }

  const result = await generateText({
    model: this.model,
    messages: [
      { role: 'system', content: this.systemPrompt },
      ...messages
    ],
    tools: this.getToolsForAI(),
    toolChoice: forcedTools.length > 0 ? { type: 'tool', tool: forcedTools[0] } : 'auto',
    maxSteps: 5
  });

  return result;
}
```

## Handling Costs

AI API calls cost money. Here's how to manage costs:

### 1. Set Token Limits

```javascript
const result = await generateText({
  model: openai('gpt-4-turbo'),
  messages,
  maxTokens: 300, // Limit response length
  // ...
});
```

### 2. Use Cheaper Models for Simple Tasks

```javascript
class HybridAIProvider extends AIProvider {
  async chat(messages, options) {
    const lastMessage = messages[messages.length - 1].content;
    
    // Use cheaper model for simple queries
    const isSimple = lastMessage.length < 50 && !this.needsTooling(lastMessage);
    
    const model = isSimple 
      ? openai('gpt-3.5-turbo')  // Cheaper
      : openai('gpt-4-turbo');    // Better
    
    return await generateText({ model, messages, ...options });
  }
}
```

### 3. Cache System Prompts

```javascript
// Use caching to reduce costs (for providers that support it)
const result = await generateText({
  model: anthropic('claude-3-5-sonnet-20241022'),
  messages,
  system: [
    {
      type: 'text',
      text: this.systemPrompt,
      cache_control: { type: 'ephemeral' } // Cache this!
    }
  ]
});
```

### 4. Implement Rate Limiting

```javascript
class RateLimitedProvider extends AIProvider {
  constructor(config) {
    super(config);
    this.lastCallTime = 0;
    this.minInterval = 1000; // 1 second between calls
  }

  async chat(messages, options) {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCallTime;
    
    if (timeSinceLastCall < this.minInterval) {
      await new Promise(r => setTimeout(r, this.minInterval - timeSinceLastCall));
    }
    
    this.lastCallTime = Date.now();
    return await super.chat(messages, options);
  }
}
```

## Backend Integration

For production, run AI calls through your backend:

### Frontend (`web/app.js`):

```javascript
class BackendAIProvider extends AIProvider {
  async chat(messages, options) {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        messages,
        options
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    return await response.json();
  }

  async *chatStream(messages, options) {
    const response = await fetch('/api/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ messages, options })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      yield { content: chunk, done: false };
    }
    
    yield { content: '', done: true };
  }
}
```

### Backend (`server/routes/chat.js`):

```javascript
import { openai } from '@ai-sdk/openai';
import { generateText, streamText } from 'ai';

app.post('/api/chat', async (req, res) => {
  const { messages, options } = req.body;
  const userId = req.user.id; // From auth middleware

  // Rate limit check
  if (await isRateLimited(userId)) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  try {
    const result = await generateText({
      model: openai('gpt-4-turbo'),
      messages: [
        { role: 'system', content: getSystemPrompt() },
        ...messages
      ],
      tools: getTools(),
      ...options
    });

    // Log for analytics
    await logConversation(userId, messages, result);

    res.json(result);
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'AI processing failed' });
  }
});

app.post('/api/chat/stream', async (req, res) => {
  const { messages, options } = req.body;
  
  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages: [
      { role: 'system', content: getSystemPrompt() },
      ...messages
    ],
    tools: getTools(),
    ...options
  });

  // Stream to client
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  for await (const chunk of result.textStream) {
    res.write(chunk);
  }

  res.end();
});
```

## Testing with AI

### Mock AI Responses for Tests

```javascript
class TestAIProvider extends AIProvider {
  constructor(responses) {
    super();
    this.responses = responses;
    this.callCount = 0;
  }

  async chat(messages) {
    const response = this.responses[this.callCount % this.responses.length];
    this.callCount++;
    return {
      role: 'assistant',
      content: response
    };
  }
}

// In tests:
const testProvider = new TestAIProvider([
  'I hear you're feeling anxious. Tell me more.',
  'That must be difficult. What helps you feel grounded?'
]);

const agent = new PsyCoachAgent({ provider: testProvider });
```

## Monitoring AI Performance

### Log AI Calls

```javascript
class MonitoredAIProvider extends AIProvider {
  async chat(messages, options) {
    const startTime = Date.now();
    
    try {
      const result = await super.chat(messages, options);
      const duration = Date.now() - startTime;
      
      // Log metrics
      console.log({
        duration,
        inputTokens: result.usage?.promptTokens,
        outputTokens: result.usage?.completionTokens,
        cost: calculateCost(result.usage),
        toolsUsed: result.toolCalls?.length || 0
      });
      
      return result;
    } catch (error) {
      console.error('AI Error:', {
        error: error.message,
        duration: Date.now() - startTime
      });
      throw error;
    }
  }
}
```

## Troubleshooting

### Issue: AI calls are slow

**Solutions**:
- Use faster models (gpt-3.5-turbo, groq)
- Reduce max_tokens
- Implement streaming
- Cache system prompts

### Issue: Too expensive

**Solutions**:
- Use cheaper models for simple queries
- Implement aggressive rate limiting
- Reduce tool usage
- Use shorter system prompts

### Issue: AI not calling tools

**Solutions**:
- Make tool descriptions more specific
- Add examples in tool descriptions
- Reduce number of available tools
- Use forced tool calling for critical tools

### Issue: Responses not empathetic enough

**Solutions**:
- Improve system prompt with examples
- Use Claude (generally more empathetic)
- Add examples of good responses in system prompt
- Fine-tune model (advanced)

## Next Steps

1. Start with MockAIProvider (current)
2. Add VercelAIProvider with gpt-3.5-turbo for testing
3. Test all tools work correctly
4. Upgrade to gpt-4-turbo for production
5. Add backend API for security
6. Implement monitoring and analytics
7. Fine-tune based on real usage

---

**Happy AI integrating!** 🚀

For questions or issues, refer to:
- [Vercel AI SDK Docs](https://sdk.vercel.ai/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Anthropic API Docs](https://docs.anthropic.com)

