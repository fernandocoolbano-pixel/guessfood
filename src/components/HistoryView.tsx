import React from 'react';
import { useApp } from '../context/AppContext';
import { HistoryItem } from '../types';
import {
  Clock,
  RotateCcw,
  Star,
  CheckCircle2,
  Calendar,
  ChefHat,
  ArrowRight,
} from 'lucide-react';

export const HistoryView: React.FC = () => {
  const { history, setSelectedRecipe, setActiveView } = useApp();

  const handleRecook = (item: HistoryItem) => {
    setSelectedRecipe(item.recipe);
    setActiveView('recipe');
  };

  return (
    <div className="space-y-6 pb-3 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5" />
          <span>Histórico Culinário</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-stone-900 font-['Outfit']">
          Receitas Preparadas
        </h1>

        <p className="text-sm text-stone-600 max-w-xl">
          Seu diário de vitórias contra a indecisão na cozinha! Veja os pratos que você já preparou e repita suas receitas de sucesso.
        </p>
      </div>

      {/* Empty State */}
      {history.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-amber-100 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center text-3xl">
            🍳
          </div>
          <h3 className="text-lg font-black text-stone-900 font-['Outfit']">
            Você ainda não registrou nenhum preparo
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Ao terminar de cozinhar uma receita ou no modo cozinheiro, marque &ldquo;Cozinhei isso!&rdquo; para registrar no histórico.
          </p>
          <button
            onClick={() => setActiveView('ingredients')}
            className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20"
          >
            Decidir Minha Próxima Refeição
          </button>
        </div>
      ) : (
        /* History Timeline List */
        <div className="space-y-3">
          {history.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 border border-amber-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-2xl shrink-0">
                  🍽️
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                      {item.recipe.category}
                    </span>
                    <span className="text-xs text-stone-400 flex items-center gap-1 font-medium">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.cookedAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <h3 className="font-black text-base sm:text-lg text-stone-900 font-['Outfit']">
                    {item.recipe.title}
                  </h3>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-xs">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= (item.rating || 5)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-stone-300'
                        }`}
                      />
                    ))}
                    <span className="text-stone-500 font-semibold ml-1">
                      {item.recipe.prepTimeMinutes} min de preparo
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleRecook(item)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Cozinhar de Novo</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
