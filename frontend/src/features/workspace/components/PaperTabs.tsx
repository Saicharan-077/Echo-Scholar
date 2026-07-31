import React from 'react';
import { Button } from '../../../shared/ui/Button';

export interface PaperTabsProps {
  papers: { id: string; title: string }[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export const PaperTabs: React.FC<PaperTabsProps> = ({ papers, activeIndex, onSelect }) => {
  return (
    <div className="hidden md:flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl border border-gray-200">
      {papers.map((paper, idx) => (
        <Button
          key={paper.id}
          variant={activeIndex === idx ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => onSelect(idx)}
          className={activeIndex === idx ? 'shadow-xs' : 'border-none hover:bg-white text-gray-600'}
        >
          {paper.title}
        </Button>
      ))}
    </div>
  );
};
