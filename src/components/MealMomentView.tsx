import React from 'react';
import { useApp } from '../context/AppContext';
import { MEAL_MOMENTS } from '../data/kitchenAppliances';
import { MealMomentId } from '../types';
import { Check, ArrowRight, Disc, Sparkles } from 'lucide-react';

export const MealMomentView: React.FC = () => {
  const { mealMoment, setMealMoment, setActiveView, generateRecipesFlow, isLoading } = useApp();

  const handleSelectMoment = (id: MealMomentId) => {
    setMealMoment(id);
  };

  const handleProceedToWheel = async () => {
    try {
      await generateRecipesFlow();
      setActiveView('wheel');
    } catch (err: any) {
      alert(err.message || 'Erro ao preparar receitas');
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Passo 2 do Planejador</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-stone-900 font-['Outfit']">
          🍽️ O que você quer preparar?
        </h1>

        <p className="text-sm text-stone-600 max-w-xl">
          Escolha o momento ou deixe que o GuessFood analise seus ingredientes e defina a melhor pedida para você.
        </p>
      </div>

      {/* Hero Option: "Não sei. Decide por mim." */}
      {(() => {
        const decidePorMim = MEAL_MOMENTS.find(m => m.id === 'decide_por_mim');
        if (!decidePorMim) return null;
        const isSelected = mealMoment === 'decide_por_mim';

        return (
          <button
            key={decidePorMim.id}
            type="button"
            onClick={() => handleSelectMoment('decide_por_mim')}
            className={`w-full text-left p-6 rounded-3xl border-2 transition-all relative overflow-hidden group active:scale-[0.99] ${
              isSelected
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white border-transparent shadow-xl shadow-orange-500/25 ring-4 ring-orange-200'
                : 'bg-white hover:bg-stone-50 border-orange-200 text-stone-800 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-md ${
                    isSelected ? 'bg-white/20' : 'bg-orange-50 text-orange-600'
                  }`}
                >
                  {decidePorMim.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white">
                      Recomendado
                    </span>
                    <h3 className={`text-xl sm:text-2xl font-black font-['Outfit'] ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                      {decidePorMim.title}
                    </h3>
                  </div>
                  <p className={`text-xs sm:text-sm mt-1 ${isSelected ? 'text-amber-100' : 'text-stone-500'}`}>
                    O sistema assume o protagonismo total da decisão culinária!
                  </p>
                </div>
              </div>

              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 ${
                  isSelected
                    ? 'bg-white text-orange-600 border-white shadow-md'
                    : 'border-stone-300 text-transparent'
                }`}
              >
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
            </div>
          </button>
        );
      })()}

      {/* Grid of Other Meal Moments */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {MEAL_MOMENTS.filter(m => m.id !== 'decide_por_mim').map(moment => {
          const isSelected = mealMoment === moment.id;

          return (
            <button
              key={moment.id}
              type="button"
              onClick={() => handleSelectMoment(moment.id)}
              className={`text-left p-5 rounded-2xl border-2 transition-all relative flex flex-col justify-between group active:scale-[0.98] ${
                isSelected
                  ? 'bg-amber-50 border-orange-500 shadow-md shadow-orange-500/10'
                  : 'bg-white border-stone-200/80 hover:border-stone-300 hover:bg-stone-50/50'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-3xl group-hover:scale-110 transition-transform">
                  {moment.icon}
                </span>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                    isSelected
                      ? 'bg-orange-500 border-orange-600 text-white'
                      : 'border-stone-300 bg-stone-100 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              <div className="mt-4">
                <h3 className={`font-black text-base ${isSelected ? 'text-stone-900' : 'text-stone-700'}`}>
                  {moment.title}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                  {moment.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Proceed CTA */}
      <div className="bg-white rounded-3xl p-5 border border-amber-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-stone-900 text-sm">
            Próximo passo: A Roleta da Fome 🎡
          </h4>
          <p className="text-xs text-stone-500">
            Vamos selecionar opções seguras, saborosas e viáveis para a sua cozinha.
          </p>
        </div>

        <button
          onClick={handleProceedToWheel}
          disabled={isLoading}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 hover:brightness-110 active:scale-95 text-white font-black text-base shadow-xl shadow-orange-500/25 flex items-center justify-center gap-3 transition-all"
        >
          <Disc className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Analisando geladeira...' : 'GIRAR A ROLETA DA FOME'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
