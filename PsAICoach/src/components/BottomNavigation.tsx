'use client';

import { useApp } from '@/contexts/AppContext';

export default function BottomNavigation() {
  const { currentSection, setCurrentSection } = useApp();

  const navItems = [
    { id: 'conversation', icon: 'fa-comments', label: 'Chat' },
    { id: 'journal', icon: 'fa-book-open', label: 'Journal' },
    { id: 'tools', icon: 'fa-tools', label: 'Tools' },
    { id: 'insights', icon: 'fa-chart-line', label: 'Insights' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-bg-card/90 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-around">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentSection(item.id)}
            className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all ${
              currentSection === item.id
                ? 'text-primary'
                : 'text-text-muted hover:text-text'
            }`}
            aria-label={item.label}
            aria-current={currentSection === item.id ? 'page' : undefined}
          >
            <i className={`fas ${item.icon} text-lg`}></i>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

