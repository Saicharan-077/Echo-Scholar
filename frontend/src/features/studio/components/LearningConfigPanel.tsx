import React from 'react';
import { Globe, Clock, BarChart2, Target } from 'lucide-react';
import { LearningStudioConfig } from '../types/studio';
import { 
  LANGUAGE_OPTIONS, 
  DURATION_OPTIONS, 
  DIFFICULTY_OPTIONS, 
  FOCUS_OPTIONS 
} from '../constants/studio.constants';

export interface LearningConfigPanelProps {
  config: LearningStudioConfig;
  onChange: (key: keyof LearningStudioConfig, value: string) => void;
}

export const LearningConfigPanel: React.FC<LearningConfigPanelProps> = ({ config, onChange }) => {
  return (
    <div className="p-6 bg-white border border-gray-200/80 rounded-2xl space-y-6 shadow-xs">
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <span>⚙️ Session Learning Parameters</span>
        </h3>
        <p className="text-xs text-gray-600">Customize language, detail depth, difficulty level, and primary focus area.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Language Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            <span>Language</span>
          </label>
          <select
            value={config.language}
            onChange={(e) => onChange('language', e.target.value)}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 outline-none focus:border-indigo-600 transition-colors"
          >
            {LANGUAGE_OPTIONS.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        {/* Duration Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>Duration / Detail Depth</span>
          </label>
          <select
            value={config.duration}
            onChange={(e) => onChange('duration', e.target.value)}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 outline-none focus:border-indigo-600 transition-colors"
          >
            {DURATION_OPTIONS.map((dur) => (
              <option key={dur} value={dur}>{dur}</option>
            ))}
          </select>
        </div>

        {/* Difficulty Level */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
            <BarChart2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Target Audience / Difficulty</span>
          </label>
          <select
            value={config.difficulty}
            onChange={(e) => onChange('difficulty', e.target.value)}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 outline-none focus:border-indigo-600 transition-colors"
          >
            {DIFFICULTY_OPTIONS.map((diff) => (
              <option key={diff} value={diff}>{diff}</option>
            ))}
          </select>
        </div>

        {/* Primary Focus Area */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-indigo-600" />
            <span>Key Focus Area</span>
          </label>
          <select
            value={config.focus}
            onChange={(e) => onChange('focus', e.target.value)}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 outline-none focus:border-indigo-600 transition-colors"
          >
            {FOCUS_OPTIONS.map((foc) => (
              <option key={foc} value={foc}>{foc}</option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
};
