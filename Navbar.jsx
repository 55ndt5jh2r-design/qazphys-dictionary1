import React from 'react';
import { Atom, BookOpen, BrainCircuit, Bookmark } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, savedCount, totalCount }) {
  const navItems = [
    { id: 'dictionary', label: 'Сөздік', icon: BookOpen, badge: totalCount },
    { id: 'flashcards', label: 'Флеш-карталар', icon: BrainCircuit },
    { id: 'saved', label: 'Таңдаулылар', icon: Bookmark, badge: savedCount },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <div 
          onClick={() => setActiveTab('dictionary')}
          className="flex cursor-pointer items-center gap-3 group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 transition-transform group-hover:scale-105">
            <Atom className="h-6 w-6 animate-spin-slow" style={{ animationDuration: '12s' }} />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">
              QAZPHYS <span className="text-cyan-400">DICTIONARY</span>
            </h1>
            <p className="text-xs text-slate-400">Қазақша · Русский · English</p>
          </div>
        </div>

        <nav className="flex items-center gap-1.5 rounded-xl bg-slate-900/90 p-1 border border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`ml-0.5 rounded-full px-2 py-0.5 text-xs font-bold ${
                      isActive
                        ? 'bg-slate-950/20 text-slate-950'
                        : 'bg-slate-800 text-cyan-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
