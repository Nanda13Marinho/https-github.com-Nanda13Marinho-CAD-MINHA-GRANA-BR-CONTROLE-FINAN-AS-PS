import React, { useState } from "react";
import { Landmark, TrendingUp, Sparkles, ArrowRight } from "lucide-react";

interface InitialSetupViewProps {
  onComplete: (setup: { currency: "USD" | "BRL"; goalName: string; goalTarget: number }) => void;
  userEmail: string;
}

export default function InitialSetupView({ onComplete, userEmail }: InitialSetupViewProps) {
  const [step, setStep] = useState(1);
  const [currency, setCurrency] = useState<"USD" | "BRL">("BRL");
  const [goalName, setGoalName] = useState("");
  const [goalTarget, setGoalTarget] = useState<number>(10000);

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      if (!goalName) {
        alert("Por favor, defina um nome para sua primeira meta financeira.");
        return;
      }
      onComplete({
        currency,
        goalName,
        goalTarget: Number(goalTarget),
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#E0D8D0] flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background radial shine */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.04)_0%,transparent_60%)] pointer-events-none"></div>

      <div className="glass-card w-full max-w-lg rounded-3xl border border-white/10 p-8 space-y-6 relative overflow-hidden bg-[#0d0d0f] shadow-2xl">
        
        {/* Step Progress indicators */}
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest">
            Configuração Inicial Segura
          </span>
          <div className="flex gap-1.5">
            <div className={`w-6 h-1 rounded-full ${step >= 1 ? "bg-amber-500" : "bg-white/5"}`}></div>
            <div className={`w-6 h-1 rounded-full ${step >= 2 ? "bg-amber-500" : "bg-white/5"}`}></div>
          </div>
        </div>

        {/* Dynamic step rendering */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white font-sans">Escolha sua Moeda Principal</h3>
              <p className="text-sm text-white/40 leading-relaxed">
                A moeda selecionada será utilizada para consolidar todos os seus saldos, cartões de crédito e investimentos em uma única exibição premium.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <button
                onClick={() => setCurrency("BRL")}
                className={`p-6 rounded-2xl border flex flex-col items-center gap-3 transition-all cursor-pointer ${
                  currency === "BRL"
                    ? "bg-amber-500/10 border-amber-500 text-amber-500 shadow-lg shadow-amber-950/20"
                    : "bg-white/5 border-white/5 text-white/40 hover:text-white hover:border-white/10"
                }`}
              >
                <div className="text-3xl font-black font-sans">R$</div>
                <div className="text-center">
                  <p className="font-bold text-sm text-white">Real Brasileiro</p>
                  <p className="text-[10px] font-mono text-white/40 mt-1">BRL (R$)</p>
                </div>
              </button>

              <button
                onClick={() => setCurrency("USD")}
                className={`p-6 rounded-2xl border flex flex-col items-center gap-3 transition-all cursor-pointer ${
                  currency === "USD"
                    ? "bg-amber-500/10 border-amber-500 text-amber-500 shadow-lg shadow-amber-950/20"
                    : "bg-white/5 border-white/5 text-white/40 hover:text-white hover:border-white/10"
                }`}
              >
                <div className="text-3xl font-black font-sans">$</div>
                <div className="text-center">
                  <p className="font-bold text-sm text-white">Dólar Americano</p>
                  <p className="text-[10px] font-mono text-white/40 mt-1">USD ($)</p>
                </div>
              </button>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-sm hover:from-amber-400 hover:to-orange-500 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-6"
            >
              Definir Minhas Metas
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white font-sans">Defina sua Meta Patrimonial</h3>
              <p className="text-sm text-white/40 leading-relaxed">
                Nossa Inteligência Artificial moldará suas projeções financeiras para ajudá-lo a acelerar o atingimento do seu objetivo estratégico.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">O que você deseja conquistar?</label>
                <div className="relative">
                  <Landmark className="absolute left-3.5 top-3.5 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    placeholder="Ex: Comprar Apê de Luxo, Liberdade Financeira, Fundo de Emergência"
                    className="w-full bg-[#131315] border border-white/5 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-amber-500/40 placeholder:text-white/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">Qual o valor alvo necessário?</label>
                <div className="relative">
                  <div className="absolute left-4 top-3.5 text-xs font-mono font-bold text-white/30">
                    {currency === "BRL" ? "R$" : "$"}
                  </div>
                  <input
                    type="number"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(Math.max(10, Number(e.target.value)))}
                    placeholder="100000"
                    className="w-full bg-[#131315] border border-white/5 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-amber-500/40 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex gap-3">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs text-white/60 leading-relaxed">
                <strong>Configurado com Sucesso:</strong> Nosso consultor de IA estará preparado para lhe oferecer planos detalhados para ajudá-lo a alcançar {currency === "BRL" ? "R$" : "$"} {goalTarget.toLocaleString()} adicionais de saldo focado na meta de <em>"{goalName}"</em>.
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-3.5 px-4 rounded-xl bg-white/5 border border-white/5 text-white/60 font-semibold text-xs hover:bg-white/10 transition-all cursor-pointer"
              >
                Voltar
              </button>
              <button
                onClick={handleNext}
                className="flex-grow py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-xs hover:from-amber-400 hover:to-orange-500 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                Concluir Configuração
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
