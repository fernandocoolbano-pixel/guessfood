import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SPECIAL_OCCASIONS } from '../data/kitchenAppliances';
import { SpecialOccasionId, Recipe } from '../types';
import {
  Sparkles,
  Users,
  Heart,
  Sun,
  Beer,
  Cake,
  ArrowRight,
  Disc,
  Clock,
  ChefHat,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

export const SpecialOccasionsView: React.FC = () => {
  const {
    pantryIngredients,
    selectedApplianceIds,
    generateOccasionRecipesFlow,
    setSelectedRecipe,
    setActiveView,
    isLoading,
  } = useApp();

  const [activeOccasion, setActiveOccasion] = useState<SpecialOccasionId | null>(null);
  const [occasionRecipes, setOccasionRecipes] = useState<Recipe[]>([]);

  const handleSelectOccasion = async (occId: SpecialOccasionId) => {
    setActiveOccasion(occId);
    try {
      const recipes = await generateOccasionRecipesFlow(occId);
      setOccasionRecipes(recipes);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleOpenRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setActiveView('recipe');
  };

  const currentOccasionData = SPECIAL_OCCASIONS.find(o => o.id === activeOccasion);

  return (
    <div className="space-y-6 pb-3 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ocasiões Especiais</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-stone-900 font-['Outfit']">
          🎉 Momentos que pedem algo especial
        </h1>

        <p className="text-sm sm:text-base text-stone-600 max-w-lg mx-auto font-medium">
          Escolha o clima da sua reunião ou celebração. Usamos o que você já tem cadastrado na cozinha para sugerir a receita ideal.
        </p>

        {/* Pantry notice: no need to re-type */}
        <div className="pt-1 flex items-center justify-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-2xl w-fit mx-auto border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Usando os {pantryIngredients.length} ingredientes já salvos na sua despensa</span>
        </div>
      </div>

      {/* Occasions Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {SPECIAL_OCCASIONS.map(occ => {
          const isSelected = activeOccasion === occ.id;

          return (
            <button
              key={occ.id}
              onClick={() => handleSelectOccasion(occ.id)}
              className={`p-5 rounded-3xl border-2 transition-all relative flex flex-col justify-between text-left group active:scale-[0.98] cursor-pointer ${
                isSelected
                  ? 'bg-amber-50/80 border-orange-500 shadow-xl shadow-orange-500/15 ring-4 ring-orange-200'
                  : 'bg-white border-stone-200/80 hover:border-orange-300 hover:shadow-md'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-4xl group-hover:scale-110 transition-transform">
                    {occ.icon}
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                    {occ.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-black text-lg text-stone-900 font-['Outfit']">
                    {occ.title}
                  </h3>
                  <p className="text-xs font-extrabold text-orange-600 mt-0.5">
                    {occ.subtitle}
                  </p>
                  <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                    {occ.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold">
                <span className={isSelected ? 'text-orange-600' : 'text-stone-400 group-hover:text-stone-800'}>
                  {isSelected ? '✓ Selecionado' : 'Ver sugestões'}
                </span>
                <ArrowRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Tailored Occasion Suggestions */}
      {currentOccasionData && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-orange-200 shadow-lg space-y-5 animate-in fade-in">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase text-orange-600 tracking-wider">
              {currentOccasionData.icon} {currentOccasionData.title}
            </span>
            <h2 className="text-2xl font-black text-stone-900 font-['Outfit']">
              {currentOccasionData.icon} Com o que você tem em casa, encontramos estas ideias especiais:
            </h2>
            <p className="text-xs text-stone-500">
              Receitas pensadas para combinar com o clima do seu momento.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {occasionRecipes.map(recipe => (
              <div
                key={recipe.id}
                onClick={() => handleOpenRecipe(recipe)}
                className="p-5 rounded-2xl bg-amber-50/50 hover:bg-amber-100/70 border border-amber-200/80 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-orange-500 text-white shadow-2xs">
                      {recipe.category}
                    </span>
                    <span className="text-xs font-bold text-stone-500">
                      🍽️ {recipe.servings} porções
                    </span>
                  </div>

                  <h3 className="font-black text-lg text-stone-900 font-['Outfit'] group-hover:text-orange-600 transition-colors">
                    {recipe.title}
                  </h3>

                  <p className="text-xs text-stone-600 line-clamp-2">
                    {recipe.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-xs font-bold text-stone-700">
                  <div className="flex items-center gap-2">
                    <span>⏱️ {recipe.prepTimeMinutes}m</span>
                    <span>•</span>
                    <span>👨‍🍳 {recipe.difficulty}</span>
                  </div>

                  <span className="text-orange-600 font-black inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Ver modo de preparo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
