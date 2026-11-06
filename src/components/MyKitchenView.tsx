import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Check, Plus, ShieldCheck, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export const MyKitchenView: React.FC = () => {
  const {
    appliances,
    selectedApplianceIds,
    toggleAppliance,
    addCustomAppliance,
    setActiveView,
  } = useApp();

  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmoji, setCustomEmoji] = useState('🍳');

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customName.trim()) {
      addCustomAppliance(customName.trim(), customEmoji || '🍳');
      setCustomName('');
      setIsAddingCustom(false);
    }
  };

  return (
    <div className="space-y-6 pb-3 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
              <span>🏠</span>
              <span>Regra de Ouro do GuessFood</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 font-['Outfit']">
              Minha Cozinha
            </h1>
            <p className="text-sm text-stone-600 mt-1 max-w-xl">
              Marque os equipamentos e eletrodomésticos que você tem em casa. 
              <strong> Nunca sugeriremos uma receita que dependa de um equipamento que você não marcou.</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-2xl text-emerald-800 text-xs font-bold shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Salvo automaticamente no seu dispositivo</span>
          </div>
        </div>
      </div>

      {/* Appliances Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {appliances.map(appliance => {
          const isSelected = selectedApplianceIds.includes(appliance.id);

          return (
            <button
              key={appliance.id}
              onClick={() => toggleAppliance(appliance.id)}
              type="button"
              className={`text-left p-4 rounded-2xl border-2 transition-all relative flex flex-col justify-between group active:scale-[0.98] ${
                isSelected
                  ? 'bg-amber-50/70 border-orange-500 shadow-md shadow-orange-500/10'
                  : 'bg-white border-stone-200/80 hover:border-stone-300 opacity-75 hover:opacity-100'
              }`}
            >
              {/* Top Row: Icon + Checkbox Badge */}
              <div className="flex items-start justify-between gap-2">
                <span className="text-3xl group-hover:scale-110 transition-transform">
                  {appliance.icon}
                </span>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                    isSelected
                      ? 'bg-orange-500 border-orange-600 text-white'
                      : 'border-stone-300 bg-stone-100 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              {/* Bottom Row: Name & description */}
              <div className="mt-3">
                <h3 className={`font-black text-base ${isSelected ? 'text-stone-900' : 'text-stone-700'}`}>
                  {appliance.name}
                </h3>
                <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                  {appliance.description}
                </p>
              </div>

              {/* Custom badge */}
              {appliance.isCustom && (
                <span className="absolute top-2 right-9 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-stone-200 text-stone-700">
                  Personalizado
                </span>
              )}
            </button>
          );
        })}

        {/* Add Custom Appliance Card / Button */}
        {!isAddingCustom ? (
          <button
            onClick={() => setIsAddingCustom(true)}
            type="button"
            className="p-5 rounded-2xl border-2 border-dashed border-stone-300 hover:border-orange-400 bg-stone-50/60 hover:bg-orange-50/40 text-stone-600 hover:text-orange-700 transition-all flex flex-col items-center justify-center text-center gap-2 min-h-[110px]"
          >
            <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-stone-700">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm block">Adicionar outro eletro</span>
              <span className="text-[11px] text-stone-500">Ex: Mixer, Grill, Forno elétrico</span>
            </div>
          </button>
        ) : (
          <form
            onSubmit={handleAddCustom}
            className="p-4 rounded-2xl border-2 border-orange-300 bg-orange-50/50 flex flex-col justify-between gap-3"
          >
            <span className="text-xs font-bold text-orange-800">Novo Equipamento</span>
            <div className="flex gap-2">
              <input
                type="text"
                value={customEmoji}
                onChange={e => setCustomEmoji(e.target.value)}
                maxLength={2}
                className="w-12 text-center text-xl bg-white border border-stone-300 rounded-xl py-1.5 focus:outline-orange-500"
                title="Emoji"
              />
              <input
                type="text"
                placeholder="Nome (ex: Mixer)"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                autoFocus
                className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-sm focus:outline-orange-500 font-medium"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setIsAddingCustom(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-200/60"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!customName.trim()}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
              >
                Salvar
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Confirmation & Next step bar */}
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-amber-900 font-medium">
          <span className="text-xl">✅</span>
          <span>
            <strong>{selectedApplianceIds.length} equipamentos</strong> prontos para cozinhar. Suas receitas serão 100% compatíveis.
          </span>
        </div>

        <button
          onClick={() => setActiveView('ingredients')}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-black text-sm shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 transition-all"
        >
          <span>Avançar para Ingredientes</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
