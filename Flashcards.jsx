import React, { useState } from 'react';
import { RotateCw, ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';

export default function Flashcards({ terms }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shuffledTerms, setShuffledTerms] = useState(terms);

  const current = shuffledTerms[index] || terms[0];

  const handleNext = () => {
    setFlipped(false);
    setIndex((prev) => (prev + 1) % shuffledTerms.length);
  };

  const handlePrev = () => {
    setFlipped(false);
    setIndex((prev) => (prev - 1 + shuffledTerms.length) % shuffledTerms.length);
  };

  const handleShuffle = () => {
    setFlipped(false);
    const copy = [...terms].sort(() => Math.random() - 0.5);
    setShuffledTerms(copy);
    setIndex(0);
  };

  return (
    <div className="mx-auto max-w-2xl py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Интерактивті Флеш-карталар</h2>
          <p className="text-sm text-slate-400">Картаны басып аудармасы мен формуласын тексеріңіз</p>
        </div>
        <button
          onClick={handleShuffle}
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-cyan-400 hover:bg-slate-800"
        >
          <Shuffle className="h-4 w-4" />
          Араластыру
        </button>
      </div>

      {/* Card */}
      <div
        onClick={() => setFlipped(!flipped)}
        className="flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 text-center shadow-2xl transition-all hover:border-cyan-500/40"
      >
        <span className="mb-4 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
          {current.category} • {index + 1} / {shuffledTerms.length}
        </span>

        {!flipped ? (
          <>
            <h3 className="text-3xl font-extrabold text-white sm:text-4xl">{current.kk}</h3>
            <p className="mt-6 flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <RotateCw className="h-3.5 w-3.5" /> Жауабын көру үшін басыңыз
            </p>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold">
              <span className="rounded-lg bg-slate-800 px-3 py-1 text-slate-200">RU: {current.ru}</span>
              <span className="rounded-lg bg-slate-800 px-3 py-1 text-blue-300">EN: {current.en}</span>
            </div>
            <p className="text-base leading-relaxed text-slate-300">{current.definition}</p>
            <div className="pt-2">
              <code className="rounded-xl border border-cyan-500/30 bg-cyan-950/30 px-4 py-2 font-mono text-lg font-bold text-cyan-300">
                {current.formula} ({current.unit})
              </code>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={handlePrev}
          className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800"
        >
          <ChevronLeft className="h-4 w-4" /> Алдыңғы
        </button>
        <button
          onClick={handleNext}
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-400"
        >
          Келесі <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
