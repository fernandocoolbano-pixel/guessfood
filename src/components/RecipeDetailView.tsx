import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Recipe } from '../types';
import {
  Clock,
  ChefHat,
  Users,
  Heart,
  Share2,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  ArrowLeft,
  Check,
  Flame,
  Award,
} from 'lucide-react';

export const RecipeDetailView: React.FC = () => {
  const {
    selectedRecipe,
    setActiveView,
    toggleFavorite,
    isFavorite,
    markAsCooked,
    pantryOnlyMode,
    setPantryOnlyMode,
  } = useApp();

  const [hasCooked, setHasCooked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!selectedRecipe) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <span className="text-4xl block">🍽️</span>
        <h2 className="text-xl font-black text-stone-900 font-['Outfit']">
          Nenhuma receita selecionada
        </h2>
        <button
          onClick={() => setActiveView('home')}
          className="px-6 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-sm"
        >
          Voltar ao início
        </button>
      </div>
    );
  }

  const isFav = isFavorite(selectedRecipe.id);

  // Compute ingredient counts
  const totalIngredients = selectedRecipe.ingredientsUsed.length;
  const ownedIngredients = selectedRecipe.ingredientsUsed.filter(i => i.isOwned).length;
  const isMissingSomething = !selectedRecipe.hasAllIngredients || ownedIngredients < totalIngredients;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedRecipe.title,
        text: `Olha a receita que o GuessFood decidiu pra mim: ${selectedRecipe.title}!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `🍽️ GuessFood decidiu: ${selectedRecipe.title}!\n⏱️ ${selectedRecipe.prepTimeMinutes}min | 👨‍🍳 ${selectedRecipe.difficulty}`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleMarkCooked = () => {
    markAsCooked(selectedRecipe, 5);
    setHasCooked(true);
  };

  return (
    <div className="space-y-6 pb-3 max-w-4xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveView('wheel')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 font-bold text-xs border border-stone-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para a Roleta</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Favorite Button */}
          <button
            onClick={() => toggleFavorite(selectedRecipe)}
            className={`p-2.5 rounded-xl border transition-all ${
              isFav
                ? 'bg-rose-50 border-rose-300 text-rose-600'
                : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
            title={isFav ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-600 text-rose-600' : ''}`} />
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-bold flex items-center gap-1"
            title="Compartilhar"
          >
            <Share2 className="w-4 h-4" />
            {copiedLink && <span className="text-[10px] text-emerald-600">Copiado!</span>}
          </button>
        </div>
      </div>

      {/* Main Recipe Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-2xs ${
            selectedRecipe.category === 'rapido'
              ? 'bg-amber-500'
              : selectedRecipe.category === 'incrementado'
              ? 'bg-orange-600'
              : 'bg-purple-600'
          }`}>
            {selectedRecipe.category === 'rapido' ? '⚡ Rápido' : selectedRecipe.category === 'incrementado' ? '🔥 Incrementado' : '🎨 Criativo'}
          </span>

          <span className="text-xs font-bold text-stone-500">
            Decisão do GuessFood
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-stone-900 font-['Outfit'] leading-tight">
          {selectedRecipe.title}
        </h1>

        <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-medium">
          {selectedRecipe.description}
        </p>

        {/* 4 Essential Recipe Badges per Section 12 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-center gap-2.5">
            <span className="text-2xl">⏱️</span>
            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase block">Tempo</span>
              <span className="text-xs sm:text-sm font-black text-stone-800">
                {selectedRecipe.prepTimeMinutes} min
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-orange-50/70 border border-orange-200/60 flex items-center gap-2.5">
            <span className="text-2xl">👨‍🍳</span>
            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase block">Dificuldade</span>
              <span className="text-xs sm:text-sm font-black text-stone-800">
                {selectedRecipe.difficulty}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200/60 flex items-center gap-2.5">
            <span className="text-2xl">🍽️</span>
            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase block">Porções</span>
              <span className="text-xs sm:text-sm font-black text-stone-800">
                {selectedRecipe.servings} pessoas
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 flex items-center gap-2.5">
            <span className="text-2xl">🔌</span>
            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase block">Equipamento</span>
              <span className="text-xs sm:text-sm font-black text-stone-800 capitalize truncate block">
                {selectedRecipe.appliancesUsed.join(', ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 13: "TENHO QUASE TUDO" WIDGET (when applicable) */}
      {isMissingSomething ? (
        <div className="bg-amber-50/80 rounded-3xl p-6 border-2 border-amber-300 shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200 text-amber-900 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>⭐ Você está quase lá!</span>
              </div>
              <p className="text-sm font-bold text-stone-800">
                Você já possui <strong>{ownedIngredients}</strong> dos <strong>{totalIngredients}</strong> ingredientes necessários.
              </p>
              <p className="text-xs text-stone-600">
                🛒 Faltaria apenas: <strong className="text-orange-700">{selectedRecipe.missingIngredient || '1 ingrediente simples'}</strong>
              </p>
            </div>
          </div>

          {/* Dual Toggle Choice: Fazer só com o que tenho VS Posso comprar */}
          <div className="bg-white rounded-2xl p-2 border border-amber-200 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => setPantryOnlyMode(true)}
              className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 ${
                pantryOnlyMode
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>FAZER SÓ COM O QUE TENHO</span>
            </button>

            <button
              onClick={() => setPantryOnlyMode(false)}
              className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 ${
                !pantryOnlyMode
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>POSSO COMPRAR O QUE FALTA</span>
            </button>
          </div>

          {pantryOnlyMode && (
            <div className="p-3.5 rounded-xl bg-orange-100/70 border border-orange-200 text-orange-950 text-xs leading-relaxed">
              <strong>💡 Versão adaptada ativada:</strong> {selectedRecipe.adaptedForPantryOnly || 'Receita adaptada para usar estritamente o que você já possui em mãos.'}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>✓ Você já tem todos os ingredientes necessários para esta receita!</span>
        </div>
      )}

      {/* SECTION 12: INGREDIENTES — VOCÊ VAI USAR */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧺</span>
            <h2 className="text-lg sm:text-xl font-black text-stone-900 font-['Outfit']">
              Você vai usar
            </h2>
          </div>
          <span className="text-xs font-bold text-stone-400">
            {selectedRecipe.ingredientsUsed.length} itens
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {selectedRecipe.ingredientsUsed.map((ing, idx) => {
            const isMissing = !ing.isOwned;
            const isOmittedInPantryOnly = isMissing && pantryOnlyMode;

            return (
              <div
                key={idx}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-2 transition-all ${
                  isOmittedInPantryOnly
                    ? 'bg-stone-50 border-stone-200 opacity-50 line-through'
                    : isMissing
                    ? 'bg-amber-50/70 border-amber-300'
                    : 'bg-stone-50/70 border-stone-200/80'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      ing.isOwned
                        ? 'bg-emerald-500 text-white'
                        : isOmittedInPantryOnly
                        ? 'bg-stone-300 text-stone-600'
                        : 'bg-amber-400 text-amber-950'
                    }`}
                  >
                    {ing.isOwned ? '✓' : '!'}
                  </div>
                  <div>
                    <span className="text-sm font-black text-stone-800 block">
                      {ing.name}
                    </span>
                    <span className="text-xs text-stone-500">{ing.amount}</span>
                  </div>
                </div>

                {isMissing && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 shrink-0">
                    {pantryOnlyMode ? 'Dispensado' : 'Falta'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 14: MODO DE PREPARO */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              Passo a Passo
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-['Outfit']">
              Modo de Preparo
            </h2>
          </div>

          {/* Interactive Cooking Mode Button */}
          <button
            onClick={() => setActiveView('cooking-mode')}
            className="px-5 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-current text-amber-400" />
            <span>MODO COZINHEIRO (TELA CHEIA)</span>
          </button>
        </div>

        {/* Steps List */}
        <div className="space-y-3.5">
          {selectedRecipe.steps.map(step => (
            <div
              key={step.stepNumber}
              className="p-4 sm:p-5 rounded-2xl bg-amber-50/40 border border-amber-100/80 flex items-start gap-4"
            >
              <div className="w-8 h-8 rounded-xl bg-orange-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                {step.stepNumber}
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-extrabold text-stone-900 text-base">
                    {step.title}
                  </h3>
                  {step.timerMinutes && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {step.timerMinutes} min
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Chef Tip */}
        {selectedRecipe.chefTip && (
          <div className="p-4 rounded-2xl bg-amber-100/60 border border-amber-200 text-stone-800 text-xs sm:text-sm flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <strong className="block font-black text-amber-950">Dica do Chef GuessFood:</strong>
              <p className="text-stone-700 mt-0.5">{selectedRecipe.chefTip}</p>
            </div>
          </div>
        )}
      </div>

      {/* Completion & Action Bar */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-black text-lg">Preparou esse prato?</h3>
          <p className="text-xs text-stone-300">
            Marque como concluído para salvar no seu histórico pessoal de receitas.
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleMarkCooked}
            disabled={hasCooked}
            className={`flex-1 sm:flex-initial px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              hasCooked
                ? 'bg-emerald-500 text-white'
                : 'bg-orange-500 hover:bg-orange-600 text-white active:scale-95 shadow-md shadow-orange-500/20'
            }`}
          >
            {hasCooked ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Salvo no Histórico!</span>
              </>
            ) : (
              <>
                <Award className="w-4 h-4" />
                <span>Cozinhei Esta Receita!</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
