// Conversation Flow Manager - Handles voice-first conversation flows
export class ConversationFlow {
  constructor() {
    this.currentFlow = null;
    this.flowHistory = [];
    
    this.flows = {
      initial: {
        id: 'initial',
        message: "Hi, I'm PsyCoach. I'm here to support you. What's on your mind today?",
        options: [
          { text: "I'm feeling anxious", next: 'anxiety_support' },
          { text: "I need to talk", next: 'open_conversation' },
          { text: "Show me tools", next: 'tools_menu' },
          { text: "Journal entry", next: 'journal_flow' }
        ]
      },
      
      anxiety_support: {
        id: 'anxiety_support',
        message: "I hear that you're feeling anxious. That must be challenging. Would you like to try a grounding exercise, or would you prefer to talk about what's triggering the anxiety?",
        options: [
          { text: "Try grounding", next: 'grounding_exercise' },
          { text: "Talk about it", next: 'open_conversation' },
          { text: "Go back", next: 'initial' }
        ]
      },
      
      grounding_exercise: {
        id: 'grounding_exercise',
        message: "Let's do a quick grounding exercise together. I'll guide you through the 5-4-3-2-1 technique. Are you ready?",
        options: [
          { text: "Yes, I'm ready", next: 'grounding_steps' },
          { text: "Different exercise", next: 'grounding_menu' },
          { text: "Not now", next: 'initial' }
        ]
      },
      
      grounding_steps: {
        id: 'grounding_steps',
        message: "Great. Take a deep breath. Now, name 5 things you can see around you. Take your time.",
        isExercise: true,
        onComplete: () => "How are you feeling now? Rate your anxiety from 0 to 10."
      },
      
      grounding_menu: {
        id: 'grounding_menu',
        message: "I can guide you through breathing exercises, body scan, or a mental grounding technique. Which would you prefer?",
        options: [
          { text: "Breathing exercise", next: 'breathing_exercise' },
          { text: "Body scan", next: 'body_scan' },
          { text: "Mental grounding", next: 'mental_grounding' },
          { text: "Go back", next: 'anxiety_support' }
        ]
      },
      
      open_conversation: {
        id: 'open_conversation',
        message: "I'm listening. Take your time and share whatever feels right.",
        isFreeForm: true
      },
      
      tools_menu: {
        id: 'tools_menu',
        message: "I have several tools to help you. Would you like CBT exercises, mood tracking, reality checks, or journaling?",
        options: [
          { text: "CBT exercises", next: 'cbt_menu' },
          { text: "Mood tracking", next: 'mood_tracking' },
          { text: "Reality check", next: 'reality_check' },
          { text: "Journal entry", next: 'journal_flow' },
          { text: "Go back", next: 'initial' }
        ]
      },
      
      journal_flow: {
        id: 'journal_flow',
        message: "Let's capture your thoughts. Here's today's prompt: What's one thing that brought you peace today, even for a moment?",
        isJournaling: true,
        onComplete: (entry) => `Thank you for sharing. Your entry has been saved securely.`
      },
      
      cbt_menu: {
        id: 'cbt_menu',
        message: "CBT can help identify thought patterns. Would you like to explore cognitive distortions, practice reframing, or work through a specific thought?",
        options: [
          { text: "Identify distortions", next: 'distortion_check' },
          { text: "Reframe a thought", next: 'reframing_exercise' },
          { text: "Go back", next: 'tools_menu' }
        ]
      },
      
      mood_tracking: {
        id: 'mood_tracking',
        message: "How are you feeling right now? You can say a mood like 'anxious', 'calm', 'sad', or rate it from 0 to 10.",
        isMoodCapture: true,
        onComplete: (mood) => `Got it. I've logged that you're feeling ${mood}. I'll track this over time to help you see patterns.`
      },
      
      reality_check: {
        id: 'reality_check',
        message: "Reality checking can help when thoughts feel distorted. Tell me what's feeling uncertain or concerning to you.",
        isRealityCheck: true
      }
    };
  }

  startFlow(flowId = 'initial') {
    this.currentFlow = this.flows[flowId];
    this.flowHistory.push(flowId);
    return this.currentFlow;
  }

  getNextFlow(optionIndex) {
    if (!this.currentFlow || !this.currentFlow.options) {
      return null;
    }

    const option = this.currentFlow.options[optionIndex];
    if (!option) return null;

    return this.startFlow(option.next);
  }

  getCurrentMessage() {
    return this.currentFlow?.message || "How can I support you?";
  }

  getOptions() {
    return this.currentFlow?.options || [];
  }

  goBack() {
    if (this.flowHistory.length > 1) {
      this.flowHistory.pop(); // Remove current
      const previousId = this.flowHistory[this.flowHistory.length - 1];
      this.currentFlow = this.flows[previousId];
      return this.currentFlow;
    }
    return null;
  }

  reset() {
    this.currentFlow = null;
    this.flowHistory = [];
  }

  isFreeForm() {
    return this.currentFlow?.isFreeForm === true;
  }

  isExercise() {
    return this.currentFlow?.isExercise === true;
  }

  isJournaling() {
    return this.currentFlow?.isJournaling === true;
  }

  isMoodCapture() {
    return this.currentFlow?.isMoodCapture === true;
  }

  isRealityCheck() {
    return this.currentFlow?.isRealityCheck === true;
  }

  handleCompletion(data) {
    if (this.currentFlow?.onComplete) {
      return this.currentFlow.onComplete(data);
    }
    return null;
  }
}

