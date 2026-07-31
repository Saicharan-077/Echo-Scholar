import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Command, 
  FileText, 
  FolderKanban, 
  Upload, 
  MessageSquare, 
  ArrowRight,
  Brain,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface UniversalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UniversalSearchModal: React.FC<UniversalSearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickActions = [
    {
      label: 'Search Research Papers',
      action: () => { navigate('/research?tab=library'); onClose(); },
      icon: Search,
      tag: 'Discovery'
    },
    {
      label: 'Open Research Workspace',
      action: () => { navigate('/workspace/transformer-1'); onClose(); },
      icon: BookOpen,
      tag: 'Workspace'
    },
    {
      label: 'Upload New PDF Paper',
      action: () => { navigate('/research?tab=library&sub=upload'); onClose(); },
      icon: Upload,
      tag: 'Ingest'
    },
    {
      label: 'Create Research Project',
      action: () => { navigate('/research?tab=projects'); onClose(); },
      icon: FolderKanban,
      tag: 'Project'
    },
    {
      label: 'Ask Professor Vox',
      action: () => { navigate('/workspace/transformer-1'); onClose(); },
      icon: Brain,
      tag: 'AI Tutor'
    }
  ];

  const suggestedPapers = [
    { title: 'Attention Is All You Need', sub: 'Transformer Self-Attention Architecture • Vaswani et al.', id: 'transformer-1' },
    { title: 'Deep Residual Learning for Image Recognition', sub: 'ResNet Skip Connections • He et al.', id: 'resnet-2' },
    { title: 'Raft Consensus Algorithm Breakdown', sub: 'Distributed Systems & State Replicas • Ongaro et al.', id: 'raft-3' },
  ];

  const filteredActions = quickActions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()));
  const filteredPapers = suggestedPapers.filter(p => p.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Bar Input Header */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a paper, topic, workspace, or action (e.g. 'Transformers')..."
            className="w-full bg-transparent text-base text-gray-900 font-medium outline-none placeholder:text-gray-400"
            autoFocus
          />
          <kbd className="px-2 py-0.5 text-xs font-semibold text-gray-400 bg-white border border-gray-200 rounded shadow-xs shrink-0">
            ESC
          </kbd>
        </div>

        {/* Action Results */}
        <div className="p-3 max-h-[420px] overflow-y-auto space-y-4">
          
          {/* Quick Executable Actions */}
          <div className="space-y-1">
            <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Quick Actions
            </p>
            {filteredActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={action.action}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-indigo-50/80 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200/80 text-indigo-600 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-gray-800 group-hover:text-indigo-950">{action.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge-accent text-[11px] px-2 py-0.5">{action.tag}</span>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Jump to Research Papers */}
          <div className="space-y-1 pt-2 border-t border-gray-100">
            <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Research Papers & Workspaces
            </p>
            {filteredPapers.map((paper) => (
              <button
                key={paper.id}
                onClick={() => {
                  navigate(`/workspace/${paper.id}`);
                  onClose();
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600">{paper.title}</h4>
                    <p className="text-xs text-gray-500">{paper.sub}</p>
                  </div>
                </div>
                <span className="text-xs text-indigo-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Open →
                </span>
              </button>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
