'use client';

export default function CompanionHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-gradient-to-r from-primary/20 to-secondary/20 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 animate-ping opacity-75">
              <div className="w-12 h-12 rounded-full bg-primary/30"></div>
            </div>
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <i className="fas fa-brain text-white text-xl"></i>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PsAICoSys
            </h1>
            <p className="text-xs text-text-muted">Reality validation & support</p>
          </div>
        </div>
        <button
          className="w-10 h-10 rounded-full glass-effect flex items-center justify-center hover:bg-white/10 transition-colors"
          aria-label="Settings"
        >
          <i className="fas fa-cog text-text"></i>
        </button>
      </div>
    </header>
  );
}

