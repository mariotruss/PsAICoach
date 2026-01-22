// Advanced Crisis Detection Module
export class CrisisDetector {
  constructor() {
    this.crisisPhrases = [
      { phrase: 'kill myself', severity: 'critical', category: 'suicidal' },
      { phrase: 'end my life', severity: 'critical', category: 'suicidal' },
      { phrase: 'suicide', severity: 'critical', category: 'suicidal' },
      { phrase: 'want to die', severity: 'critical', category: 'suicidal' },
      { phrase: 'self-harm', severity: 'high', category: 'self-harm' },
      { phrase: 'hurt myself', severity: 'high', category: 'self-harm' },
      { phrase: 'cut myself', severity: 'high', category: 'self-harm' },
      { phrase: "can't go on", severity: 'high', category: 'hopelessness' },
      { phrase: "no point", severity: 'medium', category: 'hopelessness' },
      { phrase: "end it all", severity: 'critical', category: 'suicidal' }
    ];
    
    this.conversationHistory = [];
    this.maxHistoryLength = 10;
  }

  addToHistory(message) {
    this.conversationHistory.push({
      text: message,
      timestamp: Date.now(),
      sentiment: this.analyzeSentiment(message)
    });

    if (this.conversationHistory.length > this.maxHistoryLength) {
      this.conversationHistory.shift();
    }
  }

  analyzeSentiment(text) {
    const negativeWords = ['hopeless', 'worthless', 'desperate', 'alone', 'helpless', 
                          'pointless', 'terrible', 'awful', 'hate', 'failed'];
    const positiveWords = ['hope', 'better', 'trying', 'support', 'help', 
                          'improvement', 'grateful', 'thankful'];
    
    const lowerText = text.toLowerCase();
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    
    return negativeCount - positiveCount;
  }

  detectKeywords(text) {
    const lowerText = text.toLowerCase();
    
    // Check for negation context (e.g., "I don't want to hurt myself")
    const negationPatterns = [
      /don'?t\s+want\s+to\s+(kill|hurt|harm)/i,
      /won'?t\s+(kill|hurt|harm)/i,
      /not\s+going\s+to\s+(kill|hurt|harm)/i,
      /never\s+(kill|hurt|harm)/i
    ];
    
    // If negation found, reduce severity
    const hasNegation = negationPatterns.some(pattern => pattern.test(text));
    
    for (const { phrase, severity, category } of this.crisisPhrases) {
      if (lowerText.includes(phrase)) {
        return {
          detected: true,
          phrase,
          severity: hasNegation ? 'low' : severity,
          category,
          hasNegation
        };
      }
    }
    
    return { detected: false };
  }

  analyzeContext() {
    if (this.conversationHistory.length < 3) {
      return { riskLevel: 'low', pattern: null };
    }

    const recentMessages = this.conversationHistory.slice(-5);
    const avgSentiment = recentMessages.reduce((sum, msg) => sum + msg.sentiment, 0) / recentMessages.length;
    
    // Check for escalating negative sentiment
    const sentimentTrend = recentMessages.map(msg => msg.sentiment);
    const isEscalating = sentimentTrend[sentimentTrend.length - 1] > sentimentTrend[0] + 2;
    
    if (avgSentiment >= 3 && isEscalating) {
      return { riskLevel: 'high', pattern: 'escalating_distress' };
    } else if (avgSentiment >= 2) {
      return { riskLevel: 'medium', pattern: 'persistent_negativity' };
    }
    
    return { riskLevel: 'low', pattern: null };
  }

  detect(text) {
    this.addToHistory(text);
    
    const keywordResult = this.detectKeywords(text);
    const contextResult = this.analyzeContext();
    
    // Crisis if explicit keywords or high context risk
    if (keywordResult.detected && !keywordResult.hasNegation) {
      if (keywordResult.severity === 'critical') {
        return {
          isCrisis: true,
          severity: 'critical',
          reason: 'explicit_threat',
          details: keywordResult
        };
      } else if (keywordResult.severity === 'high') {
        return {
          isCrisis: true,
          severity: 'high',
          reason: 'self_harm_indication',
          details: keywordResult
        };
      }
    }
    
    // Elevated concern based on context
    if (contextResult.riskLevel === 'high') {
      return {
        isCrisis: false,
        elevated: true,
        severity: 'medium',
        reason: 'contextual_concern',
        details: contextResult
      };
    }
    
    return { isCrisis: false, elevated: false };
  }

  reset() {
    this.conversationHistory = [];
  }
}

