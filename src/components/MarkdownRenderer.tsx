import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Basic regex parser to handle code blocks, bold, headers, and lists cleanly
  const renderFormattedText = () => {
    if (!content) return null;

    // Split by triple backticks for code blocks
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, partIdx) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const language = lines[0].match(/^[a-z0-9_-]+$/i) ? lines[0] : '';
        const code = language ? lines.slice(1).join('\n') : lines.join('\n');

        return (
          <div key={partIdx} className="my-3 overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/90 shadow-lg text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-2 text-xs font-mono text-slate-400">
              <span className="font-semibold uppercase text-indigo-400">{language || 'code'}</span>
              <button
                onClick={() => handleCopyCode(code, partIdx)}
                className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs hover:bg-slate-800 text-slate-300 hover:text-white transition"
              >
                {copiedIndex === partIdx ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy code</span>
                  </>
                )}
              </button>
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-slate-200">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // Normal text with headers, bullet points, and bold formatting
      const lines = part.split('\n');
      return (
        <div key={partIdx} className="space-y-1.5 leading-relaxed text-inherit">
          {lines.map((line, lineIdx) => {
            const trimmed = line.trim();
            if (!trimmed) {
              return <div key={lineIdx} className="h-2" />;
            }

            // Headers
            if (trimmed.startsWith('### ')) {
              return (
                <h4 key={lineIdx} className="text-base font-bold text-indigo-400 dark:text-indigo-300 pt-2 pb-1">
                  {parseInlineFormatting(trimmed.slice(4))}
                </h4>
              );
            }
            if (trimmed.startsWith('## ')) {
              return (
                <h3 key={lineIdx} className="text-lg font-bold text-indigo-500 dark:text-indigo-200 pt-3 pb-1 border-b border-slate-700/40">
                  {parseInlineFormatting(trimmed.slice(3))}
                </h3>
              );
            }
            if (trimmed.startsWith('# ')) {
              return (
                <h2 key={lineIdx} className="text-xl font-extrabold text-indigo-600 dark:text-indigo-100 pt-3 pb-1">
                  {parseInlineFormatting(trimmed.slice(2))}
                </h2>
              );
            }

            // Bullet points
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
              return (
                <div key={lineIdx} className="flex items-start gap-2 pl-2">
                  <span className="text-indigo-400 text-sm mt-1">•</span>
                  <div className="flex-1">{parseInlineFormatting(trimmed.slice(2))}</div>
                </div>
              );
            }

            // Numbered list (e.g. 1. )
            const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
            if (numMatch) {
              return (
                <div key={lineIdx} className="flex items-start gap-2 pl-2">
                  <span className="font-semibold text-indigo-400 text-xs mt-1 w-4 shrink-0">{numMatch[1]}.</span>
                  <div className="flex-1">{parseInlineFormatting(numMatch[2])}</div>
                </div>
              );
            }

            return <p key={lineIdx}>{parseInlineFormatting(line)}</p>;
          })}
        </div>
      );
    });
  };

  // Helper for inline bold, italic, and inline code
  const parseInlineFormatting = (text: string): React.ReactNode => {
    // Split by inline code `...`
    const segments = text.split(/(`[^`]+`)/g);

    return segments.map((seg, idx) => {
      if (seg.startsWith('`') && seg.endsWith('`')) {
        return (
          <code key={idx} className="rounded bg-slate-800/80 px-1.5 py-0.5 font-mono text-xs text-pink-400">
            {seg.slice(1, -1)}
          </code>
        );
      }

      // Handle bold **text**
      const boldParts = seg.split(/(\*\*[^*]+\*\*)/g);
      return boldParts.map((bPart, bIdx) => {
        if (bPart.startsWith('**') && bPart.endsWith('**')) {
          return (
            <strong key={`${idx}-${bIdx}`} className="font-semibold text-slate-100">
              {bPart.slice(2, -2)}
            </strong>
          );
        }
        return bPart;
      });
    });
  };

  return <div className="markdown-content">{renderFormattedText()}</div>;
};
