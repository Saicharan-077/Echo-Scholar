import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-1.5 text-xs font-semibold select-none ${className}`}>
      <Link
        to="/"
        className="text-gray-400 hover:text-indigo-600 transition-colors flex items-center gap-1 p-1 rounded-md hover:bg-gray-100/60"
        title="Home"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
            
            {item.href && !isLast ? (
              <Link
                to={item.href}
                className="text-gray-500 hover:text-indigo-600 transition-colors px-1.5 py-0.5 rounded-md hover:bg-gray-100/60 line-clamp-1 max-w-[140px] sm:max-w-[200px]"
              >
                {item.label}
              </Link>
            ) : (
              <span className={`px-1.5 py-0.5 rounded-md line-clamp-1 max-w-[160px] sm:max-w-[260px] ${
                isLast ? 'text-gray-900 font-bold bg-indigo-50/70 border border-indigo-100' : 'text-gray-600'
              }`}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
