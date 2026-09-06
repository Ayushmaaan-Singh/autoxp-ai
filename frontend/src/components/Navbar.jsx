import React from 'react';

export default function Navbar({ page, setPage, onLogout }) {
  const LINKS = [
    { id:'buy', label:'Buy Car' },
    { id:'predict', label:'AI Predict' },
    { id:'enlist', label:'Enlist Car' },
    { id:'profile', label:'Profile' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 border-l-0 border-r-0 rounded-none bg-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        <button onClick={() => setPage('buy')} className="flex items-center gap-2 group">
          <span className="font-serif text-2xl font-bold tracking-tight text-white group-hover:text-lux transition-colors">
            AUTO<span className="text-lux">XP</span>
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 border-l border-gray-700 pl-2 ml-1">
            Marketplace
          </span>
        </button>
        <div className="hidden md:flex items-center gap-6">
          {LINKS.map(l => (
            <button key={l.id} onClick={() => setPage(l.id)}
              className={`text-sm font-serif tracking-wide transition-colors ${page === l.id ? 'text-lux border-b border-lux pb-1' : 'text-gray-300 hover:text-white'}`}>
              {l.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 mr-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-xs font-medium tracking-widest text-gray-300 uppercase">AI Online</span>
          </div>
          <button onClick={() => setPage('enlist')} className="btn-gold px-6 py-2.5 rounded-md text-sm tracking-wide font-serif">
            Sell Your Car
          </button>
          <button onClick={onLogout} className="btn-outline px-4 py-2.5 rounded-md text-sm tracking-wide font-serif border-gray-700 text-gray-400 hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/10">
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
