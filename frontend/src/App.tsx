import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Brain, Loader2 } from 'lucide-react';

// Immediate layout & critical components (First paint performance)
import { Navbar } from './components/Navbar';
import { PageTransition } from './components/PageTransition';
import { UniversalSearchModal } from './components/UniversalSearchModal';
import { Copilot } from './components/Copilot';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Lazy-loaded route pages for code-splitting & optimal performance
const DiscoverHub = lazy(() => import('./pages/DiscoverHub').then(m => ({ default: m.DiscoverHub })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const MyResearch = lazy(() => import('./pages/MyResearch').then(m => ({ default: m.MyResearch })));
const ResearchWorkspace = lazy(() => import('./pages/ResearchWorkspace').then(m => ({ default: m.ResearchWorkspace })));
const CommunityHub = lazy(() => import('./pages/CommunityHub').then(m => ({ default: m.CommunityHub })));
const CommunityGroupDetail = lazy(() => import('./pages/CommunityGroupDetail').then(m => ({ default: m.CommunityGroupDetail })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));

const Podcasts = lazy(() => import('./pages/Podcasts').then(m => ({ default: m.Podcasts })));
const VoiceProfessor = lazy(() => import('./pages/VoiceProfessor').then(m => ({ default: m.VoiceProfessor })));
const KnowledgeGraph = lazy(() => import('./pages/KnowledgeGraph').then(m => ({ default: m.KnowledgeGraph })));
const Flashcards = lazy(() => import('./pages/Flashcards').then(m => ({ default: m.Flashcards })));
const Quiz = lazy(() => import('./pages/Quiz').then(m => ({ default: m.Quiz })));
const PlacementMode = lazy(() => import('./pages/PlacementMode').then(m => ({ default: m.PlacementMode })));
const Analytics = lazy(() => import('./pages/Analytics').then(m => ({ default: m.Analytics })));
const GamificationHub = lazy(() => import('./pages/GamificationHub').then(m => ({ default: m.GamificationHub })));
const Learning = lazy(() => import('./pages/Learning').then(m => ({ default: m.Learning })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Upload = lazy(() => import('./pages/Upload').then(m => ({ default: m.Upload })));
const Index = lazy(() => import('./pages/Index').then(m => ({ default: m.Index })));
const Login = lazy(() => import('./pages/Login'));

// Sleek enterprise loading fallback during code chunk loading
const PageLoadingFallback: React.FC = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 space-y-4">
    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md animate-pulse">
      <Brain className="w-5 h-5 text-white" />
    </div>
    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
      <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
      <span>Loading EchoXScholar Module...</span>
    </div>
  </div>
);

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
  const isAuthRoute = location.pathname.startsWith('/login') || location.pathname.startsWith('/auth') || location.pathname.startsWith('/signup');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 selection:bg-indigo-600 selection:text-white font-sans transition-colors">
      {!isWorkspaceRoute && !isAuthRoute && <Navbar onOpenSearch={() => setIsSearchOpen(true)} />}
      
      <UniversalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <main>
        <Suspense fallback={<PageLoadingFallback />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Authentication Routes */}
              <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
              <Route path="/signup" element={<PageTransition><Login /></PageTransition>} />
              <Route path="/auth/callback" element={<PageTransition><Login /></PageTransition>} />

              {/* Public Landing & Discover Routes */}
              <Route path="/" element={<PageTransition><DiscoverHub onOpenSearch={() => setIsSearchOpen(true)} /></PageTransition>} />
              <Route path="/discover" element={<PageTransition><DiscoverHub onOpenSearch={() => setIsSearchOpen(true)} /></PageTransition>} />
              <Route path="/landing" element={<PageTransition><Index /></PageTransition>} />
              <Route path="/about" element={<PageTransition><About /></PageTransition>} />

              {/* Protected Core Platform Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
              <Route path="/research" element={<ProtectedRoute><PageTransition><MyResearch /></PageTransition></ProtectedRoute>} />
              <Route path="/bookmarks" element={<ProtectedRoute><PageTransition><MyResearch /></PageTransition></ProtectedRoute>} />
              <Route path="/upload" element={<ProtectedRoute><PageTransition><Upload /></PageTransition></ProtectedRoute>} />
              <Route path="/workspace" element={<ProtectedRoute><PageTransition><ResearchWorkspace onOpenSearch={() => setIsSearchOpen(true)} /></PageTransition></ProtectedRoute>} />
              <Route path="/workspace/:id" element={<ProtectedRoute><PageTransition><ResearchWorkspace onOpenSearch={() => setIsSearchOpen(true)} /></PageTransition></ProtectedRoute>} />
              <Route path="/community" element={<ProtectedRoute><PageTransition><CommunityHub /></PageTransition></ProtectedRoute>} />
              <Route path="/community/:id" element={<ProtectedRoute><PageTransition><CommunityGroupDetail /></PageTransition></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><PageTransition><Profile /></PageTransition></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><PageTransition><Profile /></PageTransition></ProtectedRoute>} />

              {/* Protected AI Learning Suite Routes */}
              <Route path="/podcasts" element={<ProtectedRoute><PageTransition><Podcasts /></PageTransition></ProtectedRoute>} />
              <Route path="/professor" element={<ProtectedRoute><PageTransition><VoiceProfessor /></PageTransition></ProtectedRoute>} />
              <Route path="/notes" element={<ProtectedRoute><PageTransition><VoiceProfessor /></PageTransition></ProtectedRoute>} />
              <Route path="/graph" element={<ProtectedRoute><PageTransition><KnowledgeGraph /></PageTransition></ProtectedRoute>} />
              <Route path="/mindmap" element={<ProtectedRoute><PageTransition><KnowledgeGraph /></PageTransition></ProtectedRoute>} />
              <Route path="/flowchart" element={<ProtectedRoute><PageTransition><KnowledgeGraph /></PageTransition></ProtectedRoute>} />
              <Route path="/flashcards" element={<ProtectedRoute><PageTransition><Flashcards /></PageTransition></ProtectedRoute>} />
              <Route path="/quiz" element={<ProtectedRoute><PageTransition><Quiz /></PageTransition></ProtectedRoute>} />
              <Route path="/placement" element={<ProtectedRoute><PageTransition><PlacementMode /></PageTransition></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><PageTransition><Analytics /></PageTransition></ProtectedRoute>} />
              <Route path="/gamification" element={<ProtectedRoute><PageTransition><GamificationHub /></PageTransition></ProtectedRoute>} />
              <Route path="/learning" element={<ProtectedRoute><PageTransition><Learning /></PageTransition></ProtectedRoute>} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      
      {!isAuthRoute && <Copilot />}
    </div>
  );
};

export default App;
