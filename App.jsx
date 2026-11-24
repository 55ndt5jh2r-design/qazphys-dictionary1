import React, { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, Sparkles, BookMarked } from 'lucide-react';
import { PHYSICS_TERMS, CATEGORIES } from './terms.js';
import Navbar from './Navbar.jsx';
import TermCard from './TermCard.jsx';
import TermModal from './TermModal.jsx';
import Flashcards from './Flashcards.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('dictionary');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Барлығы');
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('qazphys_saved');
      return saved ? JSON.parse(saved) : [1, 18, 22];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('qazphys_saved', JSON.stringify(savedIds));
  }, [savedIds]);

  const toggleSave = (id) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredTerms = useMemo(() => {
    return PHYSICS_TERMS.filter((term) => {
      if (activeTab === 'saved' && !savedIds.includes(term.id)) return false;
      if (selectedCategory !== 'Барлығы' && term.category !== selectedCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        term.kk.toLowerCase().includes(q) ||
        term.ru.toLowerCase().includes(q) ||
        term.en.toLowerCase().includes(q) ||
        term.formula.toLowerCase().includes(q) ||
        term.definition.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedCategory, activeTab, savedIds]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedIds.length}
        totalCount={PHYSICS_TERMS.length}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        {activeTab === 'flashcards' ? (
          <Flashcards terms={PHYSICS_TERMS} />
        ) : (
          <>
            {/* Hero & Search */}
            <section className="mb-8 rounded-3xl border border-slate-800/80 bg-slate-900/50 p-6 sm:p-8 backdrop-blur-md">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  ҰБТ және Олимпиадаға дайындық базасы · {PHYSICS_TERMS.length} термин
                </div>
                <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
                  {activeTab === 'saved'
                    ? 'Сақталған таңдаулы терминдер'
                    : 'Физика терминдерінің үштілді интерактивті сөздігі'}
                </h2>
                <p className="mt-2 text-sm text-slate-400 sm:text-base">
                  Қазақша, орысша немесе ағылшынша атауы, формуласы бойынша жылдам іздеңіз.
                </p>
              </div>

              {/* Search Bar */}
              <div className="mt-6 relative max-w-2xl">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Мысалы: Импульс, Momentum, Ом заңы, F = ma..."
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-500 shadow-inner focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>

              {/* Category Filters */}
              <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-1">
                <SlidersHorizontal className="mr-1 h-4 w-4 shrink-0 text-slate-400" />
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                      selectedCategory === category
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                        : 'border border-slate-800 bg-slate-950/70 text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </section>

            {/* Terms Grid */}
            {filteredTerms.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 py-16 text-center">
                <BookMarked className="h-12 w-12 text-slate-600" />
                <h3 className="mt-4 text-lg font-bold text-slate-300">Терминдер табылмады</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Іздеу сөзін өзгертіп көріңіз немесе барлық бөлімдерді таңдаңыз.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTerms.map((term) => (
                  <TermCard
                    key={term.id}
                    term={term}
                    isSaved={savedIds.includes(term.id)}
                    onToggleSave={toggleSave}
                    onSelectTerm={setSelectedTerm}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        QAZPHYS DICTIONARY © {new Date().getFullYear()} · Қазақша физика білім беру платформасы
      </footer>

      <TermModal
        term={selectedTerm}
        onClose={() => setSelectedTerm(null)}
        isSaved={selectedTerm ? savedIds.includes(selectedTerm.id) : false}
        onToggleSave={toggleSave}
      />
    </div>
  );
}
