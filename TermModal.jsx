import React, { useState, useEffect } from 'react';
import { X, Sparkles, Bookmark, Volume2, Loader2 } from 'lucide-react';

export default function TermModal({ term, onClose, isSaved, onToggleSave }) {
  const [aiExplanation, setAiExplanation] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    setAiExplanation('');
    setLoadingAi(false);
  }, [term]);

  if (!term) return null;

  const speakText = (text, lang) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAskAI = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ term: term.kk }),
      });
      const data = await res.json();
      setAiExplanation(data.explanation || 'Түсіндірме дайын емес.');
    } catch {
      setAiExplanation(
        `«${term.kk}» — ${term.category} бөлімінің негізгі ұғымы. Формуласы: ${term.formula}, ХБЖ өлшем бірлігі: ${term.unit}. ҰБТ есептерінде шамаларды СИ жүйесіне айналдыруды ұмытпаңыз!`
      );
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-3xl border border-slate-700/80 bg-slate-900 p-6 sm:p-8 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-block rounded-lg bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
              {term.category} · №{term.id}
            </span>
            <h2 className="mt-2.5 text-2xl font-extrabold text-white sm:text-3xl">
              {term.kk}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(term.id)}
              className={`rounded-xl border p-2.5 transition-colors ${
                isSaved
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                  : 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-amber-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Үштілді аударма блогы */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Орысша</span>
              <p className="mt-0.5 font-semibold text-slate-200">{term.ru}</p>
            </div>
            <button
              onClick={() => speakText(term.ru, 'ru-RU')}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-cyan-400"
              title="Тыңдау"
            >
              <Volume2 className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">English</span>
              <p className="mt-0.5 font-semibold text-blue-300">{term.en}</p>
            </div>
            <button
              onClick={() => speakText(term.en, 'en-US')}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-cyan-400"
              title="Listen"
            >
              <Volume2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Анықтама */}
        <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Физикалық мағынасы
          </h4>
          <p className="mt-2 text-base leading-relaxed text-slate-200">
            {term.definition}
          </p>
        </div>

        {/* Формула және ХБЖ */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-4">
            <span className="text-xs font-medium text-cyan-400">Негізгі формула</span>
            <p className="mt-1 font-mono text-lg font-bold text-white">{term.formula}</p>
          </div>
          <div className="rounded-2xl border border-blue-500/20 bg-blue-950/20 p-4">
            <span className="text-xs font-medium text-blue-400">ХБЖ (СИ) өлшем бірлігі</span>
            <p className="mt-1 font-mono text-lg font-bold text-white">{term.unit}</p>
          </div>
        </div>

        {/* AI Көмекші */}
        <div className="mt-6">
          {!aiExplanation ? (
            <button
              onClick={handleAskAI}
              disabled={loadingAi}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:opacity-95 disabled:opacity-60"
            >
              {loadingAi ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  AI талдау жасауда...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  AI Репетитор: ҰБТ-ға арналған қарапайым түсіндірме алу
                </>
              )}
            </button>
          ) : (
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
                <Sparkles className="h-4 w-4" />
                AI Репетитор кеңесі
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">{aiExplanation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
