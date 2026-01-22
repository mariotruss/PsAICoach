'use client';

import { useApp } from '@/contexts/AppContext';

export default function CrisisBanner() {
  const { showCrisisBanner, setShowCrisisBanner } = useApp();

  if (!showCrisisBanner) return null;

  return (
    <div
      className="fixed top-16 left-0 right-0 z-40 bg-danger/90 backdrop-blur-lg border-b border-danger"
      role="alert"
      aria-live="assertive"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-start gap-3">
        <i className="fas fa-exclamation-triangle text-white text-xl flex-shrink-0 mt-0.5"></i>
        <div className="flex-1 text-white">
          <strong className="block mb-1">Emergency Help Available:</strong>
          <p className="text-sm">
            Crisis Hotline: <a href="tel:988" className="underline font-semibold">988</a> (24/7) •
            Crisis Text Line: Text <strong>HOME</strong> to <a href="sms:741741" className="underline font-semibold">741741</a> •
            Emergency: <a href="tel:911" className="underline font-semibold">911</a>
          </p>
        </div>
        <button
          onClick={() => setShowCrisisBanner(false)}
          className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white flex-shrink-0"
          aria-label="Close banner"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
}

