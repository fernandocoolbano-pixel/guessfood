import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Recipe } from '../types';
import {
  Heart,
  Clock,
  ChefHat,
  Trash2,
  ArrowRight,
  Search,
  Sparkles,
} from 'lucide-react';

export const FavoritesView: React.FC = () => {
  const { favorites, toggleFavorite, setSelectedRecipe, setActiveView } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = favorites.filter(f =>
    f.recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setActiveView('recipe');
  };

  return (
    <div className="space-y-6 pb-3 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider">
          <Heart className="w-3.5 h-3.5 fill-rose-600" />
          <span>Suas Preferidas</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-stone-900 font-['Outfit']">
          Receitas Favoritas
        </h1>

        <p className="text-sm text-stone-600 max-w-xl">
          Aqui estão os pratos que você mais amou. Acesse quando quiser cozinhar de novo sem precisar girar a roleta.
        </p>

        {/* Search */}
        {favorites.length > 0 && (
          <div className="pt-2 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar nos favoritos..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 bg-stone-50 text-sm focus:outline-orange-500 font-medium"
            />
          </div>
        )}
      </div>

      {/* Empty State */}
      {favorites.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-amber-100 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center text-3xl">
            ❤️
          </div>
          <h3 className="text-lg font-black text-stone-900 font-['Outfit']">
            Você ainda não tem receitas favoritas
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Quando a Roleta da Fome decidir algo incrível, clique no coração na tela da receita para salvar aqui!
          </p>
          <button
            onClick={() => setActiveView('ingredients')}
            className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20"
          >
            Decidir uma Receita Agora
          </button>
        </div>
      ) : (
        /* Favorites Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(fav => (
            <div
              key={fav.recipe.id}
              className="bg-white rounded-3xl p-5 border border-amber-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-white ${
                    fav.recipe.category === 'rapido'
                      ? 'bg-amber-500'
                      : fav.recipe.category === 'incrementado'
                      ? 'bg-orange-600'
                      : 'bg-purple-600'
                  }`}>
                    {fav.recipe.category}
                  </span>

                  <button
                    onClick={() => toggleFavorite(fav.recipe)}
                    className="p-1.5 rounded-full hover:bg-stone-100 text-rose-500 transition-colors"
                    title="Remover favorito"
                  >
                    <Heart className="w-4 h-4 fill-rose-500" />
                  </button>
                </div>

                <h3 className="font-black text-lg text-stone-900 font-['Outfit']">
                  {fav.recipe.title}
                </h3>

                <p className="text-xs text-stone-500 line-clamp-2">
                  {fav.recipe.description}
                </p>
              </div>

              {/* Bottom Specs and Action */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-600">
                  <span>⏱️ {fav.recipe.prepTimeMinutes}m</span>
                  <span>•</span>
                  <span>👨‍🍳 {fav.recipe.difficulty}</span>
                </div>

                <button
                  onClick={() => handleOpenRecipe(fav.recipe)}
                  className="px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <span>Ver receita</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
