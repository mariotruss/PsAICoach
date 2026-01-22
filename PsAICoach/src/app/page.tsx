'use client';

import { AppProvider, useApp } from '@/contexts/AppContext';
import CompanionHeader from '@/components/CompanionHeader';
import BottomNavigation from '@/components/BottomNavigation';
import CrisisBanner from '@/components/CrisisBanner';
import ConversationSection from '@/components/sections/ConversationSection';
import JournalSection from '@/components/sections/JournalSection';
import ToolsSection from '@/components/sections/ToolsSection';
import InsightsSection from '@/components/sections/InsightsSection';
import Link from 'next/link';

function AppContent() {
  const { currentSection } = useApp();

  return (
    <>
      <CompanionHeader />
      <CrisisBanner />
      
      <main className="min-h-screen">
        <div className={currentSection === 'conversation' ? 'block' : 'hidden'}>
          <ConversationSection />
        </div>
        <div className={currentSection === 'journal' ? 'block' : 'hidden'}>
          <JournalSection />
        </div>
        <div className={currentSection === 'tools' ? 'block' : 'hidden'}>
          <ToolsSection />
        </div>
        <div className={currentSection === 'insights' ? 'block' : 'hidden'}>
          <InsightsSection />
        </div>
      </main>

      <BottomNavigation />

      {/* Landing Page Link */}
      <Link
        href="/landing"
        className="fixed top-20 right-4 z-40 glass-effect rounded-full px-4 py-2 text-sm text-text hover:bg-white/10 transition-colors"
      >
        <i className="fas fa-info-circle mr-2"></i>
        About
      </Link>
    </>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

