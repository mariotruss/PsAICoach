'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface JournalEntry {
  id: string;
  prompt: string;
  response: string;
  timestamp: Date;
  mood?: number;
}

interface AppState {
  currentSection: string;
  setCurrentSection: (section: string) => void;
  messages: Message[];
  addMessage: (message: Message) => void;
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: JournalEntry) => void;
  isVoiceActive: boolean;
  setIsVoiceActive: (active: boolean) => void;
  showCrisisBanner: boolean;
  setShowCrisisBanner: (show: boolean) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentSection, setCurrentSection] = useState('conversation');
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: "Hi there! I'm PsAICoSys, your mental health companion. I'm here to support you with reality validation, coping strategies, and daily reflections. How can I help you today?",
    timestamp: new Date()
  }]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [showCrisisBanner, setShowCrisisBanner] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('psaicoach-messages');
    const savedJournal = localStorage.getItem('psaicoach-journal');
    
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        if (parsed.length > 0) {
          setMessages(parsed);
        }
      } catch (e) {
        console.error('Failed to parse saved messages', e);
      }
    }
    
    if (savedJournal) {
      try {
        setJournalEntries(JSON.parse(savedJournal));
      } catch (e) {
        console.error('Failed to parse saved journal', e);
      }
    }
    
    setIsLoaded(true);
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (isLoaded && messages.length > 0) {
      localStorage.setItem('psaicoach-messages', JSON.stringify(messages));
    }
  }, [messages, isLoaded]);

  // Save journal to localStorage
  useEffect(() => {
    if (isLoaded && journalEntries.length > 0) {
      localStorage.setItem('psaicoach-journal', JSON.stringify(journalEntries));
    }
  }, [journalEntries, isLoaded]);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const addJournalEntry = (entry: JournalEntry) => {
    setJournalEntries(prev => [...prev, entry]);
  };

  return (
    <AppContext.Provider
      value={{
        currentSection,
        setCurrentSection,
        messages,
        addMessage,
        journalEntries,
        addJournalEntry,
        isVoiceActive,
        setIsVoiceActive,
        showCrisisBanner,
        setShowCrisisBanner,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

