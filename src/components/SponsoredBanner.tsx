import React, { useState } from 'react';
import { ShoppingBag, Sparkles, X, ExternalLink } from 'lucide-react';

export const SponsoredBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-emerald-500/10 border border-orange-200/80 rounded-2xl p-3 sm:px-4 sm:py-2.5 flex items-center justify-between gap-3 text-stone-800 text-xs shadow-2xs">
      <div className="flex items-center gap-2.5 overflow-hidden">
        <span className="text-[10px] font-black uppercase tracking-wider bg-orange-200/80 text-orange-950 px-2 py-0.5 rounded-md shrink-0">
          Patrocinado
        </span>
        <div className="flex items-center gap-1.5 truncate font-medium">
          <span className="text-sm shrink-0">🥦</span>
          <span className="truncate">
            <strong>Hortifruti & Mercado Express:</strong> Ingredientes frescos e temperos entregues em 30 min para sua receita.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => {
            alert('Parceiro Comercial: Em breve integração direta com entrega de ingredientes!');
          }}
          className="text-[11px] font-extrabold text-orange-700 hover:text-orange-900 underline flex items-center gap-1"
        >
          <span>Conhecer</span>
          <ExternalLink className="w-3 h-3" />
        </button>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 text-stone-400 hover:text-stone-600 rounded-lg"
          title="Fechar"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
