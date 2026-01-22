'use client';

import { useState } from 'react';

interface Tool {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
}

export default function ToolsSection() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const tools: Tool[] = [
    {
      id: 'reality-check',
      icon: 'fa-eye',
      title: 'Reality Check',
      description: 'Validate experiences with AR support',
      color: 'from-primary to-secondary',
    },
    {
      id: 'grounding',
      icon: 'fa-anchor',
      title: 'Grounding',
      description: '5-4-3-2-1 and breathing exercises',
      color: 'from-secondary to-accent',
    },
    {
      id: 'cbt',
      icon: 'fa-lightbulb',
      title: 'CBT Toolkit',
      description: 'Reframe distorted thinking',
      color: 'from-accent to-warning',
    },
    {
      id: 'mood',
      icon: 'fa-smile',
      title: 'Mood Check',
      description: 'Track how you\'re feeling',
      color: 'from-warning to-success',
    },
  ];

  return (
    <div className="flex flex-col h-full pt-20 pb-20 overflow-y-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <i className="fas fa-tools text-2xl text-secondary"></i>
        <h2 className="text-2xl font-bold text-text">Tools</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setSelectedTool(tool.id)}
            className="glass-effect rounded-3xl p-6 text-left hover:bg-white/10 transition-all active:scale-95 group"
          >
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <i className={`fas ${tool.icon} text-2xl text-white`}></i>
            </div>
            <h3 className="text-lg font-semibold text-text mb-2">{tool.title}</h3>
            <p className="text-sm text-text-muted">{tool.description}</p>
          </button>
        ))}
      </div>

      {/* Tool Modals would go here */}
      {selectedTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="glass-effect rounded-3xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-text">
                {tools.find(t => t.id === selectedTool)?.title}
              </h3>
              <button
                onClick={() => setSelectedTool(null)}
                className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center"
              >
                <i className="fas fa-times text-text"></i>
              </button>
            </div>
            <div className="text-text-muted">
              <p>Tool implementation coming soon...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

