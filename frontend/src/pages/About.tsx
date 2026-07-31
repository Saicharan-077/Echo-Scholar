import React from 'react';
import { Brain, Command, Check, Sparkles } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 sm:p-6 lg:p-8 space-y-8 max-w-4xl mx-auto">
      
      <div className="saas-panel p-8 bg-white border border-gray-200 space-y-4">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200">
          <Brain className="w-3.5 h-3.5" />
          <span>About EchoXScholar</span>
        </div>
        <h1 className="h1-title text-3xl sm:text-4xl">The AI That Learns How You Learn.</h1>
        <p className="body-text leading-relaxed">
          EchoXScholar is an active, persistent Cognitive Twin AI Learning Companion designed to replace passive reading with interactive mastery.
        </p>
      </div>

      <div className="saas-card p-6 space-y-4">
        <h2 className="h3-title">Core Principles</h2>
        <ul className="space-y-3 text-xs text-gray-700">
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <span><strong>Persistent Cognitive DNA</strong>: Never forgets a student's strengths, weaknesses, or preferred explanation style.</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <span><strong>Interruptible Audio Dialogs</strong>: Pause dual AI co-hosts anytime to ask clarification questions in real-time.</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <span><strong>Directed Acyclic Concept Graphs (DAG)</strong>: Visualizes prerequisite node dependencies and flags red learning gaps before exams.</span>
          </li>
        </ul>
      </div>

    </div>
  );
};
