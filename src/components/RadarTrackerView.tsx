import React, { useState } from "react";
import { AppData, Leak } from "../types";
import { Shield, Brain, Check, RefreshCw, Trophy, Dumbbell, Cloud, HelpCircle, Merge, Radar, PiggyBank, Sparkles, Radio } from "lucide-react";

interface RadarTrackerViewProps {
  data: AppData;
  currency: "USD" | "BRL";
  onUpdateLeakStatus: (id: string, status: Leak["status"]) => void;
}

export default function RadarTrackerView({
  data,
  currency,
  onUpdateLeakStatus
}: RadarTrackerViewProps) {
  const [scanning, setScanning] = useState(false);
  const [activeHoverPoint, setActiveHoverPoint] = useState<string | null>(null);

  // Conversion rate (1 USD = 5 BRL)
  const rate = 5.0;

  const convertVal = (amount: number, itemCurrency: "USD" | "BRL") => {
    if (itemCurrency === currency) return amount;
    if (currency === "USD" && itemCurrency === "BRL") return amount / rate;
    return amount * rate;
  };

  const formatValue = (amount: number) => {
    if (currency === "USD") {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
    } else {
      return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amount);
    }
  };

  // Filter leaks to show active vs acted
  const activeLeaks = data.leaks.filter(l => l.status === "active");
  const actedLeaksCount = data.leaks.length - activeLeaks.length;

  const potentialMonthlySavings = activeLeaks.reduce((sum, l) => sum + convertVal(l.cost, "BRL"), 0);
  const potentialYearlySavings = potentialMonthlySavings * 12;

  const handleScanTrigger = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in text-[#E0D8D0]">
      {/* Decorative Blur Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-ai-cyan/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ai-cyan/10 border border-ai-cyan/20 flex items-center justify-center shrink-0">
              <Radar className="w-5 h-5 text-ai-cyan animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white font-sans uppercase">
                Radar de Assinaturas e Vazamentos
              </h1>
              <p className="text-sm text-white/40 mt-1">
                Localize e elimine assinaturas esquecidas, tarifas de banco abusivas e vazamentos financeiros ocultos.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
          <span className="w-2 h-2 rounded-full bg-success-emerald animate-pulse"></span>
          <span className="font-mono text-xs text-success-emerald font-semibold">
            Varredura em Tempo Real Ativa
          </span>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Radar Visualizer Panel */}
        <div className="col-span-1 lg:col-span-7 bg-[#101012] rounded-3xl border border-white/5 p-6 relative overflow-hidden min-h-[400px] flex flex-col shadow-2xl">
          <div className="flex justify-between items-center mb-6 z-10 relative">
            <h2 className="font-mono text-xs text-white/40 uppercase tracking-widest font-bold">
              RASTREAMENTO DE SINAL BANCÁRIO
            </h2>
            <button 
              onClick={handleScanTrigger}
              className="flex items-center gap-1.5 text-xs font-bold text-ai-cyan bg-ai-cyan/10 px-3 py-1.5 rounded-lg border border-ai-cyan/20 hover:bg-ai-cyan hover:text-[#010814] transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${scanning ? 'animate-spin' : ''}`} />
              {scanning ? "VARRENDO..." : "RASTREAR AGORA"}
            </button>
          </div>

          <div className="flex-grow relative flex items-center justify-center min-h-[300px]">
            {/* Conic Sweep Radar Grid */}
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border border-ai-cyan/15 relative flex items-center justify-center bg-[radial-gradient(circle_at_center,transparent_0,transparent_49%,rgba(0,242,255,0.08)_50%,transparent_51%)] bg-no-repeat bg-center">
              {/* Radar Grid Circles */}
              <div className="absolute w-full h-full rounded-full border border-ai-cyan/5"></div>
              <div className="absolute w-3/4 h-3/4 rounded-full border border-ai-cyan/10"></div>
              <div className="absolute w-1/2 h-1/2 rounded-full border border-ai-cyan/10"></div>
              <div className="absolute w-1/4 h-1/4 rounded-full border border-ai-cyan/15 bg-[#010814] flex items-center justify-center z-10 shadow-[0_0_20px_rgba(0,242,255,0.15)]">
                <Radio className="w-6 h-6 text-ai-cyan animate-pulse" />
              </div>

              {/* Dynamic Sweep element */}
              <div className="radar-sweep pointer-events-none"></div>

              {/* Data points (Anomalies) */}
              {activeLeaks.map((leak, idx) => {
                const positions = [
                  { top: "22%", left: "33%" },
                  { bottom: "28%", right: "26%" },
                  { top: "62%", left: "64%" }
                ];
                const pos = positions[idx % positions.length];
                const color = leak.category === "Fitness" ? "bg-danger-crimson" : "bg-ai-cyan";
                const glowColor = leak.category === "Fitness" ? "shadow-[0_0_12px_#EF4444]" : "shadow-[0_0_12px_#00F2FF]";
                
                return (
                  <div 
                    key={leak.id} 
                    style={pos}
                    className="absolute cursor-crosshair z-20 group"
                    onMouseEnter={() => setActiveHoverPoint(leak.id)}
                    onMouseLeave={() => setActiveHoverPoint(null)}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full ${color} animate-ping absolute opacity-70`}></div>
                    <div className={`w-3.5 h-3.5 rounded-full ${color} ${glowColor} border-2 border-[#131315] relative z-10`}></div>
                    
                    {/* Hover tooltip card */}
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 w-48 bg-[#050505]/95 border border-white/10 rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 shadow-2xl">
                      <p className="text-xs font-bold text-white">{leak.name}</p>
                      <p className="text-[10px] font-mono text-white/40 mt-0.5">{leak.reason}</p>
                      <p className="text-[10px] font-mono text-danger-crimson font-bold mt-1">-{formatValue(convertVal(leak.cost, "BRL"))}/mês</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-10 pointer-events-none">
            <div className="font-mono text-[9px] text-white/20 space-y-0.5">
              <p>FREQ: 4.8 THZ • SINAL ESTÁVEL</p>
              <p>MÓDULO: DETECT_LEAKS_v1.0</p>
            </div>
            <div className="font-mono text-[10px] text-ai-cyan font-semibold">
              {scanning ? "SISTEMA ANALISANDO..." : "VARREDURA ATIVA"}
            </div>
          </div>
        </div>

        {/* AI Detective Insights */}
        <div className="col-span-1 lg:col-span-5 flex flex-col gap-6">
          
          {/* AI Detective Box */}
          <div className="bg-[#101012] rounded-3xl border border-ai-cyan/20 p-6 flex-grow flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ai-cyan to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-ai-cyan/10 border border-ai-cyan/20 flex items-center justify-center shrink-0">
                <Brain className="w-5 h-5 text-ai-cyan" />
              </div>
              <div>
                <h2 className="font-mono text-xs uppercase tracking-wider text-ai-cyan font-bold mb-0.5">
                  Análise do Detetive IA
                </h2>
                <p className="text-sm text-white">
                  Identifiquei <span className="text-danger-crimson font-bold">{formatValue(potentialMonthlySavings)}</span> em desperdícios recorrentes.
                </p>
              </div>
            </div>

            <div className="bg-[#050505]/40 p-4 rounded-xl border border-white/5 mb-5 text-xs text-white/60 leading-relaxed flex-grow">
              <p className="mb-2">
                Sua assinatura mensal da academia "FitLife Gym" foi cobrada nos últimos 4 meses consecutivos, mas nosso banco de dados não registrou nenhum check-in físico de geolocalização.
              </p>
              <p>
                Além disso, identificamos cobranças simultâneas do Google One e Dropbox, porém seu consumo total de armazenamento em nuvem acumulado não atinge 15% do limite contratado.
              </p>
            </div>

            <button 
              onClick={handleScanTrigger}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-ai-cyan to-blue-600 text-[#010814] hover:from-white hover:to-white hover:text-deep-navy font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,242,255,0.15)] cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Otimizar Minhas Contas Agora
            </button>
          </div>

          {/* Quick Metrics Cards */}
          <div className="bg-[#101012] rounded-3xl border border-white/5 p-6 flex items-center justify-between shadow-lg">
            <div>
              <p className="font-mono text-xs text-white/40 uppercase tracking-wider mb-1">
                Economia Anual Estimada
              </p>
              <p className="text-3xl font-black tracking-tight text-success-emerald font-sans">
                {formatValue(potentialYearlySavings)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-success-emerald/10 flex items-center justify-center shrink-0 border border-success-emerald/20">
              <PiggyBank className="w-5 h-5 text-success-emerald" />
            </div>
          </div>

        </div>

        {/* Detailed Leak Table */}
        <div className="col-span-1 lg:col-span-12 bg-[#101012] rounded-3xl border border-white/5 overflow-hidden shadow-xl">
          <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <h2 className="text-lg font-bold text-white font-sans">Cobranças Atípicas Encontradas</h2>
            <span className="bg-danger-crimson/10 text-danger-crimson px-3 py-1 rounded-full font-mono text-[10px] uppercase border border-danger-crimson/20 font-bold tracking-wider">
              Ação Sugerida
            </span>
          </div>

          <div className="divide-y divide-white/5">
            {activeLeaks.length === 0 ? (
              <div className="p-8 text-center text-white/40 flex flex-col items-center justify-center gap-3">
                <Trophy className="w-10 h-10 text-champagne-gold animate-bounce" />
                <p className="text-sm text-white font-semibold">Parabéns! Nenhum vazamento de caixa ativo detectado.</p>
                <p className="text-xs">Você resolveu todos os desperdícios financeiros com o Radar!</p>
              </div>
            ) : (
              activeLeaks.map((leak) => {
                const leakCost = convertVal(leak.cost, "BRL");
                return (
                  <div 
                    key={leak.id}
                    className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        {leak.category === "Fitness" ? (
                          <Dumbbell className="w-5 h-5 text-white/40" />
                        ) : leak.category === "Cloud Services" ? (
                          <Cloud className="w-5 h-5 text-white/40" />
                        ) : (
                          <HelpCircle className="w-5 h-5 text-white/40" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-white">{leak.name}</h3>
                        <p className="font-mono text-xs text-white/40 flex items-center gap-2 mt-0.5">
                          <span className="w-2 h-2 rounded-full bg-danger-crimson animate-pulse"></span>
                          {leak.reason}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-end md:items-center gap-4 w-full md:w-auto">
                      <div className="text-right">
                        <p className="font-mono text-base font-bold text-danger-crimson">
                          -{formatValue(leakCost)} <span className="text-[11px] text-white/40 font-medium">/mês</span>
                        </p>
                      </div>
                      
                      <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0 shrink-0">
                        {leak.category === "Fitness" ? (
                          <>
                            <button 
                              onClick={() => onUpdateLeakStatus(leak.id, "cancelled")}
                              className="flex-grow md:flex-none px-4 py-2 bg-danger-crimson/10 text-danger-crimson hover:bg-danger-crimson hover:text-white rounded-lg font-bold text-xs transition-colors border border-danger-crimson/20 cursor-pointer"
                            >
                              Cancelar Assinatura
                            </button>
                            <button 
                              onClick={() => onUpdateLeakStatus(leak.id, "ignored")}
                              className="flex-grow md:flex-none px-4 py-2 bg-white/5 text-white hover:text-champagne-gold hover:bg-white/10 rounded-lg font-semibold text-xs transition-colors border border-white/10 cursor-pointer"
                            >
                              Ignorar
                            </button>
                          </>
                        ) : leak.category === "Cloud Services" ? (
                          <button 
                            onClick={() => onUpdateLeakStatus(leak.id, "consolidated")}
                            className="flex-grow md:flex-none px-4 py-2 bg-ai-cyan/10 text-ai-cyan hover:bg-ai-cyan hover:text-deep-navy rounded-lg font-bold text-xs transition-all border border-ai-cyan/20 flex items-center justify-center gap-1 cursor-pointer shadow-[0_0_10px_rgba(0,242,255,0.05)]"
                          >
                            <Merge className="w-3.5 h-3.5" />
                            Consolidar Serviços
                          </button>
                        ) : (
                          <button 
                            onClick={() => onUpdateLeakStatus(leak.id, "challenged")}
                            className="flex-grow md:flex-none px-4 py-2 bg-success-emerald/10 text-success-emerald hover:bg-success-emerald hover:text-[#010814] rounded-lg font-bold text-xs transition-colors border border-success-emerald/20 flex items-center justify-center gap-1 cursor-pointer"
                          >
                            Contestar Tarifa
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-4 bg-white/[0.01] border-t border-white/5 text-center">
            <p className="font-mono text-[10px] text-white/40">
              O radar de segurança analisa automaticamente 30 dias de histórico bancário. <a href="#" className="text-ai-cyan hover:underline">Ver logs de varredura completo</a>.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
