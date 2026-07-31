import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { PageTransition } from './components/PageTransition';
import { UniversalSearchModal } from './components/UniversalSearchModal';
import { Copilot } from './components/Copilot';

import { Index } from './pages/Index';
import { DiscoverHub } from './pages/DiscoverHub';
import { MyResearch } from './pages/MyResearch';
import { ResearchWorkspace } from './pages/ResearchWorkspace';
import { CommunityHub } from './pages/CommunityHub';
import { CommunityGroupDetail } from './pages/CommunityGroupDetail';
import { Profile } from './pages/Profile';

import { Podcasts } from './pages/Podcasts';
import { VoiceProfessor } from './pages/VoiceProfessor';
import { KnowledgeGraph } from './pages/KnowledgeGraph';
import { Flashcards } from './pages/Flashcards';
import { Quiz } from './pages/Quiz';
import { PlacementMode } from './pages/PlacementMode';
import { Analytics } from './pages/Analytics';
import { About } from './pages/About';
import { Upload } from './pages/Upload';

export const App: React.FC = () => {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global Cmd+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isWorkspaceRoute = location.pathname.startsWith('/workspace');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 selection:bg-indigo-600 selection:text-white font-sans">
      {!isWorkspaceRoute && <Navbar onOpenSearch={() => setIsSearchOpen(true)} />}
      
      <UniversalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Primary Phase 1 MVP Routes */}
            <Route path="/" element={<PageTransition><DiscoverHub onOpenSearch={() => setIsSearchOpen(true)} /></PageTransition>} />
            <Route path="/discover" element={<PageTransition><DiscoverHub onOpenSearch={() => setIsSearchOpen(true)} /></PageTransition>} />
            <Route path="/research" element={<PageTransition><MyResearch /></PageTransition>} />
            <Route path="/upload" element={<PageTransition><Upload /></PageTransition>} />
            <Route path="/workspace" element={<PageTransition><ResearchWorkspace onOpenSearch={() => setIsSearchOpen(true)} /></PageTransition>} />
            <Route path="/workspace/:id" element={<PageTransition><ResearchWorkspace onOpenSearch={() => setIsSearchOpen(true)} /></PageTransition>} />
            <Route path="/community" element={<PageTransition><CommunityHub /></PageTransition>} />
            <Route path="/community/:id" element={<PageTransition><CommunityGroupDetail /></PageTransition>} />
            <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />

            {/* Dedicated Tool Pages & Legacy Support */}
            <Route path="/podcasts" element={<PageTransition><Podcasts /></PageTransition>} />
            <Route path="/professor" element={<PageTransition><VoiceProfessor /></PageTransition>} />
            <Route path="/graph" element={<PageTransition><KnowledgeGraph /></PageTransition>} />
            <Route path="/flashcards" element={<PageTransition><Flashcards /></PageTransition>} />
            <Route path="/quiz" element={<PageTransition><Quiz /></PageTransition>} />
            <Route path="/placement" element={<PageTransition><PlacementMode /></PageTransition>} />
            <Route path="/analytics" element={<PageTransition><Analytics /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/landing" element={<PageTransition><Index /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      
      <Copilot />
    </div>
  );
};
export default App;
