import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { getIngredientEmoji } from '../utils/foodIcons';
import {
  Mic,
  MicOff,
  Sparkles,
  Plus,
  X,
  Trash2,
  ArrowRight,
  Zap,
  Check,
  RotateCcw,
  Volume2,
  Keyboard,
  Edit2,
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

  // Voice Recognition states
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedMessage, setConfirmedMessage] = useState<string | null>(null);

  // Manual fallback input
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualText, setManualText] = useState('');
  const [singleInput, setSingleInput] = useState('');

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Web Speech API availability
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      setShowManualInput(true);
    }
  }, []);

  const startListening = () => {
    setSpeechError(null);
    setConfirmedMessage(null);
    setTranscript('');

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      setShowManualInput(true);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setSpeechError('Permissão de microfone negada. Você pode digitar abaixo.');
          setShowManualInput(true);
        } else if (event.error === 'no-speech') {
          setSpeechError('Não ouvimos nada. Tente falar um pouco mais perto do microfone.');
        } else {
          setSpeechError('Erro ao capturar áudio. Digite seus ingredientes abaixo.');
          setShowManualInput(true);
        }
      };

      recognition.onend = async () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Speech initialization error:', err);
      setIsSpeechSupported(false);
      setShowManualInput(true);
    }
  };

  const stopListeningAndProcess = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);

    if (transcript.trim()) {
      await processTranscribedText(transcript);
    }
  };

  // Watch transcript after speech ends or user finishes
  useEffect(() => {
    if (!isListening && transcript.trim() && !isProcessing) {
      processTranscribedText(transcript);
    }
  }, [isListening]);

  const processTranscribedText = async (textToProcess: string) => {
    setIsProcessing(true);
    setConfirmedMessage(null);
    try {
      const count = await parseAndAddIngredientsFromText(textToProcess);
      setConfirmedMessage(
        count > 0
          ? `Entendi! Encontrei estes ${count} ingredientes na sua cozinha:`
          : 'Ingredientes adicionados com sucesso!'
      );
      setTranscript('');
    } catch (e) {
      console.warn(e);
    } finally {
      setIsProcessing(false);
    }
  };

  // Manual free text
  const handleManualTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) return;
    setIsProcessing(true);
    await processTranscribedText(manualText);
    setManualText('');
  };

  // Single manual item addition
  const handleAddSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (singleInput.trim()) {
      addIngredient(singleInput.trim());
      setSingleInput('');
      setConfirmedMessage('Ingrediente adicionado!');
      setTimeout(() => setConfirmedMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6 pb-3 max-w-3xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Você conta o que tem. O GuessFood faz o resto.</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-stone-900 font-['Outfit']">
          🎤 Conte o que você tem na sua cozinha
        </h1>

        <p className="text-sm sm:text-base text-stone-600 max-w-lg mx-auto font-medium">
          Não precisa digitar tudo. Aperte o microfone e conte o que você está vendo na geladeira, no armário ou na sua cozinha.
        </p>

        {/* Big Voice Button & Audio Wave Animation */}
        <div className="pt-2 flex flex-col items-center justify-center">
          {!isListening ? (
            <button
              onClick={startListening}
              disabled={isProcessing}
              className="group relative px-8 py-5 rounded-3xl bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 hover:brightness-110 active:scale-95 text-white font-black text-lg sm:text-xl shadow-2xl shadow-orange-500/35 transition-all flex items-center justify-center gap-3.5 cursor-pointer disabled:opacity-50"
            >
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <span>CONTAR O QUE EU TENHO</span>
            </button>
          ) : (
            <div className="flex flex-col items-center gap-3">
              {/* Pulsing microphone */}
              <button
                onClick={stopListeningAndProcess}
                className="relative w-24 h-24 rounded-full bg-red-500 text-white flex items-center justify-center shadow-2xl shadow-red-500/50 cursor-pointer animate-pulse"
              >
                <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-40 pointer-events-none" />
                <Mic className="w-10 h-10 animate-bounce" />
              </button>

              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                  🔴 Ouvindo... Fale naturalmente!
                </span>
                <p className="text-xs text-stone-400">Toque no microfone para concluir</p>
              </div>
            </div>
          )}

          {/* Example cue */}
          <div className="pt-3 text-xs text-stone-500 italic max-w-md">
            &ldquo;Ex: Tenho ovos, queijo, tomate, um pouco de frango. No armário tenho arroz, macarrão e cebola.&rdquo;
          </div>
        </div>

        {/* Real-time speech transcript feedback */}
        {isListening && transcript && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-stone-800 text-sm font-medium animate-in fade-in">
            <span className="text-xs font-bold text-orange-700 block uppercase mb-1">
              Transcrição ao vivo:
            </span>
            &ldquo;{transcript}&rdquo;
          </div>
        )}

        {isProcessing && (
          <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-orange-900 text-xs sm:text-sm font-bold flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 animate-spin text-orange-600" />
            <span>Identificando e organizando seus ingredientes...</span>
          </div>
        )}

        {speechError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold text-center">
            {speechError}
          </div>
        )}

        {/* Fallback button to show typing field */}
        <div className="pt-1">
          <button
            onClick={() => setShowManualInput(!showManualInput)}
            className="text-xs font-bold text-stone-500 hover:text-stone-800 underline inline-flex items-center gap-1"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>{showManualInput ? 'Ocultar digitação' : 'Prefere digitar com teclado? Clique aqui'}</span>
          </button>
        </div>

        {/* Manual typing fallback */}
        {showManualInput && (
          <form
            onSubmit={handleManualTextSubmit}
            className="pt-2 text-left space-y-2 border-t border-stone-100"
          >
            <label className="text-xs font-bold text-stone-700">
              Escreva o que você tem na cozinha:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualText}
                onChange={e => setManualText(e.target.value)}
                placeholder="Ex: Tenho ovos, queijo, tomate, frango desfiado e arroz..."
                className="flex-1 p-3 rounded-2xl border border-stone-200 bg-stone-50 text-sm focus:outline-orange-500 font-medium"
              />
              <button
                type="submit"
                disabled={!manualText.trim()}
                className="px-5 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shrink-0 disabled:opacity-40"
              >
                Organizar
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Confirmation & Registered Ingredients List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              {confirmedMessage || 'Sua Despensa Atual'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-['Outfit']">
              Ingredientes na sua cozinha ({pantryIngredients.length})
            </h2>
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
          <div className="py-10 text-center text-stone-400 space-y-2 border-2 border-dashed border-stone-200 rounded-3xl">
            <span className="text-4xl block">🧺</span>
            <p className="text-base font-bold text-stone-700">
              Nenhum ingrediente informado ainda.
            </p>
            <p className="text-xs max-w-sm mx-auto">
              Aperte o botão <strong>&ldquo;CONTAR O QUE EU TENHO&rdquo;</strong> acima e fale o que você tem na geladeira!
            </p>
          </div>
        ) : (
          /* Visual Cards with Food Emojis */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {pantryIngredients.map(item => {
              const emoji = getIngredientEmoji(item);

              return (
                <div
                  key={item}
                  className="group p-3 rounded-2xl bg-amber-50/50 hover:bg-amber-100/60 border border-amber-200/80 flex items-center justify-between gap-2 shadow-2xs hover:shadow-xs transition-all"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-2xl shrink-0">{emoji}</span>
                    <span className="font-extrabold text-stone-800 text-sm truncate">
                      {item}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeIngredient(item)}
                    className="w-6 h-6 rounded-full bg-stone-200/70 hover:bg-red-500 hover:text-white text-stone-600 flex items-center justify-center transition-colors shrink-0"
                    title={`Remover ${item}`}
                  >
                    <X className="w-3 h-3 stroke-[2.5]" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Simple single item addition field */}
        <form
          onSubmit={handleAddSingle}
          className="pt-2 flex items-center gap-2 border-t border-stone-100"
        >
          <input
            type="text"
            value={singleInput}
            onChange={e => setSingleInput(e.target.value)}
            placeholder="+ Adicionar outro ingrediente manualmente (ex: Batata)"
            className="flex-1 p-2.5 rounded-xl border border-stone-200 bg-stone-50/70 text-xs sm:text-sm font-medium focus:outline-orange-500"
          />
          <button
            type="submit"
            disabled={!singleInput.trim()}
            className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white font-bold text-xs shrink-0 flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar</span>
          </button>
        </form>
      </div>

      {/* Bottom Action: Advance to Cooking Effort Choice */}
      <div className="bg-stone-900 text-white rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-black text-base">Tudo pronto com seus ingredientes?</h4>
          <p className="text-xs text-stone-300">
            {pantryIngredients.length === 0
              ? 'Fale ou adicione ao menos 1 item para continuar.'
              : `${pantryIngredients.length} ingredientes identificados e prontos.`}
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

          {/* Continue to Effort Choice */}
          <button
            onClick={() => setActiveView('meal-moment')}
            disabled={pantryIngredients.length === 0}
            className="flex-1 sm:flex-initial px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-95 disabled:opacity-40 text-white font-black text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Escolher Como Cozinhar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
