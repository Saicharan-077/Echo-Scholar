import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Index } from './pages/Index';
import { Dashboard } from './pages/Dashboard';
import { Podcasts } from './pages/Podcasts';
import { VoiceProfessor } from './pages/VoiceProfessor';
import { KnowledgeGraph } from './pages/KnowledgeGraph';
import { PlacementMode } from './pages/PlacementMode';
import { GamificationHub } from './pages/GamificationHub';

import { Upload } from './pages/Upload';
import { Profile } from './pages/Profile';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 selection:bg-purple-500 selection:text-white">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/podcasts" element={<Podcasts />} />
          <Route path="/professor" element={<VoiceProfessor />} />
          <Route path="/graph" element={<KnowledgeGraph />} />
          <Route path="/placement" element={<PlacementMode />} />
          <Route path="/gamification" element={<GamificationHub />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
};
export default App;
