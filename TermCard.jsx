import React from 'react';
import { Bookmark, Sparkles, Copy, Check } from 'lucide-react';

export default function TermCard({ term, isSaved, onToggleSave, onSelectTerm }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${term.kk} (${term.ru} / ${term.en}) — ${term.formula} [${term.unit}]`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      onClick={() => onSelectTerm(term)}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-cyan-500/50 hover:bg-slate-900 hover:shadow-xl hover:shadow-cyan-950/30 cursor-pointer"
    >
      <div>
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-md bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
            {term.category}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              title="Көшіру"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-cyan-400 transition-colors"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(term.id);
              }}
              title={isSaved ? 'Таңдаулылардан өшіру' : 'Сақтау'}
              className={`rounded-lg p-1.5 transition-colors ${
                isSaved
                  ? 'bg-amber-500/10 text-amber-400'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-amber-400'
              }`}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
          {term.kk}
        </h3>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
          <span className="font-medium text-slate-300">RU: {term.ru}</span>
          <span>•</span>
          <span className="font-medium text-blue-300">EN: {term.en}</span>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-300">
          {term.definition}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-800/80 pt-3.5">
        <div className="flex items-center gap-2">
          <code className="rounded-lg bg-slate-950 px-2.5 py-1 font-mono text-xs font-semibold text-cyan-300 border border-slate-800">
            {term.formula}
          </code>
          <span className="rounded-md bg-slate-800/80 px-2 py-0.5 font-mono text-xs text-slate-300">
            {term.unit}
          </span>
        </div>

        <span className="inline-flex items-center gap-1 text-xs font-medium text-cyan-400 opacity-80 group-hover:opacity-100">
          <Sparkles className="h-3.5 w-3.5" />
          Толығырақ
        </span>
      </div>
    </div>
  );
}
