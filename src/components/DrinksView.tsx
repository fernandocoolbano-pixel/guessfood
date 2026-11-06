import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { getIngredientEmoji } from '../utils/foodIcons';
import { DrinkTemplate } from '../data/smartRecipes';
import {
  Mic,
  Sparkles,
  Plus,
  X,
  Trash2,
  ArrowRight,
  GlassWater,
  Keyboard,
  Clock,
  Wine,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playCelebrationSound } from '../utils/audio';

export const DrinksView: React.FC = () => {
  const {
    drinkIngredients,
    addDrinkIngredient,
    removeDrinkIngredient,
    clearDrinkIngredients,
    parseAndAddDrinkIngredientsFromText,
    generateDrinksFlow,
    drinkRecipes,
    selectedDrink,
    setSelectedDrink,
  } = useApp();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [manualText, setManualText] = useState('');
  const [singleInput, setSingleInput] = useState('');
  const [activeDrinkModal, setActiveDrinkModal] = useState<DrinkTemplate | null>(null);

  const recognitionRef = useRef<any>(null);

  // Generate initial drinks suggestions
  useEffect(() => {
    generateDrinksFlow();
  }, [drinkIngredients.length]);

  const startVoiceInput = () => {
    setTranscript('');
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setShowManual(true);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.interimResults = true;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (e: any) => {
        let text = '';
        for (let i = 0; i < e.results.length; i++) {
          text += e.results[i][0].transcript;
        }
        setTranscript(text);
      };
      recognition.onerror = () => {
        setIsListening(false);
        setShowManual(true);
      };
      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setShowManual(true);
    }
  };

  const stopVoiceInput = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    if (transcript.trim()) {
      await handleProcessText(transcript);
    }
  };

  useEffect(() => {
    if (!isListening && transcript.trim() && !isProcessing) {
      handleProcessText(transcript);
    }
  }, [isListening]);

  const handleProcessText = async (text: string) => {
    setIsProcessing(true);
    try {
      await parseAndAddDrinkIngredientsFromText(text);
      setTranscript('');
      generateDrinksFlow();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) return;
    await handleProcessText(manualText);
    setManualText('');
  };

  const handleSingleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (singleInput.trim()) {
      addDrinkIngredient(singleInput.trim());
      setSingleInput('');
      generateDrinksFlow();
    }
  };

  const openDrink = (drink: DrinkTemplate) => {
    setActiveDrinkModal(drink);
    playCelebrationSound();
  };

  return (
    <div className="space-y-6 pb-3 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-900 via-indigo-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-4 relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-pink-300 text-xs font-black uppercase tracking-wider border border-white/10">
          <span>🍸 Bar do GuessFood</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black font-['Outfit'] tracking-tight">
          🎤 Conte o que você tem para beber
        </h1>

        <p className="text-sm sm:text-base text-purple-200 max-w-lg mx-auto font-medium">
          Conte o que você tem no bar, na geladeira ou no armário. O GuessFood organiza tudo para você.
        </p>

        {/* Big Voice Button */}
        <div className="pt-2 flex flex-col items-center justify-center">
          {!isListening ? (
            <button
              onClick={startVoiceInput}
              disabled={isProcessing}
              className="px-8 py-5 rounded-3xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:brightness-110 active:scale-95 text-white font-black text-lg sm:text-xl shadow-2xl shadow-pink-500/30 flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50"
            >
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <span>CONTAR O QUE EU TENHO</span>
            </button>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={stopVoiceInput}
                className="w-20 h-20 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-2xl shadow-pink-500/50 cursor-pointer animate-pulse"
              >
                <Mic className="w-9 h-9" />
              </button>
              <span className="text-xs font-black text-pink-300 bg-pink-950/80 px-3 py-1 rounded-full border border-pink-500/40">
                🔴 Ouvindo seus drinks... Toque para finalizar!
              </span>
            </div>
          )}

          <div className="pt-3 text-xs text-purple-300 italic max-w-md">
            &ldquo;Ex: Tenho vodka, limão, água com gás, açúcar e morango.&rdquo;
          </div>
        </div>

        {isListening && transcript && (
          <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 text-xs text-stone-200 max-w-md mx-auto">
            &ldquo;{transcript}&rdquo;
          </div>
        )}

        {isProcessing && (
          <div className="p-3 rounded-2xl bg-white/10 text-xs font-bold text-pink-200 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Identificando bebidas e complementos...</span>
          </div>
        )}

        {/* Toggle Manual input */}
        <div className="pt-1">
          <button
            onClick={() => setShowManual(!showManual)}
            className="text-xs text-purple-300 hover:text-white underline inline-flex items-center gap-1 font-medium"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>{showManual ? 'Ocultar digitação' : 'Digitar ingredientes do bar manualmente'}</span>
          </button>
        </div>

        {showManual && (
          <form
            onSubmit={handleManualSubmit}
            className="pt-2 text-left max-w-md mx-auto flex gap-2"
          >
            <input
              type="text"
              value={manualText}
              onChange={e => setManualText(e.target.value)}
              placeholder="Ex: Gin, limão, tônica e gelo..."
              className="flex-1 p-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-purple-300/60 text-xs focus:outline-pink-400"
            />
            <button
              type="submit"
              disabled={!manualText.trim()}
              className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs"
            >
              Organizar
            </button>
          </form>
        )}
      </div>

      {/* Bar Pantry Items (Emoji list) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
              Seu Bar Pessoal
            </span>
            <h2 className="text-xl font-black text-stone-900 font-['Outfit']">
              Ingredientes de drinks ({drinkIngredients.length})
            </h2>
          </div>

          {drinkIngredients.length > 0 && (
            <button
              onClick={clearDrinkIngredients}
              className="text-xs font-bold text-stone-400 hover:text-red-600 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>
          )}
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {drinkIngredients.map(item => {
            const emoji = getIngredientEmoji(item);

            return (
              <div
                key={item}
                className="p-2.5 rounded-2xl bg-purple-50/60 hover:bg-purple-100/70 border border-purple-200/80 flex items-center justify-between gap-2 shadow-2xs transition-all"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-xl">{emoji}</span>
                  <span className="font-extrabold text-stone-800 text-xs truncate">
                    {item}
                  </span>
                </div>

                <button
                  onClick={() => removeDrinkIngredient(item)}
                  className="w-5 h-5 rounded-full hover:bg-red-500 hover:text-white text-stone-400 flex items-center justify-center transition-colors"
                >
                  <X className="w-3 h-3 stroke-[2.5]" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Single item input */}
        <form onSubmit={handleSingleAdd} className="pt-2 flex items-center gap-2 border-t border-stone-100">
          <input
            type="text"
            value={singleInput}
            onChange={e => setSingleInput(e.target.value)}
            placeholder="+ Adicionar item (ex: Hortelã, Xarope, Cachaça)"
            className="flex-1 p-2.5 rounded-xl border border-stone-200 bg-stone-50/70 text-xs font-medium focus:outline-purple-500"
          />
          <button
            type="submit"
            disabled={!singleInput.trim()}
            className="px-4 py-2.5 rounded-xl bg-purple-950 text-white font-bold text-xs flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar</span>
          </button>
        </form>
      </div>

      {/* Suggested Drinks Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm space-y-5">
        <div className="space-y-1">
          <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">
            Cardápio de Drinks Compatíveis
          </span>
          <h2 className="text-2xl font-black text-stone-900 font-['Outfit']">
            Receitas de Drinks para Fazer Agora
          </h2>
          <p className="text-xs text-stone-500">
            Criadas ou adaptadas sob medida com o que você possui no bar:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {drinkRecipes.map(drink => (
            <div
              key={drink.id}
              onClick={() => openDrink(drink)}
              className="p-5 rounded-2xl bg-gradient-to-br from-purple-50/60 to-pink-50/40 hover:from-purple-100/70 hover:to-pink-100/60 border border-purple-200/80 transition-all cursor-pointer flex flex-col justify-between space-y-3 group shadow-2xs hover:shadow-md"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      drink.isAlcoholic
                        ? 'bg-purple-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {drink.isAlcoholic ? 'Alcoólico' : 'Sem Álcool'}
                  </span>
                  <span className="text-xs text-stone-500 font-bold">
                    ⏱️ {drink.prepTimeMinutes} min
                  </span>
                </div>

                <h3 className="font-black text-lg text-stone-900 font-['Outfit'] group-hover:text-purple-700 transition-colors">
                  {drink.title}
                </h3>

                <p className="text-xs text-stone-600 line-clamp-2">
                  {drink.description}
                </p>
              </div>

              <div className="pt-2 border-t border-purple-200/60 flex items-center justify-between text-xs font-bold text-stone-700">
                <span className="text-stone-500 truncate max-w-[160px]">
                  🥂 {drink.glassware}
                </span>

                <span className="text-pink-600 font-black inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Ver receita</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Drink Detail Modal */}
      {activeDrinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-purple-200 space-y-5 text-stone-900 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveDrinkModal(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span
                className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                  activeDrinkModal.isAlcoholic
                    ? 'bg-purple-600 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {activeDrinkModal.isAlcoholic ? 'Cocktail Alcoólico' : 'Sem Álcool'}
              </span>

              <h2 className="text-2xl font-black text-stone-900 font-['Outfit'] pt-1">
                {activeDrinkModal.title}
              </h2>

              <p className="text-xs text-stone-600">
                {activeDrinkModal.description}
              </p>
            </div>

            {/* Quick Specs */}
            <div className="flex gap-2 text-xs font-bold">
              <span className="px-3 py-1 rounded-xl bg-purple-50 text-purple-900 border border-purple-200">
                ⏱️ {activeDrinkModal.prepTimeMinutes} minutos
              </span>
              <span className="px-3 py-1 rounded-xl bg-purple-50 text-purple-900 border border-purple-200">
                🥂 {activeDrinkModal.glassware}
              </span>
            </div>

            {/* Steps */}
            <div className="space-y-3 pt-2">
              <h3 className="font-black text-base text-stone-900">Como preparar:</h3>
              <div className="space-y-2.5">
                {activeDrinkModal.steps.map((s, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="space-y-0.5">
                      <h4 className="font-extrabold text-sm text-stone-900">{s.title}</h4>
                      <p className="text-xs text-stone-600">{s.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bartender Tip */}
            {activeDrinkModal.bartenderTip && (
              <div className="p-3.5 rounded-2xl bg-pink-50 border border-pink-200 text-pink-950 text-xs">
                <strong>💡 Dica do Bartender:</strong> {activeDrinkModal.bartenderTip}
              </div>
            )}

            <button
              onClick={() => setActiveDrinkModal(null)}
              className="w-full py-3.5 rounded-2xl bg-purple-900 hover:bg-purple-950 text-white font-black text-sm transition-all"
            >
              Fechar Receita
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
