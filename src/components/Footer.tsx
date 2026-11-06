import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-3 pt-3.5 pb-20 sm:pb-8 text-center border-t border-amber-100/70 max-w-5xl mx-auto w-full px-4 select-none">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 text-xs text-stone-500 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">🍽️</span>
          <span className="font-extrabold text-stone-800 font-['Outfit']">GuessFood</span>
          <span className="text-stone-300 hidden sm:inline">•</span>
        </div>
        <p className="flex items-center gap-1.5 flex-wrap justify-center">
          <span>Orgulhosamente desenvolvido por</span>
          <span className="font-extrabold text-amber-950 bg-gradient-to-r from-amber-100 to-orange-100 px-2.5 py-0.5 rounded-full border border-amber-200/80 shadow-2xs">
            Rafaela Mell &amp; F. Texxx
          </span>
        </p>
      </div>
      <p className="text-[11px] text-stone-400 mt-1.5 font-medium">
        Menos dúvida. Mais comida. Feito com carinho para a sua cozinha.
      </p>
    </footer>
  );
};
