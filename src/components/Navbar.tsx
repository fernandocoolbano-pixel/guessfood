import React from 'react';
import { useApp } from '../context/AppContext';
import { ChefHat, Sparkles, Zap, Flame, UtensilsCrossed } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    selectedApplianceIds,
    isLifetime,
    setIsUpgradeModalOpen,
    setIsDecideForMeModalOpen,
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xs">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <button
          onClick={() => setActiveView('home')}
          className="flex items-center gap-2 sm:gap-2.5 text-left group transition-transform active:scale-95 shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:rotate-6 transition-transform shrink-0">
            <span className="text-lg sm:text-xl">🍽️</span>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-stone-900 font-['Outfit'] leading-none">
                Guess<span className="text-orange-600">Food</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase tracking-wider whitespace-nowrap">
                Roleta da Fome
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-stone-500 font-medium leading-tight mt-0.5">
              Menos dúvida. Mais comida.
            </p>
          </div>
        </button>

        {/* Center / Right actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* My Kitchen Status Pill */}
          <button
            onClick={() => setActiveView('kitchen')}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all shrink-0 ${
              activeView === 'kitchen'
                ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-xs'
                : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
            }`}
          >
            <span>🔌</span>
            <span>Minha Cozinha</span>
            <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold">
              {selectedApplianceIds.length}
            </span>
          </button>

          {/* Special "Estou com fome!" Quick Action */}
          <button
            onClick={() => setIsDecideForMeModalOpen(true)}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 text-white text-xs font-bold shadow-md shadow-rose-500/25 hover:shadow-lg hover:shadow-rose-500/35 transition-all transform active:scale-95 shrink-0 whitespace-nowrap cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current shrink-0" />
            <span className="font-black tracking-tight">Estou com Fome!</span>
          </button>

          {/* Membership Badge */}
          {isLifetime ? (
            <button
              onClick={() => setActiveView('profile')}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold shrink-0"
              title="Acesso Vitalício Ativo"
            >
              <span>👑</span>
              <span className="hidden sm:inline">Vitalício</span>
            </button>
          ) : (
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-900 border border-amber-300 text-xs font-bold hover:brightness-105 transition-all shadow-xs shrink-0"
            >
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>R$ 11,90 Vitalício</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
