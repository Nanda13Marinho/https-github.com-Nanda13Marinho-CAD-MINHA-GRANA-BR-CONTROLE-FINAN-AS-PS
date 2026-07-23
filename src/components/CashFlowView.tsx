import React, { useState } from "react";
import { AppData } from "../types";
import { AlertCircle, BrainCircuit, Plus, FileText, Check, TrendingUp, Filter, Calendar, ReceiptText, Car, CircleDollarSign, Download } from "lucide-react";

interface CashFlowViewProps {
  data: AppData;
  currency: "USD" | "BRL";
  onTriggerAdd: () => void;
  onExecuteTransfer: (amount: number, destination: string) => void;
}

export default function CashFlowView({
  data,
  currency,
  onTriggerAdd,
  onExecuteTransfer
}: CashFlowViewProps) {
  const [activeRange, setActiveRange] = useState<"30D" | "90D">("30D");
  const [transferExecuted, setTransferExecuted] = useState(false);

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

  const handleTransfer = () => {
    const amount = convertVal(5000, "BRL");
    onExecuteTransfer(amount, "Poupança");
    setTransferExecuted(true);
  };

  return (
    <div className="space-y-8 animate-fade-in text-[#E0D8D0]">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white font-sans uppercase">
            Fluxo de Caixa e Projeções
          </h2>
          <p className="text-sm text-white/40 mt-1">
            Projeções estratégicas para os próximos 30/90 dias e monitoramento de liquidez.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-xl border border-white/10 text-white font-semibold text-xs hover:bg-white/5 transition-all cursor-pointer flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            Exportar
          </button>
          <button 
            onClick={onTriggerAdd}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Adicionar Lançamento
          </button>
        </div>
      </header>

      {/* Warnings & Alerts Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Low Balance Warning */}
        <div className="glass-card rounded-2xl p-5 border-l-4 border-l-danger-crimson bg-[#0c0a0a] border border-white/5">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-5 h-5 text-danger-crimson shrink-0 mt-0.5" />
            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider text-danger-crimson font-bold mb-1">
                Alerta de Liquidez Mínima
              </h3>
              <p className="text-xs leading-relaxed text-[#e4e2e3]">
                O saldo consolidado projetado cairá temporariamente abaixo de <strong className="text-white font-semibold">{formatValue(convertVal(1500, "BRL"))}</strong> em <strong className="text-white">12 de Outubro</strong> devido a taxas e tributos federais agendados.
              </p>
            </div>
          </div>
        </div>

        {/* AI Analysis and Transfer Advice */}
        <div className="md:col-span-2 bg-[#0a0f12] border border-ai-cyan/20 rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <BrainCircuit className="w-5 h-5 text-ai-cyan shrink-0 mt-0.5 animate-pulse" />
            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider text-ai-cyan font-bold mb-1">
                Análise do Gestor IA
              </h3>
              <p className="text-xs leading-relaxed text-[#e4e2e3]/90">
                A receita deste mês está projetada para superar as despesas em <strong className="text-success-emerald">{formatValue(convertVal(8450, "BRL"))}</strong>. Recomendo transferir <strong className="text-ai-cyan">{formatValue(convertVal(5000, "BRL"))}</strong> para sua poupança de liquidez diária para maximizar rentabilidade imediata.
              </p>
              
              <button 
                onClick={handleTransfer}
                disabled={transferExecuted}
                className={`mt-3 px-3 py-1.5 rounded-lg border text-[10px] font-mono transition-all flex items-center gap-1.5 ${
                  transferExecuted 
                    ? "bg-success-emerald/25 text-success-emerald border-success-emerald/40 cursor-default"
                    : "border-ai-cyan text-ai-cyan hover:bg-ai-cyan hover:text-[#010814] cursor-pointer"
                }`}
              >
                {transferExecuted ? <Check className="w-3.5 h-3.5" /> : null}
                {transferExecuted ? "Transferência Realizada" : "Executar Recomendação de IA"}
              </button>
            </div>
          </div>
        </div>

      </section>

      {/* Main Cash Flow Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Projection & Horizontal Timeline */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 30-Day Projection Chart */}
          <section className="glass-card rounded-2xl p-6 relative overflow-hidden border border-white/5">
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-success-emerald/5 to-transparent pointer-events-none"></div>
            
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="font-mono text-xs uppercase tracking-wider text-white/40">
                Projeção do Fluxo {activeRange}
              </h3>
              <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
                <button 
                  onClick={() => setActiveRange("30D")}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${activeRange === "30D" ? "bg-white/10 text-white font-bold" : "text-white/40 hover:text-white"}`}
                >
                  30 Dias
                </button>
                <button 
                  onClick={() => setActiveRange("90D")}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${activeRange === "90D" ? "bg-white/10 text-white font-bold" : "text-white/40 hover:text-white"}`}
                >
                  90 Dias
                </button>
              </div>
            </div>

            {/* SVG curve for Faux Chart Area */}
            <div className="h-64 w-full relative z-10 flex items-end justify-between px-2 pb-6 border-b border-white/10">
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path 
                  d="M0,80 Q20,70 30,50 T60,40 T80,20 T100,10" 
                  fill="none" 
                  stroke="#10B981" 
                  strokeWidth="2.5" 
                  vectorEffect="non-scaling-stroke"
                />
                <path 
                  d="M0,80 Q20,70 30,50 T60,40 T80,20 T100,10 L100,100 L0,100 Z" 
                  fill="url(#flow-area-gradient)" 
                  opacity="0.1" 
                />
                <defs>
                  <linearGradient id="flow-area-gradient" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="1" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Low Balance Indicator Marker Bubble */}
              <div className="absolute bottom-[35%] left-[45%] flex flex-col items-center">
                <div className="bg-danger-crimson text-white font-mono text-[10px] px-2 py-0.5 rounded border border-danger-crimson/30 shadow-lg mb-1 animate-pulse">
                  {formatValue(convertVal(1400, "BRL"))}
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-danger-crimson border-2 border-[#131315] shadow-md"></div>
                <div className="h-20 border-l border-dashed border-danger-crimson/40 absolute top-4"></div>
              </div>
            </div>

            {/* X-Axis labels */}
            <div className="flex justify-between mt-3 font-mono text-[10px] text-white/40 uppercase">
              <span>Hoje</span>
              <span>10 Out</span>
              <span>20 Out</span>
              <span>30 Out</span>
            </div>
          </section>

          {/* Horizontal scrollable timeline */}
          <section className="glass-card rounded-2xl p-6 border border-white/5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-white/40">
                Cronograma de Contas Futuras
              </h3>
              <span className="text-[10px] text-amber-400/80 font-mono flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                ← Deslize para ver todas as contas →
              </span>
            </div>

            <div className="overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-amber-500/30 scrollbar-track-white/5">
              <div className="flex gap-4 min-w-max">
                
                {/* Block 1 */}
                <div className="bg-white/5 rounded-xl p-4 w-48 border border-success-emerald/20 relative overflow-hidden shrink-0">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-success-emerald/10 rounded-bl-full blur-xl"></div>
                  <div className="font-mono text-xs text-success-emerald mb-1 font-bold">Hoje</div>
                  <div className="text-xs font-bold text-white mb-3">04 Out</div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-white/60">Netflix / SaaS</span>
                    <span className="text-danger-crimson font-mono font-semibold">-{formatValue(convertVal(55, "BRL"))}</span>
                  </div>
                </div>

                {/* Block 2 */}
                <div className="glass-card rounded-xl p-4 w-48 hover:bg-white/10 transition-colors border border-white/5 shrink-0">
                  <div className="font-mono text-xs text-white/40 mb-1">Amanhã</div>
                  <div className="text-xs font-bold text-white mb-3">05 Out</div>
                  <div className="text-[11px] text-white/30 italic">Sem eventos agendados</div>
                </div>

                {/* Block 3 */}
                <div className="glass-card rounded-xl p-4 w-48 border border-champagne-gold/20 hover:bg-white/10 transition-colors shrink-0">
                  <div className="font-mono text-xs text-champagne-gold mb-1 font-bold">Sexta-feira</div>
                  <div className="text-xs font-bold text-white mb-3">07 Out</div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-white/60">Salário Tech Corp</span>
                    <span className="text-success-emerald font-mono font-semibold">+{formatValue(convertVal(12000, "BRL"))}</span>
                  </div>
                </div>

                {/* Block 4 */}
                <div className="glass-card rounded-xl p-4 w-48 border border-danger-crimson/20 hover:bg-white/10 transition-colors shrink-0">
                  <div className="font-mono text-xs text-danger-crimson mb-1 font-bold">Quarta-feira</div>
                  <div className="text-xs font-bold text-white mb-3">12 Out</div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-white/60">Imposto DARF</span>
                    <span className="text-danger-crimson font-mono font-semibold">-{formatValue(convertVal(4500, "BRL"))}</span>
                  </div>
                </div>

                {/* Block 5 */}
                <div className="glass-card rounded-xl p-4 w-48 hover:bg-white/10 transition-colors border border-white/5 shrink-0">
                  <div className="font-mono text-xs text-white/50 mb-1">Segunda-feira</div>
                  <div className="text-xs font-bold text-white mb-3">15 Out</div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-white/60">Condomínio & Luz</span>
                    <span className="text-danger-crimson font-mono font-semibold">-{formatValue(convertVal(1350, "BRL"))}</span>
                  </div>
                </div>

                {/* Block 6 */}
                <div className="glass-card rounded-xl p-4 w-48 hover:bg-white/10 transition-colors border border-white/5 shrink-0">
                  <div className="font-mono text-xs text-white/50 mb-1">Sábado</div>
                  <div className="text-xs font-bold text-white mb-3">20 Out</div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-white/60">Financiamento BMW</span>
                    <span className="text-danger-crimson font-mono font-semibold">-{formatValue(convertVal(3100, "BRL"))}</span>
                  </div>
                </div>

                {/* Block 7 */}
                <div className="glass-card rounded-xl p-4 w-48 border border-ai-cyan/20 hover:bg-white/10 transition-colors shrink-0">
                  <div className="font-mono text-xs text-ai-cyan mb-1 font-bold">Quinta-feira</div>
                  <div className="text-xs font-bold text-white mb-3">25 Out</div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-white/60">Dividendos FIIs</span>
                    <span className="text-success-emerald font-mono font-semibold">+{formatValue(convertVal(2850, "BRL"))}</span>
                  </div>
                </div>

                {/* Block 8 */}
                <div className="glass-card rounded-xl p-4 w-48 hover:bg-white/10 transition-colors border border-white/5 shrink-0">
                  <div className="font-mono text-xs text-white/50 mb-1">Terça-feira</div>
                  <div className="text-xs font-bold text-white mb-3">30 Out</div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-white/60">Plano de Saúde</span>
                    <span className="text-danger-crimson font-mono font-semibold">-{formatValue(convertVal(1800, "BRL"))}</span>
                  </div>
                </div>

              </div>
            </div>
          </section>

        </div>

        {/* Right Column: High Value and Scheduled Lists */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* High Value Impact Cards */}
          <section className="glass-card rounded-2xl p-6 border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-mono text-xs uppercase tracking-wider text-white/40">
                Compromissos de Alto Impacto
              </h3>
              <Filter className="w-4 h-4 text-white/40" />
            </div>

            <div className="space-y-4">
              {/* Item 1 */}
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <CircleDollarSign className="w-5 h-5 text-success-emerald" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Salário Tech Corp</p>
                    <p className="text-xs text-white/40 font-mono">Receita • 07 Out</p>
                  </div>
                </div>
                <span className="text-sm font-bold font-mono text-success-emerald">
                  +{formatValue(convertVal(12500, "BRL"))}
                </span>
              </div>

              {/* Item 2 */}
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <ReceiptText className="w-5 h-5 text-danger-crimson" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">DARF / IR FIIs</p>
                    <p className="text-xs text-white/40 font-mono">Impostos • 12 Out</p>
                  </div>
                </div>
                <span className="text-sm font-bold font-mono text-white">
                  -{formatValue(convertVal(4520.30, "BRL"))}
                </span>
              </div>

              {/* Item 3 */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <Car className="w-5 h-5 text-champagne-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Financiamento BMW</p>
                    <p className="text-xs text-white/40 font-mono">Financiamento • 20 Out</p>
                  </div>
                </div>
                <span className="text-sm font-bold font-mono text-white">
                  -{formatValue(convertVal(3100, "BRL"))}
                </span>
              </div>
            </div>
          </section>

          {/* Scheduled Transfers */}
          <section className="glass-card rounded-2xl p-6 border border-white/5">
            <h3 className="font-mono text-xs uppercase tracking-wider text-white/40 mb-4">
              Transferências Planejadas
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm py-1 border-b border-white/5">
                <span className="text-white font-medium">Reserva</span>
                <span className="text-xs text-white/40 font-mono">08 Out</span>
                <span className="font-mono font-semibold text-success-emerald">
                  {formatValue(convertVal(2000, "BRL"))}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm py-1 border-b border-white/5">
                <span className="text-white font-medium">Corretora XP</span>
                <span className="text-xs text-white/40 font-mono">15 Out</span>
                <span className="font-mono font-semibold text-success-emerald">
                  {formatValue(convertVal(1500, "BRL"))}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm py-1">
                <span className="text-white font-medium">Colégio</span>
                <span className="text-xs text-white/40 font-mono">25 Out</span>
                <span className="font-mono font-semibold text-success-emerald">
                  {formatValue(convertVal(800, "BRL"))}
                </span>
              </div>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
