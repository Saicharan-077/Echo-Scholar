import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';
import { LEARNING_MODES } from '../constants/studio.constants';
import { LearningModeId, LearningStudioConfig } from '../types/studio';
import { LearningModeCard } from './LearningModeCard';
import { LearningConfigPanel } from './LearningConfigPanel';
import { Button } from '../../../shared/ui/Button';
import { Badge } from '../../../shared/ui/Badge';
import { api } from '../../../services/api';

export interface LearningStudioModalProps {
  paperTitle?: string;
  paperId?: string | number;
  onClose?: () => void;
}

export const LearningStudioModal: React.FC<LearningStudioModalProps> = ({
  paperTitle = 'Attention Is All You Need — Transformer Architecture',
  paperId = 'transformer-1',
  onClose,
}) => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<LearningModeId>('story_mode');
  const [config, setConfig] = useState<LearningStudioConfig>({
    language: 'English',
    duration: '15-Min Deep Dive',
    difficulty: 'Practitioner / Engineer',
    focus: 'General Understanding'
  });
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [configuredSuccess, setConfiguredSuccess] = useState(false);

  const handleConfigChange = (key: keyof LearningStudioConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleLaunchStudioSession = async () => {
    setIsConfiguring(true);
    // Non-blocking prompt mapping request
    api.post('/studio/configure', {
      paper_id: paperId,
      paper_title: paperTitle,
      learning_mode: selectedMode,
      language: config.language,
      duration: config.duration,
      difficulty: config.difficulty,
      focus: config.focus
    }).catch((e) => console.log('Studio config note:', e));

    setConfiguredSuccess(true);
    setTimeout(() => {
      navigate(`/workspace/${paperId || 'transformer-1'}`);
    }, 250);
  };

  const currentModeDef = LEARNING_MODES.find(m => m.id === selectedMode) || LEARNING_MODES[0];

  return (
    <div className="space-y-10 max-w-6xl mx-auto py-8 px-4 sm:px-6">
      
      {/* 1. HEADER HERO */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
          How would you like to learn this research paper?
        </h1>

        <div className="p-2.5 px-4 bg-white border border-gray-200/80 rounded-xl inline-flex items-center gap-2 text-xs font-semibold text-gray-700 shadow-2xs">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>Paper: <strong className="text-gray-900 font-bold">{paperTitle}</strong></span>
        </div>
      </div>

      {/* 2. THE 5 FLAGSHIP LEARNING MODES GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Step 1: Choose Your Learning Mode</span>
          <span className="text-xs font-semibold text-indigo-600">Selected: {currentModeDef.title}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LEARNING_MODES.map((mode) => (
            <LearningModeCard
              key={mode.id}
              mode={mode}
              isSelected={selectedMode === mode.id}
              onSelect={setSelectedMode}
            />
          ))}
        </div>
      </div>

      {/* 3. CONFIGURATION PANEL & SESSION LAUNCH */}
      <div className="space-y-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Step 2: Configure Learning Parameters</span>
        </div>

        <LearningConfigPanel
          config={config}
          onChange={handleConfigChange}
        />

        {/* CTA Launch Bar */}
        <div className="p-6 bg-indigo-950 text-white rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-indigo-900">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-lg">{currentModeDef.emoji}</span>
              <h3 className="font-extrabold text-lg text-white">{currentModeDef.title} Workspace Ready</h3>
            </div>
            <p className="text-xs text-indigo-200">
              Format: <strong>{currentModeDef.participants}</strong> • {config.duration} • {config.difficulty} ({config.language})
            </p>
          </div>

          <button
            onClick={handleLaunchStudioSession}
            disabled={isConfiguring}
            className="px-8 py-3.5 bg-white hover:bg-gray-100 text-indigo-950 font-extrabold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 shrink-0 transition-all cursor-pointer disabled:opacity-70"
          >
            {configuredSuccess ? (
              <span className="flex items-center gap-2 text-emerald-700 font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Entering Workspace...
              </span>
            ) : isConfiguring ? (
              <span className="text-indigo-950 font-bold">Configuring Session...</span>
            ) : (
              <span className="flex items-center gap-2 text-indigo-950 font-extrabold">
                Launch {currentModeDef.title} Session <ArrowRight className="w-4 h-4 text-indigo-950" />
              </span>
            )}
          </button>
        </div>
      </div>

    </div>
  );
};
