import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { playCelebrationSound } from '../utils/audio';
import {
  X,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Crown,
  Heart,
  Disc,
} from 'lucide-react';

export const UpgradeModal: React.FC = () => {
  const { isUpgradeModalOpen, setIsUpgradeModalOpen, upgradeToLifetime, isLifetime } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isUpgradeModalOpen) return null;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      upgradeToLifetime();
      setIsProcessing(false);
      playCelebrationSound();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
      });
    }, 1200);
  };

  const benefits = [
    '✓ Receitas ilimitadas geradas por IA',
    '✓ Roleta da Fome sem restrição de giros',
    '✓ Modo instantâneo "Estou com Fome. Decide por mim!"',
    '✓ Salvar receitas favoritas sem limites',
    '✓ Histórico culinário vitalício e notas pessoais',
    '✓ Minha Cozinha com eletrodomésticos personalizados',
    '✓ Sem mensalidades: você paga uma única vez e usa para sempre',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-200 space-y-6 text-stone-900 animate-in zoom-in-95 duration-200">
        <button
          onClick={() => setIsUpgradeModalOpen(false)}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-3xl shadow-lg shadow-orange-500/25">
            👑
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider">
            <span>Acesso Vitalício</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-stone-900">
            GuessFood Vitalício
          </h2>

          <p className="text-xs sm:text-sm text-stone-500 max-w-xs mx-auto">
            Nunca mais passe meia hora olhando a geladeira sem saber o que cozinhar.
          </p>
        </div>

        {/* Pricing Box */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-center space-y-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-widest block">
            Oferta Especial de Lançamento
          </span>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-sm font-black text-stone-600">R$</span>
            <span className="text-4xl font-black text-stone-900 font-['Outfit']">11,90</span>
            <span className="text-xs font-bold text-stone-500">/ pagamento único</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block mt-1">
            Sem mensalidades futuras
          </span>
        </div>

        {/* Benefits List */}
        <div className="space-y-2.5">
          {benefits.map((b, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs font-semibold text-stone-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{b.replace('✓ ', '')}</span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        {isLifetime ? (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black text-center">
            🎉 Você já possui o Acesso Vitalício ativo!
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={handleSimulatePayment}
              disabled={isProcessing}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 hover:brightness-110 active:scale-95 text-white font-black text-base shadow-xl shadow-orange-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Crown className="w-5 h-5 text-yellow-300" />
              <span>
                {isProcessing ? 'Processando Ativação...' : 'ATIVAR ACESSO VITALÍCIO — R$ 11,90'}
              </span>
            </button>
            <p className="text-[11px] text-center text-stone-400">
              🔒 Pagamento simulado com liberação imediata nesta versão MVP.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
