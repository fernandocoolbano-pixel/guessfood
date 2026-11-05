import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Crown,
  Sparkles,
  ChefHat,
  Heart,
  Clock,
  ShieldCheck,
  Settings,
  Flame,
  Check,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    isLifetime,
    setIsUpgradeModalOpen,
    stats,
    pantryIngredients,
    selectedApplianceIds,
    setActiveView,
  } = useApp();

  const [dietary, setDietary] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('guessfood_dietary');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const toggleDietary = (item: string) => {
    setDietary(prev => {
      const next = prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item];
      localStorage.setItem('guessfood_dietary', JSON.stringify(next));
      return next;
    });
  };

  const dietaryOptions = [
    '🥗 Vegetariano',
    '🌱 Vegano',
    '🧀 Sem Lactose',
    '🌾 Sem Glúten',
    '🥑 Low Carb',
    '🌶️ Pouco Apimentado',
  ];

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-4xl shadow-xl shadow-orange-500/20">
            🍳
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-stone-900 font-['Outfit']">
                Seu Perfil Culinário
              </h1>
              {isLifetime && (
                <span className="text-[11px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                  <span>👑</span>
                  <span>Vitalício</span>
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              GuessFood v1.0 • O exterminador da indecisão culinária
            </p>
          </div>
        </div>

        {/* Plan Upgrade Trigger */}
        {!isLifetime ? (
          <button
            onClick={() => setIsUpgradeModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-105 active:scale-95 text-white font-black text-xs sm:text-sm shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Crown className="w-4 h-4 text-yellow-200" />
            <span>Assinar Vitalício (R$ 11,90)</span>
          </button>
        ) : (
          <div className="px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Acesso Vitalício Garantido</span>
          </div>
        )}
      </div>

      {/* Stats Counter */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-amber-100 text-center shadow-xs">
          <span className="text-2xl sm:text-3xl font-black text-orange-600 font-['Outfit'] block">
            {stats.recipesDecided}
          </span>
          <span className="text-[11px] sm:text-xs font-bold text-stone-600 mt-1 block">
            Decisões Tomadas
          </span>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-amber-100 text-center shadow-xs">
          <span className="text-2xl sm:text-3xl font-black text-emerald-600 font-['Outfit'] block">
            {stats.recipesCooked}
          </span>
          <span className="text-[11px] sm:text-xs font-bold text-stone-600 mt-1 block">
            Pratos Cozinhados
          </span>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-amber-100 text-center shadow-xs">
          <span className="text-2xl sm:text-3xl font-black text-rose-600 font-['Outfit'] block">
            {stats.totalFavorites}
          </span>
          <span className="text-[11px] sm:text-xs font-bold text-stone-600 mt-1 block">
            Receitas Favoritas
          </span>
        </div>
      </div>

      {/* Dietary Restrictions Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-stone-900 font-['Outfit']">
            Preferências e Restrições Alimentares
          </h2>
          <p className="text-xs text-stone-500">
            Selecione para calibrar as sugestões da inteligência artificial:
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {dietaryOptions.map(opt => {
            const isSelected = dietary.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggleDietary(opt)}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-amber-100/70 border-orange-400 text-orange-950 shadow-2xs'
                    : 'bg-stone-50 border-stone-200/80 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>{opt}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-orange-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Kitchen & Pantry Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          onClick={() => setActiveView('kitchen')}
          className="p-5 rounded-3xl bg-white border border-amber-100 shadow-sm hover:border-orange-300 transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl">🔌</span>
            <span className="text-xs font-bold text-orange-600">Configurar</span>
          </div>
          <h3 className="font-black text-base text-stone-900">Minha Cozinha</h3>
          <p className="text-xs text-stone-500">
            {selectedApplianceIds.length} aparelhos ativos no seu perfil.
          </p>
        </div>

        <div
          onClick={() => setActiveView('ingredients')}
          className="p-5 rounded-3xl bg-white border border-amber-100 shadow-sm hover:border-orange-300 transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl">🧺</span>
            <span className="text-xs font-bold text-orange-600">Editar</span>
          </div>
          <h3 className="font-black text-base text-stone-900">Despensa Atual</h3>
          <p className="text-xs text-stone-500">
            {pantryIngredients.length} ingredientes salvos na geladeira.
          </p>
        </div>
      </div>
    </div>
  );
};
