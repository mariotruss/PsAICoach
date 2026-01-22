'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';

export default function JournalSection() {
  const { journalEntries, addJournalEntry } = useApp();
  const [response, setResponse] = useState('');
  const [feedback, setFeedback] = useState('');

  const prompts = [
    "How are you feeling today?",
    "What's something positive that happened today?",
    "What challenges did you face, and how did you handle them?",
    "What are you grateful for right now?",
    "Describe a moment when you felt at peace today.",
  ];

  const currentPrompt = prompts[Math.floor(Math.random() * prompts.length)];

  const handleSave = () => {
    if (!response.trim()) {
      setFeedback('Please write something before saving.');
      return;
    }

    const entry = {
      id: Date.now().toString(),
      prompt: currentPrompt,
      response: response.trim(),
      timestamp: new Date(),
      mood: 7, // TODO: Add mood selector
    };

    addJournalEntry(entry);
    setFeedback('✓ Saved successfully!');
    setResponse('');

    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div className="flex flex-col h-full pt-20 pb-20 overflow-y-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <i className="fas fa-book-open text-2xl text-primary"></i>
        <h2 className="text-2xl font-bold text-text">Journal</h2>
      </div>

      {/* Journal Entry Card */}
      <div className="glass-effect rounded-3xl p-6 space-y-4">
        <p className="text-lg font-medium text-accent">{currentPrompt}</p>
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Write about your day, thoughts, or feelings..."
          rows={8}
          className="w-full bg-white/5 text-text placeholder-text-muted rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
        />
        <div className="flex items-center justify-between">
          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:scale-105 transition-transform flex items-center gap-2"
          >
            <i className="fas fa-check"></i>
            Save
          </button>
          {feedback && (
            <p className="text-sm text-success animate-fade-in">{feedback}</p>
          )}
        </div>
      </div>

      {/* Mood Trend Card */}
      <div className="glass-effect rounded-3xl p-6 space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <i className="fas fa-chart-line text-accent"></i>
          Mood Trend
        </h3>
        <div className="h-48 flex items-center justify-center text-text-muted">
          <p>Chart coming soon...</p>
        </div>
      </div>

      {/* Recent Moments */}
      <div className="glass-effect rounded-3xl p-6 space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <i className="fas fa-star text-warning"></i>
          Recent Moments
        </h3>
        {journalEntries.length === 0 ? (
          <p className="text-text-muted text-sm">No journal entries yet. Start writing to see your moments here!</p>
        ) : (
          <ul className="space-y-3">
            {journalEntries.slice(-5).reverse().map((entry) => (
              <li key={entry.id} className="bg-white/5 rounded-xl p-4">
                <p className="text-sm font-medium text-accent mb-1">{entry.prompt}</p>
                <p className="text-sm text-text line-clamp-2">{entry.response}</p>
                <p className="text-xs text-text-muted mt-2">
                  {new Date(entry.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

