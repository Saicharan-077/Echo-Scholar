import React from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Button } from '../../../shared/ui/Button';

export interface SearchHeroProps {
  userName: string;
  topicQuery: string;
  onQueryChange: (query: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onOpenSearch?: () => void;
  popularTopics: string[];
  onSelectTopic: (topic: string) => void;
}

export const SearchHero: React.FC<SearchHeroProps> = ({
  userName,
  topicQuery,
  onQueryChange,
  onSubmit,
  onOpenSearch,
  popularTopics,
  onSelectTopic,
}) => {
  return (
    <section className="bg-white border-b border-gray-200/80 py-16 lg:py-24 px-6 sm:px-8 lg:px-12">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-semibold shadow-xs">
          <Sparkles className="w-4 h-4" />
          <span>EchoScholar AI — Research & Learning Operating System</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
          Good Afternoon, <span className="text-indigo-600">{userName}</span>.<br />
          How can I help you learn today?
        </h1>

        {/* Real Interactive Search Bar Form */}
        <form onSubmit={onSubmit} className="relative max-w-2xl mx-auto">
          <div className="w-full bg-white border-2 border-indigo-200 focus-within:border-indigo-600 rounded-2xl p-2.5 sm:p-3 shadow-md flex items-center gap-3 transition-all">
            <Search className="w-5 h-5 text-indigo-600 shrink-0 ml-2" />
            <input
              type="text"
              value={topicQuery}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search topics, research papers (e.g. 'Transformers')..."
              className="w-full bg-transparent text-base text-gray-900 font-medium outline-none placeholder:text-gray-400"
            />
            <kbd 
              onClick={onOpenSearch}
              className="hidden sm:inline-flex items-center gap-1 font-semibold text-xs text-gray-400 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded border border-gray-300 cursor-pointer shrink-0 transition-colors"
              title="Open Spotlight Search"
            >
              Cmd + K
            </kbd>
            <Button type="submit" variant="primary" size="md" className="shrink-0">
              Search →
            </Button>
          </div>
        </form>

        {/* Popular Topic Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider mr-2">Popular:</span>
          {popularTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => onSelectTopic(topic)}
              className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-transparent text-xs font-medium text-gray-600 transition-all cursor-pointer"
            >
              {topic}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
