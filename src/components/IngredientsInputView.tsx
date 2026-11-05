import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { COMMON_PANTRY_SUGGESTIONS } from '../data/kitchenAppliances';
import {
  Sparkles,
  Plus,
  X,
  Trash2,
  ArrowRight,
  Zap,
  Refrigerator,
  Check,
  Wand2,
} from 'lucide-react';

export const IngredientsInputView: React.FC = () => {
  const {
    pantryIngredients,
    addIngredient,
    removeIngredient,
    clearIngredients,
    parseAndAddIngredientsFromText,
    setActiveView,
    setIsDecideForMeModalOpen,
  } = useApp();

  const [freeText, setFreeText] = useState('');
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [interpretFeedback, setInterpretFeedback] = useState<string | null>(null);

  const [singleInput, setSingleInput] = useState('');

  const handleInterpretFreeText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!freeText.trim()) return;

    setIsInterpreting(true);
    setInterpretFeedback(null);
    try {
      const count = await parseAndAddIngredientsFromText(freeText);
      setFreeText('');
      setInterpretFeedback(`✨ Encontramos e adicionamos ${count} itens à sua despensa!`);
      setTimeout(() => setInterpretFeedback(null), 4000);
    } catch (err) {
      setInterpretFeedback('Não foi possível interpretar o texto no momento.');
    } finally {
      setIsInterpreting(false);
    }
  };

  const handleAddSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (singleInput.trim()) {
      addIngredient(singleInput.trim());
      setSingleInput('');
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Title Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
          <Refrigerator className="w-3.5 h-3.5" />
          <span>Passo 1 do Planejador</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-stone-900 font-['Outfit']">
          🧺 O que você tem em casa hoje?
        </h1>

        <p className="text-sm text-stone-600 max-w-xl">
          Abra a geladeira e os armários. Não precisa ser muito chique: o GuessFood combina suas sobras, ovos, queijo ou qualquer ingrediente em uma receita viável e saborosa.
        </p>
      </div>

      {/* Dual Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* OPÇÃO 1 — DIGITAÇÃO LIVRE */}
        <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-orange-600 tracking-wider">
                Opção 1
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                IA Inteligente
              </span>
            </div>
            <h3 className="text-lg font-black text-stone-900 font-['Outfit']">
              Escrever com suas próprias palavras
            </h3>
            <p className="text-xs text-stone-500">
              Escreva como fala: &ldquo;Tenho arroz que sobrou de ontem, frango, ovos e queijo ralado.&rdquo;
            </p>
          </div>

          <form onSubmit={handleInterpretFreeText} className="space-y-3 flex-1 flex flex-col justify-between">
            <textarea
              rows={4}
              value={freeText}
              onChange={e => setFreeText(e.target.value)}
              placeholder="Ex: Tenho tomate, alho, um resto de frango desfiado, 2 ovos e requeijão..."
              className="w-full rounded-2xl border border-stone-200 bg-stone-50/70 p-3.5 text-sm focus:border-orange-500 focus:bg-white focus:outline-none transition-colors resize-none font-medium placeholder:text-stone-400"
            />

            {interpretFeedback && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{interpretFeedback}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isInterpreting || !freeText.trim()}
              className="w-full py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <Wand2 className={`w-4 h-4 ${isInterpreting ? 'animate-spin' : ''}`} />
              <span>
                {isInterpreting ? 'Interpretando com IA...' : 'Interpretar Ingredientes com IA'}
              </span>
            </button>
          </form>
        </div>

        {/* OPÇÃO 2 — ADICIONAR UM A UM / SUGESTÕES RÁPIDAS */}
        <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase text-orange-600 tracking-wider">
              Opção 2
            </span>
            <h3 className="text-lg font-black text-stone-900 font-['Outfit']">
              Adicionar ingredientes avulsos
            </h3>
            <p className="text-xs text-stone-500">
              Digite o nome ou toque nos alimentos mais comuns da geladeira:
            </p>
          </div>

          <form onSubmit={handleAddSingle} className="flex gap-2">
            <input
              type="text"
              value={singleInput}
              onChange={e => setSingleInput(e.target.value)}
              placeholder="Nome do alimento (ex: Batata)"
              className="flex-1 rounded-xl border border-stone-200 bg-stone-50/70 px-3.5 py-2.5 text-sm focus:border-orange-500 focus:bg-white focus:outline-none font-medium"
            />
            <button
              type="submit"
              disabled={!singleInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar</span>
            </button>
          </form>

          {/* Quick pantry tap badges */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Sugestões rápidas (toque para adicionar):
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
              {COMMON_PANTRY_SUGGESTIONS.map(s => {
                const alreadyHas = pantryIngredients.some(
                  p => p.toLowerCase() === s.name.toLowerCase()
                );
                return (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => addIngredient(s.name)}
                    disabled={alreadyHas}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                      alreadyHas
                        ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-default opacity-60'
                        : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-stone-800 active:scale-95'
                    }`}
                  >
                    <span>{s.icon}</span>
                    <span>{s.name}</span>
                    {!alreadyHas && <Plus className="w-3 h-3 text-orange-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Ingredients List (Etiquetas selecionadas) */}
      <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-stone-900 text-lg font-['Outfit']">
              Sua despensa atual ({pantryIngredients.length})
            </h3>
            {pantryIngredients.length > 0 && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Pronto para combinar!
              </span>
            )}
          </div>

          {pantryIngredients.length > 0 && (
            <button
              onClick={clearIngredients}
              className="text-xs font-bold text-stone-400 hover:text-red-600 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar tudo</span>
            </button>
          )}
        </div>

        {pantryIngredients.length === 0 ? (
          <div className="py-8 text-center text-stone-400 space-y-2 border-2 border-dashed border-stone-200 rounded-2xl">
            <span className="text-3xl block">🧺</span>
            <p className="text-sm font-bold">Nenhum ingrediente adicionado ainda.</p>
            <p className="text-xs">
              Digite acima ou clique nas sugestões rápidas para começar!
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {pantryIngredients.map(item => (
              <div
                key={item}
                className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200/80 shadow-2xs hover:shadow-xs transition-all"
              >
                <span className="font-extrabold text-stone-800 text-sm">{item}</span>
                <button
                  type="button"
                  onClick={() => removeIngredient(item)}
                  className="w-5 h-5 rounded-full bg-orange-200/60 group-hover:bg-red-500 group-hover:text-white text-stone-600 flex items-center justify-center transition-colors"
                  title={`Remover ${item}`}
                >
                  <X className="w-3 h-3 stroke-[2.5]" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Step Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-900 text-white rounded-3xl p-5 shadow-xl">
        <div>
          <h4 className="font-black text-base">Tudo pronto com os ingredientes?</h4>
          <p className="text-xs text-stone-300">
            {pantryIngredients.length === 0
              ? 'Adicione ao menos 1 item para o GuessFood encontrar opções.'
              : `${pantryIngredients.length} ingredientes prontos para o preparo.`}
          </p>
        </div>

        <div className="flex w-full sm:w-auto gap-2">
          {/* Quick Decide shortcut */}
          <button
            onClick={() => setIsDecideForMeModalOpen(true)}
            disabled={pantryIngredients.length === 0}
            className="flex-1 sm:flex-initial px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 disabled:opacity-40 text-yellow-300 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <Zap className="w-3.5 h-3.5 fill-yellow-300" />
            <span>Decidir Já!</span>
          </button>

          {/* Continue to Meal moment */}
          <button
            onClick={() => setActiveView('meal-moment')}
            disabled={pantryIngredients.length === 0}
            className="flex-1 sm:flex-initial px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-95 disabled:opacity-40 text-white font-black text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <span>Escolher Refeição</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
