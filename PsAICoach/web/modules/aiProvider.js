// AI Provider Abstraction Layer
// This allows easy switching between mock responses and real AI providers (Vercel AI SDK, OpenAI, etc.)

export class AIProvider {
  constructor(config = {}) {
    this.config = config;
    this.tools = new Map();
  }

  // Register a tool that the AI can use
  registerTool(name, tool) {
    this.tools.set(name, tool);
  }

  // Abstract method - to be implemented by specific providers
  async chat(messages, options = {}) {
    throw new Error('chat() must be implemented by provider');
  }

  // Abstract method for streaming responses
  async *chatStream(messages, options = {}) {
    throw new Error('chatStream() must be implemented by provider');
  }

  // Get available tools
  getTools() {
    return Array.from(this.tools.entries()).map(([name, tool]) => ({
      name,
      description: tool.description,
      parameters: tool.parameters
    }));
  }

  // Execute a tool
  async executeTool(name, args) {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Tool ${name} not found`);
    }
    return await tool.execute(args);
  }
}

// Mock Provider for development (current state)
export class MockAIProvider extends AIProvider {
  constructor(config = {}) {
    super(config);
    this.conversationHistory = [];
  }

  async chat(messages, options = {}) {
    // Store in history
    this.conversationHistory.push(...messages);

    const lastMessage = messages[messages.length - 1];
    const userMessage = lastMessage.content;

    // Check if tools should be called
    const toolCalls = this.shouldUseTool(userMessage);
    
    if (toolCalls.length > 0) {
      const toolResults = await Promise.all(
        toolCalls.map(call => this.executeTool(call.name, call.args))
      );
      
      return {
        role: 'assistant',
        content: this.generateResponseWithTools(userMessage, toolResults),
        toolCalls: toolCalls.map((call, i) => ({
          ...call,
          result: toolResults[i]
        }))
      };
    }

    // Regular response without tools
    return {
      role: 'assistant',
      content: this.generateResponse(userMessage)
    };
  }

  async *chatStream(messages, options = {}) {
    const response = await this.chat(messages, options);
    
    // Simulate streaming by yielding chunks
    const words = response.content.split(' ');
    for (const word of words) {
      yield { content: word + ' ', done: false };
      await new Promise(resolve => setTimeout(resolve, 30));
    }
    yield { content: '', done: true };
  }

  shouldUseTool(message) {
    const toolCalls = [];
    const lowerMessage = message.toLowerCase();

    // Crisis detection tool
    if (this.tools.has('crisis_detection')) {
      if (lowerMessage.includes('hurt') || lowerMessage.includes('suicide') || 
          lowerMessage.includes('kill')) {
        toolCalls.push({
          name: 'crisis_detection',
          args: { message }
        });
      }
    }

    // Mood tracking tool
    if (this.tools.has('track_mood')) {
      if (lowerMessage.includes('feeling') || lowerMessage.includes('mood')) {
        toolCalls.push({
          name: 'track_mood',
          args: { message }
        });
      }
    }

    // Grounding exercise tool
    if (this.tools.has('grounding_exercise')) {
      if (lowerMessage.includes('anxious') || lowerMessage.includes('panic') ||
          lowerMessage.includes('overwhelmed')) {
        toolCalls.push({
          name: 'grounding_exercise',
          args: { intensity: 'medium' }
        });
      }
    }

    return toolCalls;
  }

  generateResponse(message) {
    // Fallback to pattern matching (existing logic)
    return "Thank you for sharing. What would feeling supported in this moment look like for you?";
  }

  generateResponseWithTools(message, toolResults) {
    // Generate response based on tool results
    return toolResults.map(result => result.response || result).join('\n\n');
  }
}

// Vercel AI SDK Provider (prepared for future use)
// Uncomment and configure when ready to use Vercel AI SDK
/*
import { openai } from '@ai-sdk/openai';
import { generateText, streamText } from 'ai';

export class VercelAIProvider extends AIProvider {
  constructor(config = {}) {
    super(config);
    this.model = config.model || openai('gpt-4-turbo');
    this.systemPrompt = config.systemPrompt || this.getDefaultSystemPrompt();
  }

  getDefaultSystemPrompt() {
    return `You are PsyCoach, a compassionate mental health companion. 

Your role:
- Provide empathetic, supportive responses
- Use CBT principles and validate emotions
- Detect crisis situations and activate safety protocols
- Encourage self-reflection and healthy coping strategies
- Never provide medical diagnoses or replace professional therapy

Available tools:
${this.getTools().map(t => `- ${t.name}: ${t.description}`).join('\n')}

Always prioritize user safety and wellbeing.`;
  }

  async chat(messages, options = {}) {
    const tools = {};
    for (const [name, tool] of this.tools.entries()) {
      tools[name] = {
        description: tool.description,
        parameters: tool.parameters,
        execute: tool.execute.bind(tool)
      };
    }

    const result = await generateText({
      model: this.model,
      messages: [
        { role: 'system', content: this.systemPrompt },
        ...messages
      ],
      tools,
      maxSteps: 5,
      ...options
    });

    return {
      role: 'assistant',
      content: result.text,
      toolCalls: result.toolCalls,
      usage: result.usage
    };
  }

  async *chatStream(messages, options = {}) {
    const tools = {};
    for (const [name, tool] of this.tools.entries()) {
      tools[name] = {
        description: tool.description,
        parameters: tool.parameters,
        execute: tool.execute.bind(tool)
      };
    }

    const result = await streamText({
      model: this.model,
      messages: [
        { role: 'system', content: this.systemPrompt },
        ...messages
      ],
      tools,
      maxSteps: 5,
      ...options
    });

    for await (const chunk of result.textStream) {
      yield { content: chunk, done: false };
    }
    yield { content: '', done: true };
  }
}
*/
