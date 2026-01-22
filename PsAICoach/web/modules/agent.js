// PsyCoach Agent - Orchestrates AI interactions with tools
import { MockAIProvider } from './aiProvider.js';
import { 
  CrisisDetectionTool, 
  MoodTrackingTool, 
  GroundingExerciseTool,
  CBTReframingTool,
  RealityCheckTool 
} from './tools.js';

export class PsyCoachAgent {
  constructor(config = {}) {
    // Initialize AI provider (Mock for now, can be swapped with Vercel AI SDK later)
    this.provider = config.provider || new MockAIProvider(config);
    
    // Register tools
    this.registerTools();
    
    // Conversation state
    this.messages = [];
    this.context = {
      userName: config.userName || 'User',
      sessionStart: Date.now(),
      conversationCount: 0
    };

    // Response templates for different scenarios
    this.responseTemplates = this.initializeTemplates();
  }

  registerTools() {
    // Register all available tools with the AI provider
    this.provider.registerTool('crisis_detection', new CrisisDetectionTool());
    this.provider.registerTool('track_mood', new MoodTrackingTool());
    this.provider.registerTool('grounding_exercise', new GroundingExerciseTool());
    this.provider.registerTool('cbt_reframing', new CBTReframingTool());
    this.provider.registerTool('reality_check', new RealityCheckTool());
  }

  initializeTemplates() {
    return {
      supportive: [
        {
          matcher: /\b(anxious|anxiety|worried|nervous|panic)\b/i,
          responses: [
            "Ich höre, wie stark die Angst gerade ist. Lass uns gemeinsam atmen. Was könnte dir helfen, dich auch nur 5% geerdeter zu fühlen?",
            "Angst kann überwältigend sein. Welche Empfindungen nimmst du in deinem Körper wahr?",
            "Danke, dass du die Angst benennst. Wie würde sich Sicherheit für dich in diesem Moment anfühlen?"
          ]
        },
        {
          matcher: /\b(sad|down|depressed|low|empty|traurig|niedergeschlagen)\b/i,
          responses: [
            "Ich bin hier bei dir in dieser Traurigkeit. Würde es helfen, zu erkunden, welche Emotion darunter liegt oder welcher Trost dir guttun würde?",
            "Depression kann alles so schwer machen. Was könnte dir einen Moment der Leichtigkeit bringen?",
            "Ich höre die Last, die du trägst. Welche Unterstützung würde sich gerade bedeutsam anfühlen?"
          ]
        },
        {
          matcher: /\b(angry|frustrated|mad|furious|rage|wütend|sauer)\b/i,
          responses: [
            "Wut ist ein kraftvolles Signal. Welche Grenze wurde überschritten, und welche Unterstützung könntest du einfordern?",
            "Diese Frustration klingt intensiv. Was möchte dir die Wut sagen?",
            "Ich sehe, wie stark dieses Gefühl ist. Wie würde es aussehen, dieser Wut Raum zu geben?"
          ]
        },
        {
          matcher: /\b(alone|lonely|isolated|nobody|einsam|allein)\b/i,
          responses: [
            "Einsamkeit kann so schwer wiegen. Ich bin jetzt hier bei dir. Welche Art von Verbindung würde sich unterstützend anfühlen?",
            "Sich allein zu fühlen tut weh. Was hat dir in der Vergangenheit geholfen, dich weniger isoliert zu fühlen?",
            "Ich höre diese Einsamkeit. Wer in deinem Leben könnte verstehen, was du durchmachst?"
          ]
        },
        {
          matcher: /\b(tired|exhausted|drained|burned out|müde|erschöpft)\b/i,
          responses: [
            "Erschöpfung macht alles schwerer. Welche Art von Ruhe wäre jetzt möglich für dich?",
            "Diese Müdigkeit klingt tief. Was wäre eine kleine Art, heute für dich zu sorgen?",
            "Ich höre, wie erschöpft du bist. Wie würde Erholung für dich aussehen?"
          ]
        }
      ],
      reflective: [
        "Welche Emotionen nimmst du gerade in deinem Körper wahr?",
        "Wenn ein Freund sich so fühlen würde wie du, was würdest du dir für ihn wünschen?",
        "Was wäre eine kleine Handlung, die deine Bedürfnisse in der nächsten Stunde ehren könnte?",
        "Welche Unterstützung würde sich heute bedeutsam anfühlen?",
        "Was hat dir heute auch nur einen Moment des Friedens gebracht?",
        "Wie bist du gerade freundlich zu dir selbst?",
        "Was möchte deine innere Weisheit dir mitteilen?",
        "Wie würde Selbstmitgefühl gerade klingen?"
      ],
      crisis: {
        critical: "Ich bin sehr besorgt um deine Sicherheit. Bitte hole dir sofort Hilfe: Telefonseelsorge 0800 111 0 111 oder 0800 111 0 222 (24/7 kostenlos). Du kannst auch 112 für den Notdienst anrufen. Du bist wichtig, und Hilfe ist verfügbar.",
        high: "Ich bin froh, dass du es mir sagst, und ich mache mir Sorgen um deine Sicherheit. Bitte kontaktiere die Telefonseelsorge (0800 111 0 111) oder eine vertrauenswürdige Person. Du musst das nicht allein durchstehen.",
        elevated: "Ich bemerke viel Schmerz in dem, was du teilst. Dein Wohlbefinden ist wichtig. Würde es helfen, über die dir verfügbare Unterstützung zu sprechen?"
      }
    };
  }

