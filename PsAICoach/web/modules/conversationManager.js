// Conversation Manager Module
import { CrisisDetector } from './crisisDetector.js';

export class ConversationManager {
  constructor(options = {}) {
    this.crisisDetector = new CrisisDetector();
    this.onMessage = options.onMessage || (() => {});
    this.onInsight = options.onInsight || (() => {});
    
    this.supportiveResponses = [
      {
        matcher: /\b(anxious|anxiety|worried|nervous|panic)\b/i,
        replies: [
          "I hear how much anxiety is showing up. Let's take a breath together. What might help you feel 5% more grounded right now?",
          "Anxiety can feel overwhelming. What sensations are you noticing in your body?",
          "Thank you for naming the anxiety. What would feeling safe look like for you in this moment?"
        ]
      },
      {
        matcher: /\b(sad|down|depressed|low|empty)\b/i,
        replies: [
          "I'm sitting with you in this sadness. Would it help to explore what emotion is underneath or what comfort you need?",
          "Depression can make everything feel heavy. What small thing might bring you a moment of ease?",
          "I hear the weight you're carrying. What support would feel meaningful right now?"
        ]
      },
      {
        matcher: /\b(angry|frustrated|mad|furious|rage)\b/i,
        replies: [
          "Anger is a powerful signal. What boundary was crossed, and what support could you ask for?",
          "That frustration sounds intense. What does the anger want you to know?",
          "I see how strong this feeling is. What would honoring this anger look like?"
        ]
      },
      {
        matcher: /\b(paranoid|hallucination|hearing|seeing|voices)\b/i,
        replies: [
          "Thank you for sharing something so intense. Would you like to try a reality-check exercise together?",
          "What you're experiencing sounds distressing. Let's ground together and explore what you're noticing.",
          "I appreciate your trust in sharing this. Would it help to work through a grounding technique?"
        ]
      },
      {
        matcher: /\b(alone|lonely|isolated|nobody)\b/i,
        replies: [
          "Loneliness can feel so heavy. I'm here with you now. What connection would feel supportive?",
          "Feeling alone is painful. What has helped you feel less isolated in the past?",
          "I hear that loneliness. Who in your life might understand what you're going through?"
        ]
      },
      {
        matcher: /\b(tired|exhausted|drained|burned out)\b/i,
        replies: [
          "Exhaustion makes everything harder. What rest looks possible for you right now?",
          "That fatigue sounds deep. What's one small way you could care for yourself today?",
          "I hear how tired you are. What would replenishment look like?"
        ]
      }
    ];

    this.reflectivePrompts = [
      "What emotions are you noticing in your body right now?",
      "If a friend felt the way you do, what would you want for them?",
      "What small action could honor your needs in the next hour?",
      "What support would feel meaningful to ask for today?",
      "What's one thing that brought you even a moment of peace today?",
      "How are you being kind to yourself in this moment?",
      "What does your inner wisdom want you to know?",
      "What would self-compassion sound like right now?"
    ];
  }

  generateResponse(text) {
    // Check for crisis
    const crisisResult = this.crisisDetector.detect(text);
    
    if (crisisResult.isCrisis) {
      return {
        reply: this.getCrisisResponse(crisisResult),
        insight: "Your safety is the top priority. Crisis resources are available 24/7: Call 988 (Suicide & Crisis Lifeline) or text HOME to 741741 (Crisis Text Line).",
        isCrisis: true,
        severity: crisisResult.severity
      };
    }

    if (crisisResult.elevated) {
      return {
        reply: "I'm noticing a lot of pain in what you're sharing. Your wellbeing matters. Would it help to talk about what support you have available?",
        insight: "If you're struggling, please consider reaching out to a crisis line (988) or trusted support person. You don't have to face this alone.",
        elevated: true
      };
    }

    // Find matching response pattern
    const matchedPattern = this.supportiveResponses.find(
      pattern => pattern.matcher.test(text)
    );

    let reply;
    if (matchedPattern) {
      const replies = matchedPattern.replies;
      reply = replies[Math.floor(Math.random() * replies.length)];
    } else {
      reply = "Thank you for sharing. What would feeling supported in this moment look like for you?";
    }

    const insight = this.reflectivePrompts[
      Math.floor(Math.random() * this.reflectivePrompts.length)
    ];

    return { reply, insight, isCrisis: false };
  }

  getCrisisResponse(crisisResult) {
    if (crisisResult.severity === 'critical') {
      return "I'm deeply concerned about your safety. Please reach out for immediate help: Call 988 (Suicide & Crisis Lifeline), text HOME to 741741, or call 911. You matter, and help is available right now.";
    } else if (crisisResult.severity === 'high') {
      return "I'm so glad you told me, and I'm concerned about your safety. Please connect with emergency support (988 or 741741) or a trusted person. You don't have to face this alone.";
    }
    
    return "Your safety matters most. I'm here with you, and I encourage you to reach out to 988, text 741741, or contact your support network. Help is available.";
  }

  reset() {
    this.crisisDetector.reset();
  }
}

