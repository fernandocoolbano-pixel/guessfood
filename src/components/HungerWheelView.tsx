import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Recipe, RecipeCategory } from '../types';
import confetti from 'canvas-confetti';
import { playTickSound, playCelebrationSound } from '../utils/audio';
import {
  Sparkles,
  Zap,
  Flame,
  Palette,
  RotateCcw,
  ChefHat,
  Clock,
  ArrowRight,
  Disc,
  CheckCircle2,
} from 'lucide-react';

interface WheelSlice {
  category: RecipeCategory;
  label: string;
  icon: string;
  subtitle: string;
  color: string;
  bgTailwind: string;
  recipe: Recipe;
}

export const HungerWheelView: React.FC = () => {
  const {
    generatedRecipes,
    generateRecipesFlow,
    setSelectedRecipe,
    setActiveView,
    pantryIngredients,
    selectedApplianceIds,
  } = useApp();

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [hasLanded, setHasLanded] = useState(false);
  const [winningSlice, setWinningSlice] = useState<WheelSlice | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const wheelRef = useRef<HTMLDivElement>(null);

  // Filter available categories based on REAL generated recipes
  const slices: WheelSlice[] = React.useMemo(() => {
    const list: WheelSlice[] = [];

    const rapido = generatedRecipes.find(r => r.category === 'rapido');
    if (rapido) {
      list.push({
        category: 'rapido',
        label: 'RÁPIDO',
        icon: '⚡',
        subtitle: 'Simples, prática e tempo reduzido',
        color: '#f59e0b', // amber-500
        bgTailwind: 'from-amber-500 to-yellow-500',
        recipe: rapido,
      });
    }

    const incrementado = generatedRecipes.find(r => r.category === 'incrementado');
    if (incrementado) {
      list.push({
        category: 'incrementado',
        label: 'INCREMENTADO',
        icon: '🔥',
        subtitle: 'Elaborada, rica em sabor e caprichada',
        color: '#ea580c', // orange-600
        bgTailwind: 'from-orange-600 to-red-500',
        recipe: incrementado,
      });
    }

    const criativo = generatedRecipes.find(r => r.category === 'criativo');
    if (criativo) {
      list.push({
        category: 'criativo',
        label: 'CRIATIVO',
        icon: '🎨',
        subtitle: 'Inesperada e combinação inovadora',
        color: '#8b5cf6', // purple-500
        bgTailwind: 'from-purple-600 to-pink-500',
        recipe: criativo,
      });
    }

    return list;
  }, [generatedRecipes]);

  // Load recipes if none yet generated
  useEffect(() => {
    if (generatedRecipes.length === 0) {
      setIsAnalyzing(true);
      generateRecipesFlow()
        .catch(console.error)
        .finally(() => setIsAnalyzing(false));
    }
  }, [generatedRecipes.length]);

  const spinWheel = () => {
    if (isSpinning || slices.length === 0) return;

    setIsSpinning(true);
    setHasLanded(false);
    setWinningSlice(null);

    // Pick random target slice
    const winningIndex = Math.floor(Math.random() * slices.length);
    const targetSlice = slices[winningIndex];

    const sliceAngle = 360 / slices.length;
    // Calculate target degree so pointer at top (270 deg or 90 deg) points to chosen slice
    const extraRotations = 5 * 360; // 5 full turns
    const targetAngle = 360 - (winningIndex * sliceAngle + sliceAngle / 2);
    const finalRotation = rotation + extraRotations + (targetAngle - (rotation % 360));

    // Play tick sounds periodically during spin
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
      setWinningSlice(targetSlice);
      setHasLanded(true);
      setSelectedRecipe(targetSlice.recipe);
      playCelebrationSound();

      // Confetti burst
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ea580c', '#ec4899', '#8b5cf6'],
      });
    }, 3800);
  };

  const handleGoToRecipe = () => {
    if (winningSlice) {
      setSelectedRecipe(winningSlice.recipe);
      setActiveView('recipe');
    }
  };

  if (isAnalyzing) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 mx-auto flex items-center justify-center animate-spin">
          <Disc className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-stone-900 font-['Outfit']">
          Analisando geladeira e equipamentos...
        </h2>
        <p className="text-xs text-stone-500">
          Checando combinações viáveis para a sua cozinha.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto">
      {/* Intro message per Section 10 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>A Roleta da Fome</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-stone-900 font-['Outfit']">
          🎡 Deixe o GuessFood decidir!
        </h1>

        <p className="text-sm sm:text-base text-stone-600 max-w-lg mx-auto font-medium">
          &ldquo;Encontramos algumas possibilidades deliciosas com o que você tem em casa. Agora deixe o GuessFood ajudar você a decidir.&rdquo;
        </p>

        {/* Valid styles indicator according to strict rule */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-stone-400 font-bold">Estilos viáveis hoje:</span>
          {slices.map(s => (
            <span
              key={s.category}
              className={`px-3 py-1 rounded-full font-bold text-white shadow-2xs ${
                s.category === 'rapido'
                  ? 'bg-amber-500'
                  : s.category === 'incrementado'
                  ? 'bg-orange-600'
                  : 'bg-purple-600'
              }`}
            >
              {s.icon} {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Wheel Area */}
      <div className="relative bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent rounded-3xl p-6 sm:p-10 border border-amber-200/60 shadow-sm flex flex-col items-center justify-center overflow-hidden">
        {/* Pointer Triangle at top */}
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
            {/* Slices SVG */}
            {slices.length === 1 ? (
              // 1 Single Viable slice (Full circle)
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-500 to-amber-500 text-white p-4 text-center">
                <span className="text-4xl">{slices[0].icon}</span>
                <span className="font-black text-lg mt-1 font-['Outfit']">{slices[0].label}</span>
                <span className="text-[11px] opacity-90">{slices[0].subtitle}</span>
              </div>
            ) : (
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {slices.map((slice, i) => {
                  const sliceAngle = 360 / slices.length;
                  const startAngle = i * sliceAngle;
                  const endAngle = (i + 1) * sliceAngle;

                  // Coordinates on unit circle
                  const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                  const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                  const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                  const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

                  const largeArcFlag = sliceAngle > 180 ? 1 : 0;
                  const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

                  // Center text position
                  const midAngle = startAngle + sliceAngle / 2;
                  const textRadius = 32;
                  const tx = 50 + textRadius * Math.cos((Math.PI * midAngle) / 180);
                  const ty = 50 + textRadius * Math.sin((Math.PI * midAngle) / 180);

                  return (
                    <g key={slice.category}>
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
                        fontSize="5.5"
                        fontWeight="900"
                        fontFamily="Outfit, sans-serif"
                        textAnchor="middle"
                        dominantBaseline="central"
                        transform={`rotate(${midAngle + 90}, ${tx}, ${ty})`}
                      >
                        {slice.icon} {slice.label}
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
            <RotateCcw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'A SORTE ESTÁ DECIDINDO...' : 'GIRAR A ROLETA AGORA'}</span>
          </button>
        </div>
      </div>

      {/* RESULT MODAL / SECTION: "🎉 O GUESSFOOD DECIDIU!" */}
      {hasLanded && winningSlice && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-orange-400 shadow-2xl space-y-5 animate-in fade-in slide-in-from-bottom-6 duration-500">
          <div className="text-center space-y-1">
            <span className="text-xs font-black uppercase tracking-widest text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
              {winningSlice.icon} Estilo {winningSlice.label}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 font-['Outfit'] pt-2">
              🎉 O GUESSFOOD DECIDIU!
            </h2>
            <p className="text-sm text-stone-500">
              A melhor escolha possível com os seus ingredientes e eletrodomésticos:
            </p>
          </div>

          {/* Recipe Card Preview */}
          <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200/80 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 font-['Outfit']">
                  {winningSlice.recipe.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 line-clamp-2">
                  {winningSlice.recipe.description}
                </p>
              </div>
              <span className="shrink-0 text-3xl">👨‍🍳</span>
            </div>

            {/* Quick Badges */}
            <div className="flex flex-wrap gap-2 text-xs font-bold pt-1">
              <span className="px-2.5 py-1 rounded-lg bg-white text-stone-800 border border-stone-200">
                ⏱️ {winningSlice.recipe.prepTimeMinutes} minutos
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white text-stone-800 border border-stone-200">
                👨‍🍳 {winningSlice.recipe.difficulty}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white text-stone-800 border border-stone-200">
                🍽️ {winningSlice.recipe.servings} porções
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800">
                {winningSlice.recipe.hasAllIngredients
                  ? '✓ Você tem tudo'
                  : `🛒 Falta apenas: ${winningSlice.recipe.missingIngredient || '1 item'}`}
              </span>
            </div>
          </div>

          {/* Action to Full Recipe */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleGoToRecipe}
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
    </div>
  );
};
