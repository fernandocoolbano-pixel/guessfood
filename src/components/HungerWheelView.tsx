import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Recipe } from '../types';
import confetti from 'canvas-confetti';
import { playTickSound, playCelebrationSound } from '../utils/audio';
import {
  Sparkles,
  Zap,
  RotateCcw,
  ChefHat,
  Clock,
  ArrowRight,
  Disc,
  CheckCircle2,
  Users,
} from 'lucide-react';

interface RecipeWheelSlice {
  recipe: Recipe;
  color: string;
}

const SLICE_COLORS = [
  '#f59e0b', // amber-500
  '#ea580c', // orange-600
  '#ec4899', // pink-500
  '#8b5cf6', // purple-500
];

export const HungerWheelView: React.FC = () => {
  const {
    generatedRecipes,
    generateRecipesForEffortFlow,
    cookingEffort,
    selectedOccasion,
    setSelectedRecipe,
    setActiveView,
  } = useApp();

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [hasLanded, setHasLanded] = useState(false);
  const [winningRecipe, setWinningRecipe] = useState<Recipe | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const wheelRef = useRef<HTMLDivElement>(null);

  // Map generated recipes to wheel slices
  const slices: RecipeWheelSlice[] = React.useMemo(() => {
    return generatedRecipes.map((recipe, idx) => ({
      recipe,
      color: SLICE_COLORS[idx % SLICE_COLORS.length],
    }));
  }, [generatedRecipes]);

  // Load recipes if empty
  useEffect(() => {
    if (generatedRecipes.length === 0) {
      setIsAnalyzing(true);
      generateRecipesForEffortFlow(cookingEffort)
        .catch(console.error)
        .finally(() => setIsAnalyzing(false));
    }
  }, [generatedRecipes.length]);

  const spinWheel = () => {
    if (isSpinning || slices.length === 0) return;

    setIsSpinning(true);
    setHasLanded(false);
    setWinningRecipe(null);

    const winningIndex = Math.floor(Math.random() * slices.length);
    const target = slices[winningIndex];

    const sliceAngle = 360 / slices.length;
    const extraRotations = 5 * 360;
    const targetAngle = 360 - (winningIndex * sliceAngle + sliceAngle / 2);
    const finalRotation = rotation + extraRotations + (targetAngle - (rotation % 360));

    let tickCount = 0;
    const tickInterval = setInterval(() => {
      playTickSound();
      tickCount++;
      if (tickCount > 25) clearInterval(tickInterval);
    }, 120);

    setRotation(finalRotation);

    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      setWinningRecipe(target.recipe);
      setHasLanded(true);
      setSelectedRecipe(target.recipe);
      playCelebrationSound();

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ea580c', '#ec4899', '#8b5cf6'],
      });
    }, 3800);
  };

  const handleGoToRecipe = (recipe?: Recipe) => {
    const toOpen = recipe || winningRecipe;
    if (toOpen) {
      setSelectedRecipe(toOpen);
      setActiveView('recipe');
    }
  };

  const effortLabel =
    cookingEffort === 'rapido'
      ? 'algo rápido'
      : cookingEffort === 'pratico'
      ? 'algo prático'
      : 'algo incrementado';

  if (isAnalyzing) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 mx-auto flex items-center justify-center animate-spin">
          <Disc className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-stone-900 font-['Outfit']">
          Selecionando receitas compatíveis...
        </h2>
        <p className="text-xs text-stone-500">
          Encontrando pratos perfeitos para o seu momento.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-3 max-w-3xl mx-auto">
      {/* Header with prompt wording */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>A Roleta da Fome</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-stone-900 font-['Outfit']">
          🎡 Deixe o GuessFood escolher!
        </h1>

        <p className="text-sm sm:text-base text-stone-600 max-w-lg mx-auto font-medium">
          &ldquo;Já escolheu que quer <strong>{effortLabel}</strong>? Agora deixe o GuessFood ajudar a escolher!&rdquo;
        </p>

        {/* Viable recipe count indicator */}
        <div className="pt-1 flex items-center justify-center gap-2 text-xs font-bold text-stone-500">
          <span>{slices.length} receitas compatíveis encontradas na sua cozinha</span>
        </div>
      </div>

      {/* Wheel Area */}
      <div className="relative bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent rounded-3xl p-6 sm:p-10 border border-amber-200/60 shadow-sm flex flex-col items-center justify-center overflow-hidden">
        {/* Pointer at top */}
        <div className="relative z-20 -mb-4 flex flex-col items-center">
          <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-red-600 filter drop-shadow-md" />
        </div>

        {/* Circular Wheel container */}
        <div className="relative w-72 h-72 sm:w-88 sm:h-88 rounded-full shadow-2xl p-2 bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 ring-8 ring-white">
          <div
            ref={wheelRef}
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning
                ? 'transform 3.8s cubic-bezier(0.15, 0.9, 0.2, 1)'
                : 'none',
            }}
            className="w-full h-full rounded-full overflow-hidden relative shadow-inner bg-white"
          >
            {slices.length <= 1 ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-500 to-amber-500 text-white p-4 text-center">
                <span className="text-3xl">🍽️</span>
                <span className="font-black text-sm sm:text-base mt-1 font-['Outfit'] truncate max-w-[200px]">
                  {slices[0]?.recipe.title || 'Receita Selecionada'}
                </span>
              </div>
            ) : (
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {slices.map((slice, i) => {
                  const sliceAngle = 360 / slices.length;
                  const startAngle = i * sliceAngle;
                  const endAngle = (i + 1) * sliceAngle;

                  const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                  const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                  const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                  const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

                  const largeArcFlag = sliceAngle > 180 ? 1 : 0;
                  const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

                  const midAngle = startAngle + sliceAngle / 2;
                  const textRadius = 28;
                  const tx = 50 + textRadius * Math.cos((Math.PI * midAngle) / 180);
                  const ty = 50 + textRadius * Math.sin((Math.PI * midAngle) / 180);

                  // Short label
                  const shortTitle = slice.recipe.title.split(' ').slice(0, 3).join(' ');

                  return (
                    <g key={slice.recipe.id}>
                      <path
                        d={pathData}
                        fill={slice.color}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      <text
                        x={tx}
                        y={ty}
                        fill="#ffffff"
                        fontSize="4.5"
                        fontWeight="900"
                        fontFamily="Outfit, sans-serif"
                        textAnchor="middle"
                        dominantBaseline="central"
                        transform={`rotate(${midAngle + 90}, ${tx}, ${ty})`}
                      >
                        {shortTitle}
                      </text>
                    </g>
                  );
                })}
              </svg>
            )}
          </div>

          {/* Center Hub Button */}
          <button
            onClick={spinWheel}
            disabled={isSpinning}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-stone-900 hover:bg-stone-800 text-white shadow-2xl flex flex-col items-center justify-center border-4 border-white transition-transform active:scale-95 disabled:opacity-90 group cursor-pointer"
          >
            <span className="text-lg group-hover:rotate-45 transition-transform">🎲</span>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
              {isSpinning ? 'Girando...' : 'GIRAR!'}
            </span>
          </button>
        </div>

        {/* Spin CTA Button */}
        <div className="mt-8">
          <button
            onClick={spinWheel}
            disabled={isSpinning}
            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 text-white font-black text-lg shadow-xl shadow-orange-500/30 hover:brightness-110 active:scale-95 disabled:opacity-60 transition-all flex items-center gap-3 cursor-pointer"
          >
            <Disc className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'ESCOLHENDO SUA RECEITA...' : 'GIRAR RECEITAS'}</span>
          </button>
        </div>
      </div>

      {/* RESULT CARD: "🎉 O GUESSFOOD DECIDIU!" */}
      {hasLanded && winningRecipe && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-orange-400 shadow-2xl space-y-5 animate-in fade-in slide-in-from-bottom-6 duration-500">
          <div className="text-center space-y-1">
            <span className="text-xs font-black uppercase tracking-widest text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
              Receita Selecionada pela Roleta
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 font-['Outfit'] pt-2">
              🎉 O GUESSFOOD DECIDIU!
            </h2>
            <p className="text-sm text-stone-500">
              A pedida perfeita para o seu nível de preparo hoje:
            </p>
          </div>

          {/* Recipe Card Preview */}
          <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200/80 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 font-['Outfit']">
                  {winningRecipe.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 line-clamp-2">
                  {winningRecipe.description}
                </p>
              </div>
              <span className="shrink-0 text-3xl">👨‍🍳</span>
            </div>

            {/* Quick Badges */}
            <div className="flex flex-wrap gap-2 text-xs font-bold pt-1">
              <span className="px-2.5 py-1 rounded-lg bg-white text-stone-800 border border-stone-200">
                ⏱️ {winningRecipe.prepTimeMinutes} minutos
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white text-stone-800 border border-stone-200">
                👨‍🍳 {winningRecipe.difficulty}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white text-stone-800 border border-stone-200">
                🍽️ {winningRecipe.servings} porções
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800">
                {winningRecipe.hasAllIngredients
                  ? '✓ Você tem tudo'
                  : `🛒 Falta apenas: ${winningRecipe.missingIngredient || '1 item'}`}
              </span>
            </div>
          </div>

          {/* Action to Full Recipe */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleGoToRecipe(winningRecipe)}
              className="flex-1 py-4 px-6 rounded-2xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-black text-base shadow-lg shadow-orange-600/25 flex items-center justify-center gap-3 transition-all cursor-pointer"
            >
              <span>MOSTRAR COMO FAZER</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={spinWheel}
              className="py-4 px-6 rounded-2xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-700 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Girar de novo</span>
            </button>
          </div>
        </div>
      )}

      {/* Alternative List: All Viable Recipes Found */}
      {slices.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-stone-900 text-base font-['Outfit']">
              Ou escolha direto entre as receitas encontradas:
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {slices.map(s => (
              <div
                key={s.recipe.id}
                onClick={() => handleGoToRecipe(s.recipe)}
                className="p-4 rounded-2xl bg-stone-50 hover:bg-amber-50/80 border border-stone-200/80 hover:border-orange-300 transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <h4 className="font-extrabold text-stone-900 text-sm group-hover:text-orange-600 transition-colors">
                    {s.recipe.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                    <span>⏱️ {s.recipe.prepTimeMinutes}m</span>
                    <span>•</span>
                    <span>👨‍🍳 {s.recipe.difficulty}</span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-400 group-hover:text-orange-600 group-hover:border-orange-300 transition-all shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
