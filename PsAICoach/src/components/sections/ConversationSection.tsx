'use client';

import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import QuickCaptureBar from '../QuickCaptureBar';

export default function ConversationSection() {
  const { messages, addMessage } = useApp();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const conversationEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user' as const,
      content: input.trim(),
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (TODO: Replace with actual API call)
    setTimeout(() => {
      const aiResponse = {
        role: 'assistant' as const,
        content: generateResponse(userMessage.content),
        timestamp: new Date(),
      };
      addMessage(aiResponse);
      setIsLoading(false);
    }, 1000);
  };

  const generateResponse = (userInput: string) => {
    // Simple mock responses (TODO: Replace with actual AI)
    const lower = userInput.toLowerCase();
    if (lower.includes('help') || lower.includes('crisis')) {
      return "I'm here to support you. If you're in crisis, please reach out to the Crisis Hotline at 988 (24/7) or text HOME to 741741. Would you like to talk about what's troubling you?";
    }
    if (lower.includes('halluc') || lower.includes('hear') || lower.includes('see')) {
      return "It sounds like you're experiencing something uncertain. Would you like to use the Reality Check tool? I can help you analyze and validate your experiences step by step.";
    }
    if (lower.includes('anxious') || lower.includes('stress')) {
      return "I understand you're feeling anxious. Try the Grounding exercise (5-4-3-2-1) or breathing techniques in the Tools section. Would you like me to guide you through one?";
    }
    return "I'm here to listen and support you. How are you feeling right now? Is there something specific you'd like to explore or validate together?";
  };

  return (
    <div className="flex flex-col h-full pt-16 pb-32">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-primary to-secondary text-white'
                  : 'glass-effect text-text'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs opacity-70 mt-2">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="glass-effect rounded-2xl px-4 py-3">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={conversationEndRef} />
      </div>

      <QuickCaptureBar />

      <form onSubmit={handleSubmit} className="px-4 pb-4">
        <div className="glass-effect rounded-2xl flex items-end gap-2 px-4 py-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message PsAICoSys..."
            rows={1}
            className="flex-1 bg-transparent text-text placeholder-text-muted resize-none focus:outline-none max-h-32"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
            aria-label="Send message"
          >
            <i className="fas fa-paper-plane text-white"></i>
          </button>
        </div>
      </form>
    </div>
  );
}

