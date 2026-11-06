import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Zap,
  ArrowRight,
  Flame,
  ChefHat,
  Mic,
  Disc,
  PartyPopper,
  GlassWater,
  Heart,
  Clock,
  ChevronRight,
  Users,
} from 'lucide-react';
import { SponsoredBanner } from './SponsoredBanner';

export const HomeView: React.FC = () => {
  const {
    setActiveView,
    pantryIngredients,
    selectedApplianceIds,
    setIsDecideForMeModalOpen,
    favorites,
    history,
    setSelectedRecipe,
  } = useApp();

  return (
    <div className="space-y-6 pb-3">
      {/* Discreet top partner notice */}
      <SponsoredBanner />

      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 text-white shadow-xl shadow-orange-500/20 p-6 sm:p-10 text-center">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-black/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-amber-50 text-xs font-bold tracking-wide uppercase border border-white/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Você conta o que tem. O GuessFood faz o resto.</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight font-['Outfit'] drop-shadow-xs">
            🍽️ NÃO SABE O QUE COMER?
          </h1>

          <p className="text-base sm:text-lg text-amber-100 font-medium leading-relaxed">
            Fale o que tem na geladeira ou no armário. <br className="hidden sm:inline" />
            O <strong className="text-white underline decoration-yellow-300 decoration-2 underline-offset-4">GuessFood</strong> decide com você.
          </p>

          {/* Quick Pantry & Appliance Counter Pill */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-semibold">
            <button
              onClick={() => setActiveView('ingredients')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 hover:bg-black/30 transition-colors text-white border border-white/15"
            >
              <span>🧺</span>
              <span>{pantryIngredients.length} ingredientes na despensa</span>
            </button>
            <button
              onClick={() => setActiveView('kitchen')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 hover:bg-black/30 transition-colors text-white border border-white/15"
            >
              <span>🔌</span>
              <span>{selectedApplianceIds.length} eletros na cozinha</span>
            </button>
          </div>

          {/* Main Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
            {/* Primary Voice Action */}
            <button
              onClick={() => setActiveView('ingredients')}
              className="px-8 py-4 rounded-2xl bg-white text-stone-900 font-black text-lg sm:text-xl shadow-xl hover:bg-amber-50 active:scale-95 transition-all flex items-center justify-center gap-3 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mic className="w-4 h-4" />
              </div>
              <span>CONTAR O QUE EU TENHO</span>
              <ArrowRight className="w-5 h-5 text-orange-600 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Instant Hunger Shortcut Button */}
            <button
              onClick={() => setIsDecideForMeModalOpen(true)}
              className="px-6 py-4 rounded-2xl bg-stone-900/90 hover:bg-stone-900 text-white font-extrabold text-sm sm:text-base border border-white/20 shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400 group-hover:scale-110 transition-transform" />
              <span>ESTOU COM FOME. DECIDE POR MIM!</span>
            </button>
          </div>
        </div>
      </div>

      {/* NEW DISCOVERY CARDS: Ocasiões Especiais & Drinks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Ocasiões Especiais Card */}
        <div
          onClick={() => setActiveView('occasions')}
          className="p-6 rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-amber-500/10 border-2 border-purple-200/80 hover:border-purple-400 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-3xl group-hover:scale-110 transition-transform">🎉</span>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-600 text-white shadow-2xs">
              Novo
            </span>
          </div>
          <div>
            <h3 className="text-xl font-black text-stone-900 font-['Outfit'] group-hover:text-purple-700 transition-colors">
              Ocasiões Especiais
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Jantar a dois, noite com amigos, almoço de domingo ou happy hour usando os ingredientes da sua cozinha.
            </p>
          </div>
          <div className="pt-2 flex items-center gap-1.5 text-xs font-black text-purple-700 group-hover:translate-x-1 transition-transform">
            <span>Ver receitas para ocasiões</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Drinks & Bar Card */}
        <div
          onClick={() => setActiveView('drinks')}
          className="p-6 rounded-3xl bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-indigo-500/10 border-2 border-pink-200/80 hover:border-pink-400 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-3xl group-hover:scale-110 transition-transform">🍸</span>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-pink-600 text-white shadow-2xs">
              Bar & Cocktails
            </span>
          </div>
          <div>
            <h3 className="text-xl font-black text-stone-900 font-['Outfit'] group-hover:text-pink-700 transition-colors">
              Drinks com o que Você Tem
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Fale o que tem no bar ou na geladeira e o GuessFood sugere coquetéis e bebidas refrescantes.
            </p>
          </div>
          <div className="pt-2 flex items-center gap-1.5 text-xs font-black text-pink-700 group-hover:translate-x-1 transition-transform">
            <span>Abrir o Bar do GuessFood</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* How it Works Section (Updated for Voice & Conscious Effort) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm space-y-5">
        <div className="text-center sm:text-left space-y-1">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
            Simples, Rápido e Sem Frescura
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-['Outfit']">
            Como o GuessFood resolve seu momento
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div
            onClick={() => setActiveView('ingredients')}
            className="cursor-pointer group rounded-2xl p-4 bg-amber-50/60 hover:bg-amber-100/60 border border-amber-200/60 transition-all space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-800 flex items-center justify-center text-xl font-bold">
              🎤
            </div>
            <div>
              <span className="text-[11px] font-black text-amber-700 uppercase">Passo 1</span>
              <h3 className="font-extrabold text-stone-900 text-base">Fale o que você tem</h3>
              <p className="text-xs text-stone-600 mt-1">
                Aperte o microfone e conte o que está na geladeira. O sistema organiza tudo sozinho.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-[11px] font-bold text-orange-600 group-hover:translate-x-1 transition-transform">
              <span>Falar ingredientes</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Step 2 */}
          <div
            onClick={() => setActiveView('kitchen')}
            className="cursor-pointer group rounded-2xl p-4 bg-orange-50/60 hover:bg-orange-100/60 border border-orange-200/60 transition-all space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-800 flex items-center justify-center text-xl font-bold">
              🔌
            </div>
            <div>
              <span className="text-[11px] font-black text-orange-700 uppercase">Passo 2</span>
              <h3 className="font-extrabold text-stone-900 text-base">Sua cozinha real</h3>
              <p className="text-xs text-stone-600 mt-1">
                Marque seus equipamentos. Nenhuma receita pede um aparelho que você não tem.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-[11px] font-bold text-orange-600 group-hover:translate-x-1 transition-transform">
              <span>Configurar eletros</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Step 3 */}
          <div
            onClick={() => setActiveView('meal-moment')}
            className="cursor-pointer group rounded-2xl p-4 bg-rose-50/60 hover:bg-rose-100/60 border border-rose-200/60 transition-all space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-800 flex items-center justify-center text-xl font-bold">
              ⚡
            </div>
            <div>
              <span className="text-[11px] font-black text-rose-700 uppercase">Passo 3</span>
              <h3 className="font-extrabold text-stone-900 text-base">Escolha seu esforço</h3>
              <p className="text-xs text-stone-600 mt-1">
                Defina se quer algo <strong>Rápido</strong>, <strong>Prático</strong> ou <strong>Incrementado</strong>.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-[11px] font-bold text-orange-600 group-hover:translate-x-1 transition-transform">
              <span>Escolher estilo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Step 4 */}
          <div
            onClick={() => setActiveView('wheel')}
            className="cursor-pointer group rounded-2xl p-4 bg-emerald-50/60 hover:bg-emerald-100/60 border border-emerald-200/60 transition-all space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-800 flex items-center justify-center text-xl font-bold">
              🎡
            </div>
            <div>
              <span className="text-[11px] font-black text-emerald-700 uppercase">Passo 4</span>
              <h3 className="font-extrabold text-stone-900 text-base">Gire as receitas</h3>
              <p className="text-xs text-stone-600 mt-1">
                A Roleta da Fome escolhe entre as receitas compatíveis e você cozinha sem estresse.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1 text-[11px] font-bold text-orange-600 group-hover:translate-x-1 transition-transform">
              <span>Girar receitas</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Grid: Favorites & Past Cooked */}
      {(favorites.length > 0 || history.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Favorite Highlights */}
          {favorites.length > 0 && (
            <div className="bg-white rounded-3xl p-5 border border-amber-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <h3 className="font-extrabold text-stone-900 text-sm">Seus Favoritos Recentes</h3>
                </div>
                <button
                  onClick={() => setActiveView('favorites')}
                  className="text-xs font-bold text-orange-600 hover:underline"
                >
                  Ver todos ({favorites.length})
                </button>
              </div>

              <div className="space-y-2">
                {favorites.slice(0, 2).map(f => (
                  <div
                    key={f.recipe.id}
                    onClick={() => {
                      setSelectedRecipe(f.recipe);
                      setActiveView('recipe');
                    }}
                    className="p-3 rounded-2xl bg-amber-50/40 hover:bg-amber-100/40 border border-amber-100 cursor-pointer flex items-center justify-between gap-2 transition-colors"
                  >
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">{f.recipe.title}</h4>
                      <p className="text-xs text-stone-500">
                        ⏱️ {f.recipe.prepTimeMinutes} min • {f.recipe.difficulty}
                      </p>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-white text-orange-600 shadow-2xs">
                      Ver
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past History Highlights */}
          {history.length > 0 && (
            <div className="bg-white rounded-3xl p-5 border border-amber-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <h3 className="font-extrabold text-stone-900 text-sm">Preparados Recentemente</h3>
                </div>
                <button
                  onClick={() => setActiveView('history')}
                  className="text-xs font-bold text-orange-600 hover:underline"
                >
                  Ver histórico ({history.length})
                </button>
              </div>

              <div className="space-y-2">
                {history.slice(0, 2).map(h => (
                  <div
                    key={h.id}
                    onClick={() => {
                      setSelectedRecipe(h.recipe);
                      setActiveView('recipe');
                    }}
                    className="p-3 rounded-2xl bg-stone-50 hover:bg-stone-100/80 border border-stone-200/60 cursor-pointer flex items-center justify-between gap-2 transition-colors"
                  >
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">{h.recipe.title}</h4>
                      <p className="text-xs text-stone-500">
                        Feito em {new Date(h.cookedAt).toLocaleDateString('pt-BR')} • ⭐ {h.rating || 5}/5
                      </p>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-white text-stone-700 shadow-2xs">
                      Refazer
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
