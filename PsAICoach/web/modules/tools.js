// AI Tools - Functions that the AI agent can call
// These tools follow the Vercel AI SDK tool pattern

import { CrisisDetector } from './crisisDetector.js';

// Crisis Detection Tool
export class CrisisDetectionTool {
  constructor() {
    this.detector = new CrisisDetector();
    this.description = 'Detects crisis keywords and escalating distress patterns in user messages to activate safety protocols';
    this.parameters = {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'The user message to analyze for crisis indicators'
        }
      },
      required: ['message']
    };
  }

  async execute({ message }) {
    const result = this.detector.detect(message);
    
    if (result.isCrisis) {
      return {
        action: 'activate_crisis_protocol',
        severity: result.severity,
        response: this.getCrisisResponse(result),
        resources: this.getCrisisResources()
      };
    }

    if (result.elevated) {
      return {
        action: 'elevated_concern',
        severity: result.severity,
        response: "I'm noticing significant distress in your message. Would you like to talk about support options available to you?",
        suggestion: 'gentle_check_in'
      };
    }

    return {
      action: 'continue_conversation',
      response: null
    };
  }

  getCrisisResponse(result) {
    if (result.severity === 'critical') {
      return "I'm deeply concerned about your safety right now. Please reach out for immediate help: Telefonseelsorge 0800 111 0 111 or 0800 111 0 222 (24/7 kostenlos). You can also call 112 for emergency services. You matter, and help is available.";
    }
    return "Your safety is important. Please consider reaching out to Telefonseelsorge (0800 111 0 111) or a trusted support person. You don't have to face this alone.";
  }

  getCrisisResources() {
    return [
      { name: 'Telefonseelsorge', phone: '0800 111 0 111', available: '24/7' },
      { name: 'Telefonseelsorge Alternative', phone: '0800 111 0 222', available: '24/7' },
      { name: 'SMS Seelsorge', contact: 'Text "Start" an 0151 14 26 07 72', available: '24/7' },
      { name: 'Notdienst', phone: '112', available: 'Notfälle' }
    ];
  }
}

// Mood Tracking Tool
export class MoodTrackingTool {
  constructor() {
    this.description = 'Tracks and analyzes mood patterns from user messages';
    this.parameters = {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'The message to extract mood indicators from'
        },
        explicitMood: {
          type: 'number',
          description: 'Explicit mood rating if provided (0-10)',
          optional: true
        }
      },
      required: ['message']
    };
  }

  async execute({ message, explicitMood }) {
    const moodIndicators = this.extractMoodIndicators(message);
    const inferredMood = explicitMood || this.inferMood(moodIndicators);
    
    // Store mood data
    const moodEntry = {
      timestamp: Date.now(),
      mood: inferredMood,
      indicators: moodIndicators,
      context: message
    };

    this.saveMoodEntry(moodEntry);

    return {
      action: 'mood_tracked',
      mood: inferredMood,
      trend: this.analyzeTrend(),
      response: `I notice you're feeling ${this.getMoodLabel(inferredMood)}. `
    };
  }

  extractMoodIndicators(message) {
    const positive = ['happy', 'good', 'great', 'better', 'hopeful', 'calm', 'peaceful'];
    const negative = ['sad', 'down', 'depressed', 'anxious', 'worried', 'terrible', 'awful', 'hopeless'];
    
    const lowerMessage = message.toLowerCase();
    return {
      positive: positive.filter(word => lowerMessage.includes(word)),
      negative: negative.filter(word => lowerMessage.includes(word))
    };
  }

  inferMood(indicators) {
    const baselineMood = 5;
    let adjustment = 0;
    
    adjustment += indicators.positive.length * 1.5;
    adjustment -= indicators.negative.length * 1.5;
    
    return Math.max(0, Math.min(10, baselineMood + adjustment));
  }

  getMoodLabel(mood) {
    if (mood >= 8) return 'sehr gut';
    if (mood >= 6) return 'gut';
    if (mood >= 4) return 'okay';
    if (mood >= 2) return 'nicht so gut';
    return 'sehr schwierig';
  }

  saveMoodEntry(entry) {
    const entries = JSON.parse(localStorage.getItem('psycoach-mood-log') || '[]');
    entries.push(entry);
    
    // Keep last 100 entries
    if (entries.length > 100) {
      entries.shift();
    }
    
    localStorage.setItem('psycoach-mood-log', JSON.stringify(entries));
  }

  analyzeTrend() {
    const entries = JSON.parse(localStorage.getItem('psycoach-mood-log') || '[]');
    if (entries.length < 2) return 'insufficient_data';
    
    const recent = entries.slice(-7);
    const avgRecent = recent.reduce((sum, e) => sum + e.mood, 0) / recent.length;
    
    const older = entries.slice(-14, -7);
    if (older.length === 0) return 'stable';
    
    const avgOlder = older.reduce((sum, e) => sum + e.mood, 0) / older.length;
    
    if (avgRecent > avgOlder + 1) return 'improving';
    if (avgRecent < avgOlder - 1) return 'declining';
    return 'stable';
  }
}

