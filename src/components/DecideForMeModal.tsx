import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Recipe } from '../types';
import confetti from 'canvas-confetti';
import { playCelebrationSound } from '../utils/audio';
import {
  X,
  Zap,
  Clock,
  ChefHat,
  Users,
  CheckCircle2,
  ArrowRight,
  Disc,
  Sparkles,
} from 'lucide-react';

export const DecideForMeModal: React.FC = () => {
  const {
    isDecideForMeModalOpen,
    setIsDecideForMeModalOpen,
    decideForMeQuickFlow,
    setSelectedRecipe,
    setActiveView,
    pantryIngredients,
  } = useApp();

  const [isLoading, setIsLoading] = useState(false);
  const [decidedRecipe, setDecidedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (isDecideForMeModalOpen) {
      setIsLoading(true);
      setDecidedRecipe(null);

      decideForMeQuickFlow()
        .then(recipe => {
          setDecidedRecipe(recipe);
          if (recipe) {
            playCelebrationSound();
            confetti({
              particleCount: 90,
              spread: 60,
              origin: { y: 0.5 },
            });
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isDecideForMeModalOpen]);

  if (!isDecideForMeModalOpen) return null;

  const handleShowHowToMake = () => {
    if (decidedRecipe) {
      setSelectedRecipe(decidedRecipe);
      setIsDecideForMeModalOpen(false);
      setActiveView('recipe');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-200 space-y-6 text-stone-900 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => setIsDecideForMeModalOpen(false)}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-black uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 fill-red-600 text-red-600" />
            <span>Decisão Imediata</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-stone-900">
            🚨 Estou com fome. Decide por mim!
          </h2>
          <p className="text-xs text-stone-500">
            Eliminamos a dúvida: uma única sugestão perfeita para agora.
          </p>
        </div>

        {/* Content State */}
        {isLoading ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-orange-100 text-orange-600 flex items-center justify-center animate-spin">
              <Disc className="w-8 h-8" />
            </div>
            <p className="font-extrabold text-stone-800 text-base">
              O GuessFood está decidindo sua refeição...
            </p>
            <p className="text-xs text-stone-400">
              Checando compatibilidade de {pantryIngredients.length} ingredientes e seus aparelhos.
            </p>
          </div>
        ) : decidedRecipe ? (
          <div className="space-y-5">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 border-2 border-orange-300 text-center space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-orange-700">
                🎡 A decisão de hoje é...
              </span>

              <h3 className="text-xl sm:text-2xl font-black text-stone-900 font-['Outfit'] uppercase leading-snug">
                {decidedRecipe.title}
              </h3>

              <p className="text-xs sm:text-sm text-stone-600">
                {decidedRecipe.description}
              </p>

              {/* 3 Metric Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white text-stone-800 font-bold text-xs shadow-xs border border-stone-200">
                  <Clock className="w-3.5 h-3.5 text-orange-500" />
                  <span>⏱️ {decidedRecipe.prepTimeMinutes} minutos</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white text-stone-800 font-bold text-xs shadow-xs border border-stone-200">
                  <ChefHat className="w-3.5 h-3.5 text-orange-500" />
                  <span>👨‍🍳 {decidedRecipe.difficulty}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white text-stone-800 font-bold text-xs shadow-xs border border-stone-200">
                  <Users className="w-3.5 h-3.5 text-orange-500" />
                  <span>🍽️ {decidedRecipe.servings} porções</span>
                </span>
              </div>
            </div>

            {/* CTA Button per Section 11 */}
            <button
              onClick={handleShowHowToMake}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-600 via-rose-600 to-amber-500 hover:brightness-110 active:scale-95 text-white font-black text-base shadow-xl shadow-orange-600/30 flex items-center justify-center gap-3 transition-all cursor-pointer"
            >
              <span>👨‍🍳 MOSTRAR COMO FAZER</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="py-6 text-center space-y-3">
            <p className="text-stone-600 text-sm">
              Nenhuma receita encontrada com os ingredientes atuais. Tente adicionar ovos, queijo ou frango!
            </p>
            <button
              onClick={() => {
                setIsDecideForMeModalOpen(false);
                setActiveView('ingredients');
              }}
              className="px-4 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs"
            >
              Adicionar mais ingredientes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
