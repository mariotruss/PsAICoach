// Agent Tools System - Ready for function calling with AI SDK
// Tools that the AI agent can use to perform actions

export class AgentTool {
  constructor(name, description, parameters, handler) {
    this.name = name;
    this.description = description;
    this.parameters = parameters;
    this.handler = handler;
  }

  async execute(args) {
    return await this.handler(args);
  }

  // Format for OpenAI function calling
  toOpenAIFormat() {
    return {
      name: this.name,
      description: this.description,
      parameters: this.parameters
    };
  }

  // Format for Vercel AI SDK tools
  toVercelAIFormat() {
    return {
      description: this.description,
      parameters: this.parameters,
      execute: this.handler
    };
  }
}

// Pre-built tools for mental health companion
export class MentalHealthTools {
  constructor(context) {
    this.context = context;
    this.tools = this.initializeTools();
  }

  initializeTools() {
    return {
      assessMood: new AgentTool(
        'assess_mood',
        'Assess the user\'s current mood based on their messages and provide insights',
        {
          type: 'object',
          properties: {
            messages: {
              type: 'array',
              description: 'Recent conversation messages',
              items: { type: 'string' }
            }
          },
          required: ['messages']
        },
        async ({ messages }) => {
          const sentiment = this.analyzeSentiment(messages.join(' '));
          return {
            mood: sentiment > 2 ? 'negative' : sentiment > 0 ? 'neutral' : 'positive',
            score: sentiment,
            recommendation: this.getMoodRecommendation(sentiment)
          };
        }
      ),

      getCBTTechnique: new AgentTool(
        'get_cbt_technique',
        'Get a relevant CBT technique based on the user\'s concern',
        {
          type: 'object',
          properties: {
            concern: {
              type: 'string',
              description: 'The type of cognitive distortion or concern (e.g., anxiety, catastrophizing, all-or-nothing)'
            }
          },
          required: ['concern']
        },
        async ({ concern }) => {
          return this.findCBTTechnique(concern);
        }
      ),

      checkCrisisLevel: new AgentTool(
        'check_crisis_level',
        'Check if the user is in crisis and needs immediate support',
        {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'The user message to analyze for crisis indicators'
            }
          },
          required: ['message']
        },
        async ({ message }) => {
          if (this.context.crisisDetector) {
            const result = this.context.crisisDetector.detect(message);
            return {
              isCrisis: result.isCrisis,
              severity: result.severity || 'none',
              action: result.isCrisis ? 'immediate_intervention' : 'continue_support'
            };
          }
          return { isCrisis: false, severity: 'none', action: 'continue_support' };
        }
      ),

      suggestGroundingExercise: new AgentTool(
        'suggest_grounding_exercise',
        'Suggest a grounding exercise appropriate for the user\'s current state',
        {
          type: 'object',
          properties: {
            intensity: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              description: 'The intensity level of distress'
            }
          },
          required: ['intensity']
        },
        async ({ intensity }) => {
          return this.getGroundingExercise(intensity);
        }
      ),

      saveJournalInsight: new AgentTool(
        'save_journal_insight',
        'Save an important insight or breakthrough to the user\'s journal',
        {
          type: 'object',
          properties: {
            insight: {
              type: 'string',
              description: 'The insight or realization to save'
            },
            category: {
              type: 'string',
              enum: ['breakthrough', 'pattern', 'coping_strategy', 'trigger'],
              description: 'Category of the insight'
            }
          },
          required: ['insight', 'category']
        },
        async ({ insight, category }) => {
          if (this.context.journalManager) {
            await this.context.journalManager.saveEntry(
              `[${category.toUpperCase()}] ${insight}`
            );
            return { success: true, message: 'Insight saved to journal' };
          }
          return { success: false, message: 'Journal not available' };
        }
      ),

      getTherapyResource: new AgentTool(
        'get_therapy_resource',
        'Get relevant therapy resources or crisis hotlines',
        {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['crisis', 'therapy', 'support_group', 'self_help'],
              description: 'Type of resource needed'
            }
          },
          required: ['type']
        },
        async ({ type }) => {
          return this.getResource(type);
        }
      )
    };
  }

  // Helper methods
  analyzeSentiment(text) {
    const negativeWords = ['hopeless', 'worthless', 'desperate', 'alone', 'helpless', 
                          'pointless', 'terrible', 'awful', 'hate', 'failed'];
    const lowerText = text.toLowerCase();
    return negativeWords.filter(word => lowerText.includes(word)).length;
  }

  getMoodRecommendation(sentiment) {
    if (sentiment > 3) {
      return 'Consider grounding exercises and reaching out to support';
    } else if (sentiment > 1) {
      return 'Practice self-compassion and gentle activities';
    }
    return 'Continue with current coping strategies';
  }

  findCBTTechnique(concern) {
    const techniques = {
      anxiety: {
        name: 'Thought Record',
        description: 'Write down anxious thoughts and examine evidence for/against',
        steps: ['Identify the thought', 'Rate belief 0-100', 'List evidence', 'Generate balanced thought']
      },
      catastrophizing: {
        name: 'Decatastrophizing',
        description: 'Rate actual probability and impact of feared outcome',
        steps: ['What\'s the worst case?', 'What\'s realistic?', 'How would you cope?']
      },
      'all-or-nothing': {
        name: 'Shades of Gray',
        description: 'Find the spectrum between black and white thinking',
        steps: ['Notice the extreme', 'List 3 in-between options', 'Choose a balanced view']
      }
    };

    return techniques[concern.toLowerCase()] || techniques.anxiety;
  }

  getGroundingExercise(intensity) {
    const exercises = {
      low: {
        name: '5-4-3-2-1 Senses',
        description: 'Name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste',
        duration: '3-5 minutes'
      },
      medium: {
        name: 'Box Breathing',
        description: 'Breathe in for 4, hold 4, out for 4, hold 4',
        duration: '2-3 minutes'
      },
      high: {
        name: 'Temperature Reset',
        description: 'Hold ice or splash cold water on face to regulate nervous system',
        duration: '1-2 minutes'
      }
    };

    return exercises[intensity] || exercises.medium;
  }

  getResource(type) {
    const resources = {
      crisis: {
        name: 'Telefonseelsorge (Germany)',
        phone: '0800 111 0 111 or 0800 111 0 222',
        available: '24/7 kostenlos',
        sms: 'Text "Start" an 0151 14 26 07 72'
      },
      therapy: {
        name: 'Psychotherapie-Suche',
        url: 'https://www.therapie.de/psychotherapie/',
        description: 'Finde Therapeuten in deiner Nähe'
      },
      support_group: {
        name: 'Selbsthilfegruppen',
        url: 'https://www.nakos.de',
        description: 'Nationale Kontakt- und Informationsstelle'
      },
      self_help: {
        name: 'Deutsche Depressionshilfe',
        url: 'https://www.deutsche-depressionshilfe.de',
        description: 'Informationen und Selbsthilfe-Tools'
      }
    };

    return resources[type] || resources.crisis;
  }

  // Get all tools in format ready for AI SDK
  getAllTools() {
    return this.tools;
  }

  // Get tool by name
  getTool(name) {
    return this.tools[name];
  }

  // Execute tool
  async executeTool(name, args) {
    const tool = this.getTool(name);
    if (!tool) {
      throw new Error(`Tool ${name} not found`);
    }
    return await tool.execute(args);
  }
}