// Grounding Exercise Tool
export class GroundingExerciseTool {
  constructor() {
    this.description = 'Provides grounding exercises to help users manage anxiety, panic, or overwhelming emotions';
    this.parameters = {
      type: 'object',
      properties: {
        intensity: {
          type: 'string',
          enum: ['low', 'medium', 'high'],
          description: 'The intensity level of distress'
        },
        preferredType: {
          type: 'string',
          enum: ['sensory', 'breathing', 'physical', 'cognitive'],
          description: 'Type of grounding exercise preferred',
          optional: true
        }
      },
      required: ['intensity']
    };
  }

  async execute({ intensity, preferredType }) {
    const exercise = this.selectExercise(intensity, preferredType);
    
    return {
      action: 'provide_grounding',
      exercise: exercise.name,
      instructions: exercise.instructions,
      duration: exercise.duration,
      response: `Let's try a grounding exercise together. I'll guide you through "${exercise.name}".`
    };
  }

  selectExercise(intensity, preferredType) {
    const exercises = {
      sensory: {
        name: '5-4-3-2-1 Sinne',
        instructions: [
          'Nenne 5 Dinge, die du sehen kannst',
          'Nenne 4 Dinge, die du berühren kannst',
          'Nenne 3 Dinge, die du hören kannst',
          'Nenne 2 Dinge, die du riechen kannst',
          'Nenne 1 Ding, das du schmecken kannst'
        ],
        duration: '3-5 Minuten'
      },
      breathing: {
        name: 'Box Breathing',
        instructions: [
          'Atme ein für 4 Sekunden',
          'Halte den Atem für 4 Sekunden',
          'Atme aus für 4 Sekunden',
          'Halte den Atem für 4 Sekunden',
          'Wiederhole 4 Zyklen'
        ],
        duration: '2-3 Minuten'
      },
      physical: {
        name: 'Progressive Muskelentspannung',
        instructions: [
          'Spanne deine Fußmuskeln an für 5 Sekunden, dann entspanne',
          'Bewege dich langsam durch den Körper nach oben',
          'Beine, Bauch, Arme, Schultern, Gesicht',
          'Bei jeder Muskelgruppe: 5 Sekunden anspannen, 10 Sekunden entspannen'
        ],
        duration: '5-7 Minuten'
      },
      cognitive: {
        name: 'Kategorien benennen',
        instructions: [
          'Wähle eine Kategorie (z.B. Länder, Tiere, Farben)',
          'Nenne so viele wie möglich im Alphabet',
          'Bei Schwierigkeiten: Wechsle die Kategorie',
          'Fokussiere dich auf den Prozess, nicht auf Perfektion'
        ],
        duration: '3-5 Minuten'
      }
    };

    const type = preferredType || (intensity === 'high' ? 'breathing' : 'sensory');
    return exercises[type] || exercises.sensory;
  }
}

// CBT Reframing Tool
export class CBTReframingTool {
  constructor() {
    this.description = 'Helps identify cognitive distortions and provides reframing suggestions using CBT principles';
    this.parameters = {
      type: 'object',
      properties: {
        thought: {
          type: 'string',
          description: 'The thought or belief to analyze and reframe'
        }
      },
      required: ['thought']
    };
  }

  async execute({ thought }) {
    const distortions = this.identifyDistortions(thought);
    const reframe = this.generateReframe(thought, distortions);
    
    return {
      action: 'provide_reframe',
      distortions: distortions,
      reframe: reframe,
      response: `I notice some thought patterns here. ${reframe.explanation}`
    };
  }

