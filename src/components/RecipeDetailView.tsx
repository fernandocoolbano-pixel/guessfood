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

import { validateAndAdaptRecipe } from '../utils/ingredientValidator';

export const RecipeDetailView: React.FC = () => {
  const {
    selectedRecipe,
    setActiveView,
    toggleFavorite,
    isFavorite,
    markAsCooked,
    pantryOnlyMode,
    setPantryOnlyMode,
    pantryIngredients,
    selectedApplianceIds,
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
          onClick={() => setActiveView('wheel')}
          className="px-6 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-sm"
        >
          ← Voltar às receitas
        </button>
      </div>
    );
  }

  // Central validation: ensures 100% coherence between Summary, Badges, Cards and Steps
  const validation = validateAndAdaptRecipe(
    selectedRecipe,
    pantryIngredients,
    selectedApplianceIds,
    pantryOnlyMode
  );

  const activeRecipe = validation.recipe;
  const isFav = isFavorite(activeRecipe.id);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: activeRecipe.title,
        text: `Olha a receita que o GuessFood decidiu pra mim: ${activeRecipe.title}!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `🍽️ GuessFood decidiu: ${activeRecipe.title}!\n⏱️ ${activeRecipe.prepTimeMinutes}min | 👨‍🍳 ${activeRecipe.difficulty}`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleMarkCooked = () => {
    markAsCooked(activeRecipe, 5);
    setHasCooked(true);
  };

  return (
    <div className="space-y-6 pb-3 max-w-4xl mx-auto">
      {/* Top Navigation - CORREÇÃO 3: VOLTAR ÀS RECEITAS */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveView('wheel')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-stone-100 text-stone-800 font-black text-xs sm:text-sm border-2 border-stone-200/80 shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-orange-600 stroke-[2.5]" />
          <span>← VOLTAR ÀS RECEITAS</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Favorite Button */}
          <button
            onClick={() => toggleFavorite(activeRecipe)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
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
            className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-bold flex items-center gap-1 cursor-pointer"
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
            {activeRecipe.category === 'rapido' ? '⚡ Rápido' : activeRecipe.category === 'incrementado' ? '🔥 Incrementado' : '🎨 Criativo'}
          </span>

          <span className="text-xs font-bold text-stone-500">
            Decisão do GuessFood
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-stone-900 font-['Outfit'] leading-tight">
          {activeRecipe.title}
        </h1>

        <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-medium">
          {activeRecipe.description}
        </p>

        {/* 4 Essential Recipe Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-center gap-2.5">
            <span className="text-2xl">⏱️</span>
            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase block">Tempo</span>
              <span className="text-xs sm:text-sm font-black text-stone-800">
                {activeRecipe.prepTimeMinutes} min
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-orange-50/70 border border-orange-200/60 flex items-center gap-2.5">
            <span className="text-2xl">👨‍🍳</span>
            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase block">Dificuldade</span>
              <span className="text-xs sm:text-sm font-black text-stone-800">
                {activeRecipe.difficulty}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200/60 flex items-center gap-2.5">
            <span className="text-2xl">🍽️</span>
            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase block">Porções</span>
              <span className="text-xs sm:text-sm font-black text-stone-800">
                {activeRecipe.servings} pessoas
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 flex items-center gap-2.5">
            <span className="text-2xl">🔌</span>
            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase block">Equipamento</span>
              <span className="text-xs sm:text-sm font-black text-stone-800 capitalize truncate block">
                {activeRecipe.appliancesUsed.join(', ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 13: DISPONIBILIDADE E MODALIDADE (100% COERENTE) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm space-y-4">
        {/* Toggle between "FAZER SÓ COM O QUE TENHO" and "POSSO COMPRAR O QUE FALTA" */}
        <div className="bg-stone-100/80 rounded-2xl p-1.5 grid grid-cols-1 sm:grid-cols-2 gap-2 border border-stone-200">
          <button
            onClick={() => setPantryOnlyMode(true)}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              pantryOnlyMode
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-stone-700 hover:bg-white/60'
            }`}
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>FAZER SÓ COM O QUE TENHO</span>
          </button>

          <button
            onClick={() => setPantryOnlyMode(false)}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              !pantryOnlyMode
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-stone-700 hover:bg-white/60'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>POSSO COMPRAR O QUE FALTA</span>
          </button>
        </div>

        {/* Dynamic Coherent Status Card */}
        {pantryOnlyMode ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <strong className="text-sm font-black">
                ✓ Modo &ldquo;Fazer só com o que tenho&rdquo; ativado!
              </strong>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed pl-7">
              {activeRecipe.adaptedForPantryOnly || 'Receita adaptada para utilizar exclusivamente os ingredientes da sua cozinha.'}
            </p>
          </div>
        ) : validation.missingCount > 0 ? (
          <div className="p-4 rounded-2xl bg-amber-50/80 border-2 border-amber-300 text-stone-800 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200 text-amber-900 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>⭐ Você está quase lá!</span>
            </div>
            <p className="text-sm font-bold text-stone-800">
              Você já possui <strong>{validation.ownedCount}</strong> dos <strong>{validation.totalIngredients}</strong> ingredientes necessários.
            </p>
            <p className="text-xs text-stone-600">
              🛒 Faltaria apenas comprar: <strong className="text-orange-700">{validation.missingItems.join(', ')}</strong>
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>✓ Você já tem todos os ingredientes necessários para esta receita em casa!</span>
          </div>
        )}
      </div>

      {/* SECTION 12: INGREDIENTES — VOCÊ VAI USAR */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧺</span>
            <h2 className="text-lg sm:text-xl font-black text-stone-900 font-['Outfit']">
              Você vai usar
            </h2>
          </div>
          <span className="text-xs font-bold text-stone-500">
            {activeRecipe.ingredientsUsed.length} itens {pantryOnlyMode ? '(100% da sua despensa)' : ''}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {activeRecipe.ingredientsUsed.map((ing, idx) => {
            const isMissing = !ing.isOwned;

            return (
              <div
                key={idx}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-2 transition-all ${
                  isMissing
                    ? 'bg-amber-50/80 border-amber-300'
                    : 'bg-stone-50/70 border-stone-200/80'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                      ing.isOwned
                        ? 'bg-emerald-500 text-white'
                        : 'bg-amber-400 text-amber-950'
                    }`}
                  >
                    {ing.isOwned ? '✓' : '!'}
                  </div>
                  <div className="truncate">
                    <span className="text-sm font-black text-stone-800 block truncate">
                      {ing.name}
                    </span>
                    <span className="text-xs text-stone-500">{ing.amount}</span>
                  </div>
                </div>

                {isMissing ? (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 shrink-0">
                    Falta Comprar
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0">
                    Na cozinha
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
          {activeRecipe.steps.map(step => (
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
        {activeRecipe.chefTip && (
          <div className="p-4 rounded-2xl bg-amber-100/60 border border-amber-200 text-stone-800 text-xs sm:text-sm flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <strong className="block font-black text-amber-950">Dica do Chef GuessFood:</strong>
              <p className="text-stone-700 mt-0.5">{activeRecipe.chefTip}</p>
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
