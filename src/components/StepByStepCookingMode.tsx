import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { playCelebrationSound } from '../utils/audio';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Star,
  Award,
} from 'lucide-react';

export const StepByStepCookingMode: React.FC = () => {
  const { selectedRecipe, setActiveView, markAsCooked } = useApp();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [rating, setRating] = useState(5);
  const [isFinished, setIsFinished] = useState(false);

  // Timer state for current step
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const steps = selectedRecipe?.steps || [];
  const currentStep = steps[currentStepIndex];

  // Initialize timer whenever step changes
  useEffect(() => {
    if (currentStep && currentStep.timerMinutes) {
      setTimeLeftSeconds(currentStep.timerMinutes * 60);
      setIsTimerRunning(false);
    } else {
      setTimeLeftSeconds(0);
      setIsTimerRunning(false);
    }
  }, [currentStepIndex, currentStep]);

  // Countdown effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeftSeconds > 0) {
      interval = setInterval(() => {
        setTimeLeftSeconds(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsTimerRunning(false);
            playCelebrationSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeftSeconds]);

  if (!selectedRecipe || steps.length === 0) {
    return null;
  }

  const toggleStepCompleted = (index: number) => {
    setCompletedSteps(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleNext = () => {
    if (!completedSteps.includes(currentStepIndex)) {
      setCompletedSteps(prev => [...prev, currentStepIndex]);
    }
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
      playCelebrationSound();
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
      });
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleFinishCooking = () => {
    markAsCooked(selectedRecipe, rating);
    setActiveView('recipe');
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900 text-white flex flex-col justify-between p-4 sm:p-8 overflow-y-auto animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="max-w-3xl mx-auto w-full flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
            Modo Cozinheiro Ativo
          </span>
          <h2 className="text-lg sm:text-xl font-black text-white font-['Outfit'] truncate max-w-xs sm:max-w-md">
            {selectedRecipe.title}
          </h2>
        </div>

        <button
          onClick={() => setActiveView('recipe')}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          title="Sair do modo cozinheiro"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="max-w-2xl mx-auto w-full my-auto py-6 space-y-6">
        {!isFinished ? (
          <>
            {/* Step Counter Badge */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                Passo {currentStepIndex + 1} de {steps.length}
              </span>

              {/* Progress bar */}
              <div className="w-32 h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-orange-500 transition-all duration-300"
                  style={{
                    width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Big Step Title & Description */}
            <div className="bg-white/5 rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
              <h1 className="text-2xl sm:text-4xl font-black text-white font-['Outfit'] leading-tight">
                {currentStep.title}
              </h1>

              <p className="text-lg sm:text-2xl text-stone-300 leading-relaxed font-medium">
                {currentStep.description}
              </p>

              {/* Optional Timer Box if step has duration */}
              {currentStep.timerMinutes && (
                <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-orange-500/10 p-4 rounded-2xl border border-orange-500/20">
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-orange-400" />
                    <div>
                      <span className="text-xs text-stone-400 uppercase font-bold block">
                        Timer Recomendado
                      </span>
                      <span className="text-3xl font-mono font-black text-amber-300">
                        {formatTime(timeLeftSeconds)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                    >
                      {isTimerRunning ? (
                        <>
                          <Pause className="w-4 h-4" />
                          <span>Pausar</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" />
                          <span>Iniciar Timer</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setIsTimerRunning(false);
                        setTimeLeftSeconds((currentStep.timerMinutes || 0) * 60);
                      }}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 text-xs"
                      title="Reiniciar timer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Checkbox "Passo concluído" */}
            <button
              onClick={() => toggleStepCompleted(currentStepIndex)}
              className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-3 transition-colors cursor-pointer"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                  completedSteps.includes(currentStepIndex)
                    ? 'bg-emerald-500 border-emerald-400 text-white'
                    : 'border-white/40 text-transparent'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 stroke-[3]" />
              </div>
              <span className="text-sm font-bold text-stone-200">
                {completedSteps.includes(currentStepIndex)
                  ? 'Passo concluído!'
                  : 'Marcar passo como concluído'}
              </span>
            </button>
          </>
        ) : (
          /* Finished Cooking Celebration */
          <div className="bg-white/5 rounded-3xl p-8 border border-white/10 text-center space-y-6">
            <span className="text-6xl block animate-bounce">🎉</span>

            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-black font-['Outfit'] text-amber-400">
                Prato Pronto! Bom Apetite!
              </h2>
              <p className="text-base text-stone-300">
                Você preparou com sucesso <strong>{selectedRecipe.title}</strong> usando exatamente o que tinha em casa.
              </p>
            </div>

            {/* Rating Stars */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
                Como ficou sua comida?
              </span>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-125"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-stone-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleFinishCooking}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 active:scale-95 text-white font-black text-base shadow-xl shadow-orange-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Award className="w-5 h-5" />
              <span>Concluir e Salvar no Histórico</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Step Navigation Bar */}
      {!isFinished && (
        <div className="max-w-2xl mx-auto w-full pt-4 border-t border-white/10 flex items-center justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-bold text-xs sm:text-sm flex items-center gap-1 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          <button
            onClick={handleNext}
            className="px-8 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-black text-xs sm:text-sm shadow-lg shadow-orange-500/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>
              {currentStepIndex === steps.length - 1
                ? 'Finalizar Refeição 🎉'
                : 'Próximo Passo'}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
