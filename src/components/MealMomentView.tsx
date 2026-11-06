import React from 'react';
import { useApp } from '../context/AppContext';
import { COOKING_EFFORT_OPTIONS } from '../data/kitchenAppliances';
import { CookingEffort } from '../types';
import { Check, ArrowRight, Disc, Sparkles, ChefHat } from 'lucide-react';

export const MealMomentView: React.FC = () => {
  const {
    cookingEffort,
    setCookingEffort,
    setActiveView,
    generateRecipesForEffortFlow,
    isLoading,
    pantryIngredients,
  } = useApp();

  const handleSelectEffort = (effort: CookingEffort) => {
    setCookingEffort(effort);
  };

  const handleProceedToWheel = async () => {
    try {
      await generateRecipesForEffortFlow(cookingEffort);
      setActiveView('wheel');
    } catch (err: any) {
      alert(err.message || 'Erro ao preparar receitas');
    }
  };

  return (
    <div className="space-y-6 pb-3 max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-black uppercase tracking-wider">
          <ChefHat className="w-3.5 h-3.5" />
          <span>Passo 2 • Nível de Esforço</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-stone-900 font-['Outfit']">
          Como você quer cozinhar hoje?
        </h1>

        <p className="text-sm sm:text-base text-stone-600 max-w-md mx-auto font-medium">
          Você escolhe quanto tempo e energia quer gastar. O GuessFood encontra as receitas ideais com o que você tem.
        </p>
      </div>

      {/* 3 Visual Effort Cards per Section 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {COOKING_EFFORT_OPTIONS.map(opt => {
          const isSelected = cookingEffort === opt.id;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelectEffort(opt.id)}
              className={`p-6 rounded-3xl border-2 transition-all relative flex flex-col justify-between text-left group active:scale-[0.98] cursor-pointer ${
                isSelected
                  ? 'bg-amber-50/80 border-orange-500 shadow-xl shadow-orange-500/15 ring-4 ring-orange-200'
                  : 'bg-white border-stone-200/80 hover:border-stone-300 hover:bg-stone-50/50 shadow-sm'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-4xl group-hover:scale-110 transition-transform">
                    {opt.icon}
                  </span>

                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isSelected
                        ? 'bg-orange-500 border-orange-500 text-white'
                        : 'border-stone-300 text-transparent'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-xl text-stone-900 font-['Outfit']">
                      {opt.title}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                      {opt.badge}
                    </span>
                  </div>

                  <p className="text-sm font-extrabold text-orange-600 mt-1">
                    &ldquo;{opt.tagline}&rdquo;
                  </p>

                  <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                    {opt.description}
                  </p>
                </div>
              </div>

              {isSelected && (
                <div className="mt-4 pt-3 border-t border-orange-200 text-[11px] font-bold text-orange-800 flex items-center gap-1">
                  <span>✓ Opção selecionada</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Advance CTA */}
      <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-black text-stone-900 text-base">
            Estilo definido: {cookingEffort.toUpperCase()}
          </h4>
          <p className="text-xs text-stone-500">
            A Roleta da Fome vai girar entre as melhores receitas desse estilo!
          </p>
        </div>

        <button
          onClick={handleProceedToWheel}
          disabled={isLoading || pantryIngredients.length === 0}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 hover:brightness-110 active:scale-95 text-white font-black text-base shadow-xl shadow-orange-500/25 flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50"
        >
          <Disc className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Buscando opções...' : 'IR PARA A ROLETA DE RECEITAS'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
