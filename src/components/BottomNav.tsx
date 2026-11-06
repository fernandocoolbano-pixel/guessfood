import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  ChefHat,
  UtensilsCrossed,
  Sparkles,
  GlassWater,
  Heart,
  User,
  PartyPopper,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeView, setActiveView, pantryIngredients, selectedApplianceIds } = useApp();

  const navItems = [
    {
      id: 'home' as const,
      label: 'Início',
      icon: Home,
    },
    {
      id: 'kitchen' as const,
      label: 'Cozinha',
      icon: ChefHat,
      badge: selectedApplianceIds.length,
    },
    {
      id: 'ingredients' as const,
      label: 'O que Comer',
      icon: UtensilsCrossed,
      highlight: true,
      badge: pantryIngredients.length,
    },
    {
      id: 'occasions' as const,
      label: 'Ocasiões',
      icon: PartyPopper,
    },
    {
      id: 'drinks' as const,
      label: 'Drinks',
      icon: GlassWater,
    },
    {
      id: 'profile' as const,
      label: 'Perfil',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-amber-100 shadow-lg px-2 pb-safe-area">
      <div className="max-w-lg mx-auto flex items-center justify-around py-1.5">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive =
            activeView === item.id ||
            (item.id === 'ingredients' && (activeView === 'meal-moment' || activeView === 'wheel' || activeView === 'recipe'));

          if (item.highlight) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className="flex flex-col items-center justify-center -mt-5 relative group active:scale-95 transition-transform"
                title="O que comer hoje?"
              >
                <div
                  className={`w-13 h-13 rounded-full flex items-center justify-center shadow-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-tr from-orange-600 via-rose-500 to-amber-500 text-white ring-4 ring-orange-200'
                      : 'bg-gradient-to-tr from-orange-500 to-amber-400 text-white shadow-orange-500/30'
                  }`}
                >
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
                <span
                  className={`text-[10px] font-black mt-1 ${
                    isActive ? 'text-orange-600' : 'text-stone-700'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 relative transition-colors ${
                isActive ? 'text-orange-600' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-amber-500 text-white text-[9px] font-black flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