  identifyDistortions(thought) {
    const distortionPatterns = [
      {
        name: 'Alles-oder-Nichts-Denken',
        patterns: ['always', 'never', 'immer', 'nie', 'everyone', 'nobody', 'jeder', 'niemand'],
        test: (t) => distortionPatterns[0].patterns.some(p => t.toLowerCase().includes(p))
      },
      {
        name: 'Katastrophisieren',
        patterns: ['worst', 'terrible', 'catastrophe', 'disaster', 'schrecklich', 'katastrophe'],
        test: (t) => distortionPatterns[1].patterns.some(p => t.toLowerCase().includes(p))
      },
      {
        name: 'Gedankenlesen',
        patterns: ['they think', 'sie denken', 'must think', 'probably thinks'],
        test: (t) => distortionPatterns[2].patterns.some(p => t.toLowerCase().includes(p))
      }
    ];

    return distortionPatterns.filter(d => d.test(thought)).map(d => d.name);
  }

  generateReframe(thought, distortions) {
    if (distortions.includes('Alles-oder-Nichts-Denken')) {
      return {
        type: 'all-or-nothing',
        explanation: 'This seems like all-or-nothing thinking. What would a middle ground look like?',
        questions: [
          'Are there shades of gray here?',
          'What exceptions exist?',
          'How would a friend see this?'
        ]
      };
    }

    return {
      type: 'general',
      explanation: 'Let\'s explore this thought together.',
      questions: [
        'What evidence supports this thought?',
        'What evidence contradicts it?',
        'What would you tell a friend thinking this?'
      ]
    };
  }
}

// Reality Check Tool
export class RealityCheckTool {
  constructor() {
    this.description = 'Guides users through reality testing when experiencing potentially distorted perceptions';
    this.parameters = {
      type: 'object',
      properties: {
        experience: {
          type: 'string',
          description: 'The experience or perception to reality test'
        },
        type: {
          type: 'string',
          enum: ['auditory', 'visual', 'paranoid', 'other'],
          description: 'Type of experience'
        }
      },
      required: ['experience']
    };
  }

  async execute({ experience, type }) {
    const inferredType = type || this.inferType(experience);
    const checklist = this.getChecklist(inferredType);
    
    return {
      action: 'reality_check',
      type: inferredType,
      checklist: checklist,
      response: `Let's work through this experience together. ${checklist.intro}`
    };
  }

  inferType(experience) {
    const lower = experience.toLowerCase();
    if (lower.includes('hear') || lower.includes('voice') || lower.includes('sound')) return 'auditory';
    if (lower.includes('see') || lower.includes('vision') || lower.includes('shadow')) return 'visual';
    if (lower.includes('follow') || lower.includes('watch') || lower.includes('paranoid')) return 'paranoid';
    return 'other';
  }

  getChecklist(type) {
    const checklists = {
      auditory: {
        intro: 'Hearing things that others don\'t can be confusing. Let\'s check in.',
        steps: [
          'Beschreibe, was du gehört hast so detailliert wie möglich',
          'Frage eine vertrauenswürdige Person, ob sie es auch gehört hat',
          'Prüfe Umgebungsgeräusche - könnte es eine andere Quelle geben?',
          'Notiere Tageszeit, Schlafqualität und Stresslevel',
          'Praktiziere 5 Minuten Erdung und bewerte die Intensität erneut'
        ]
      },
      visual: {
        intro: 'Visual experiences can be unsettling. Let\'s ground and assess.',
        steps: [
          'Beschreibe genau, was du gesehen hast',
          'Prüfe die Beleuchtung und mögliche Schatten',
          'Frage andere, ob sie etwas Ähnliches sehen',
          'Bewerte deine Müdigkeit und Stresslevel',
          'Nutze eine Erdungstechnik und schaue erneut'
        ]
      },
      paranoid: {
        intro: 'Feeling watched or followed is stressful. Let\'s reality test.',
        steps: [
          'Beschreibe die Situation und deine Beobachtungen',
          'Liste Fakten vs. Interpretationen auf',
          'Gibt es alternative Erklärungen?',
          'Sprich mit jemandem, dem du vertraust',
          'Bewerte die Intensität vor und nach dem Erden'
        ]
      },
      other: {
        intro: 'Let\'s work through this experience with curiosity.',
        steps: [
          'Beschreibe die Erfahrung detailliert',
          'Was sagen deine Sinne dir?',
          'Gibt es alternative Erklärungen?',
          'Sprich mit einer vertrauenswürdigen Person',
          'Nutze Erdungstechniken und bewerte erneut'
        ]
      }
    };

    return checklists[type] || checklists.other;
  }
}

