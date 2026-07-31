import React from 'react';

export interface FormattedChatMessageProps {
  text: string;
  className?: string;
}

export const FormattedChatMessage: React.FC<FormattedChatMessageProps> = ({ text, className = '' }) => {
  if (!text) return null;

  // Split lines to handle headings and lists cleanly
  const lines = text.split('\n');

  return (
    <div className={`space-y-1.5 leading-relaxed text-xs ${className}`}>
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={lineIdx} className="h-1" />;

        // Headers
        if (trimmed.startsWith('#')) {
          const headerText = trimmed.replace(/^#+\s*/, '');
          return (
            <h4 key={lineIdx} className="font-extrabold text-sm text-gray-900 mt-2 mb-1 tracking-tight">
              {parseInlineMarkdown(headerText)}
            </h4>
          );
        }

        // Bullet points
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const bulletText = trimmed.substring(2);
          return (
            <div key={lineIdx} className="flex items-start gap-2 ml-1 my-0.5">
              <span className="text-indigo-600 font-bold shrink-0 mt-0.5">•</span>
              <span className="text-gray-800">{parseInlineMarkdown(bulletText)}</span>
            </div>
          );
        }

        // Regular paragraph
        return (
          <p key={lineIdx} className="text-gray-800">
            {parseInlineMarkdown(line)}
          </p>
        );
      })}
    </div>
  );
};

// Helper function to convert **bold**, *italic*, and `code` inline markdown strings to React nodes
function parseInlineMarkdown(input: string): React.ReactNode[] {
  // Regex splitting by **bold**, *italic*, or `code`
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  const parts = input.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    // **Bold**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={index} className="font-extrabold text-gray-900">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // *Italic*
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <em key={index} className="italic text-gray-800">
          {part.slice(1, -1)}
        </em>
      );
    }

    // `Code`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code key={index} className="bg-indigo-50 text-indigo-900 font-mono text-[11px] px-1.5 py-0.5 rounded border border-indigo-200">
          {part.slice(1, -1)}
        </code>
      );
    }

    return <span key={index}>{part}</span>;
  });
}
