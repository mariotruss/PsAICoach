'use client';

import { useApp } from '@/contexts/AppContext';

export default function InsightsSection() {
  const { journalEntries, messages } = useApp();

  const stats = {
    totalJournalEntries: journalEntries.length,
    totalConversations: messages.filter(m => m.role === 'user').length,
    streak: 0, // TODO: Calculate actual streak
    avgMood: 7.2, // TODO: Calculate from actual mood data
  };

  return (
    <div className="flex flex-col h-full pt-20 pb-20 overflow-y-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <i className="fas fa-chart-line text-2xl text-accent"></i>
        <h2 className="text-2xl font-bold text-text">Insights</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-effect rounded-3xl p-6 text-center">
          <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            {stats.totalJournalEntries}
          </div>
          <p className="text-sm text-text-muted">Journal Entries</p>
        </div>
        <div className="glass-effect rounded-3xl p-6 text-center">
          <div className="text-4xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent mb-2">
            {stats.totalConversations}
          </div>
          <p className="text-sm text-text-muted">Conversations</p>
        </div>
        <div className="glass-effect rounded-3xl p-6 text-center">
          <div className="text-4xl font-bold bg-gradient-to-r from-accent to-warning bg-clip-text text-transparent mb-2">
            {stats.streak}
          </div>
          <p className="text-sm text-text-muted">Day Streak</p>
        </div>
        <div className="glass-effect rounded-3xl p-6 text-center">
          <div className="text-4xl font-bold bg-gradient-to-r from-warning to-success bg-clip-text text-transparent mb-2">
            {stats.avgMood.toFixed(1)}
          </div>
          <p className="text-sm text-text-muted">Avg Mood</p>
        </div>
      </div>

      {/* Mood Summary */}
      <div className="glass-effect rounded-3xl p-6 space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <i className="fas fa-smile text-success"></i>
          Mood Summary
        </h3>
        <p className="text-text-muted text-sm">
          You've been consistently journaling and engaging with your companion. Keep up the great work!
        </p>
        <div className="h-48 flex items-center justify-center text-text-muted">
          <p>Detailed mood analysis coming soon...</p>
        </div>
      </div>

      {/* Highlights */}
      <div className="glass-effect rounded-3xl p-6 space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <i className="fas fa-star text-warning"></i>
          This Week's Highlights
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
            <i className="fas fa-check-circle text-success mt-1"></i>
            <div>
              <p className="text-sm text-text">Completed 3 reality checks</p>
              <p className="text-xs text-text-muted">Great progress on validation!</p>
            </div>
          </li>
          <li className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
            <i className="fas fa-check-circle text-success mt-1"></i>
            <div>
              <p className="text-sm text-text">Used grounding techniques 5 times</p>
              <p className="text-xs text-text-muted">Excellent self-care!</p>
            </div>
          </li>
          <li className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
            <i className="fas fa-check-circle text-success mt-1"></i>
            <div>
              <p className="text-sm text-text">7-day journaling streak</p>
              <p className="text-xs text-text-muted">Keep it up!</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