  async processMessage(userMessage) {
    this.context.conversationCount++;

    // Add user message to history
    this.messages.push({
      role: 'user',
      content: userMessage
    });

    try {
      // First, check for crisis using the crisis detection tool
      const crisisTool = this.provider.tools.get('crisis_detection');
      const crisisResult = await crisisTool.execute({ message: userMessage });

      // Handle crisis situations
      if (crisisResult.action === 'activate_crisis_protocol') {
        const response = {
          role: 'assistant',
          content: this.responseTemplates.crisis[crisisResult.severity] || this.responseTemplates.crisis.high,
          isCrisis: true,
          severity: crisisResult.severity,
          resources: crisisResult.resources
        };
        
        this.messages.push(response);
        return response;
      }

      // Handle elevated concern
      if (crisisResult.action === 'elevated_concern') {
        const response = {
          role: 'assistant',
          content: this.responseTemplates.crisis.elevated,
          elevated: true,
          insight: "Wenn du kämpfst, erwäge bitte, die Telefonseelsorge (0800 111 0 111) oder eine vertrauenswürdige Person zu kontaktieren."
        };
        
        this.messages.push(response);
        return response;
      }

      // Track mood in background
      const moodTool = this.provider.tools.get('track_mood');
      moodTool.execute({ message: userMessage }).catch(err => 
        console.warn('Mood tracking failed:', err)
      );

      // Generate conversational response
      const aiResponse = await this.provider.chat(this.messages, {
        temperature: 0.7,
        max_tokens: 300
      });

      // Find matching supportive response
      const matchedTemplate = this.responseTemplates.supportive.find(
        template => template.matcher.test(userMessage)
      );

      let content;
      if (matchedTemplate) {
        const responses = matchedTemplate.responses;
        content = responses[Math.floor(Math.random() * responses.length)];
      } else {
        content = aiResponse.content || "Danke, dass du das teilst. Wie würde sich Unterstützung in diesem Moment für dich anfühlen?";
      }

      // Add reflective insight
      const insight = this.responseTemplates.reflective[
        Math.floor(Math.random() * this.responseTemplates.reflective.length)
      ];

      const response = {
        role: 'assistant',
        content,
        insight,
        isCrisis: false,
        toolCalls: aiResponse.toolCalls
      };

      this.messages.push(response);
      return response;

    } catch (error) {
      console.error('Agent error:', error);
      
      // Fallback response
      const fallbackResponse = {
        role: 'assistant',
        content: "Entschuldigung, ich hatte einen Moment der Verwirrung. Kannst du mir mehr darüber erzählen, wie du dich fühlst?",
        error: true
      };
      
      this.messages.push(fallbackResponse);
      return fallbackResponse;
    }
  }

  async processMessageStream(userMessage, onChunk) {
    // For streaming responses (useful when using real AI later)
    this.messages.push({
      role: 'user',
      content: userMessage
    });

    let fullContent = '';
    
    try {
      for await (const chunk of this.provider.chatStream(this.messages)) {
        if (!chunk.done) {
          fullContent += chunk.content;
          onChunk(chunk.content);
        }
      }

      const response = {
        role: 'assistant',
        content: fullContent
      };

      this.messages.push(response);
      return response;

    } catch (error) {
      console.error('Stream error:', error);
      throw error;
    }
  }

  // Tool execution methods for UI to call directly
  async executeGroundingExercise(intensity = 'medium', preferredType = null) {
    const tool = this.provider.tools.get('grounding_exercise');
    return await tool.execute({ intensity, preferredType });
  }

  async executeCBTReframing(thought) {
    const tool = this.provider.tools.get('cbt_reframing');
    return await tool.execute({ thought });
  }

  async executeRealityCheck(experience, type = null) {
    const tool = this.provider.tools.get('reality_check');
    return await tool.execute({ experience, type });
  }

  // Get conversation history
  getHistory() {
    return this.messages;
  }

  // Clear conversation
  clearHistory() {
    this.messages = [];
    this.context.conversationCount = 0;
  }

  // Export conversation
  exportConversation() {
    return {
      context: this.context,
      messages: this.messages,
      exportedAt: new Date().toISOString()
    };
  }
}
