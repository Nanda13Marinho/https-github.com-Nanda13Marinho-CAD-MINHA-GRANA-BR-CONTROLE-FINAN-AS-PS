import React from "react";
import { AppData } from "../types";
import { TrendingUp, PieChart, ShieldAlert, Home, Cloud, ArrowUpDown, ChevronRight, Calendar, ChevronDown, Filter, MoreVertical, Sparkles } from "lucide-react";

interface DetailedDashboardProps {
  data: AppData;
  currency: "USD" | "BRL";
}

export default function DetailedDashboard({ data, currency }: DetailedDashboardProps) {
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

  // Static premium base values that dynamically scale
  const baseNetWorth = 1245670.00;
  const currentNetWorth = convertVal(baseNetWorth, "USD");

  const investmentValue = convertVal(934252.50, "USD");
  const liquidityValue = convertVal(311417.50, "USD");

  return (
    <div className="space-y-8 animate-fade-in text-[#E0D8D0]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white font-sans uppercase">
            Relatório Patrimonial
          </h2>
          <p className="text-sm text-white/40 mt-1">
            Visão abrangente e inteligente da sua saúde financeira consolidada.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="glass-card px-4 py-2 rounded-xl flex items-center gap-2 text-white text-xs font-semibold hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
            <Calendar className="w-4 h-4 text-amber-500" />
            Últimos 12 Meses
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>
          <button className="glass-card px-4 py-2 rounded-xl flex items-center gap-2 text-white text-xs font-semibold hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
            <Filter className="w-4 h-4 text-amber-500" />
            Todas as Contas
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Net Worth Progression (Area Chart) */}
        <div className="glass-card rounded-2xl p-6 md:col-span-8 flex flex-col h-[400px] border border-white/5">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider text-white/40">
                Evolução do Patrimônio Líquido
              </h3>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white tracking-tight">
                  {formatValue(currentNetWorth)}
                </span>
                <span className="text-xs text-success-emerald font-semibold flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" />
                  +12.4%
                </span>
              </div>
            </div>
            <button className="text-white/40 hover:text-white cursor-pointer">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive SVG Area Chart representing Net Worth Progress */}
          <div className="flex-1 relative border-b border-white/5 flex items-end">
            <div className="absolute inset-0 bg-gradient-to-t from-success-emerald/10 to-transparent"></div>
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path 
                d="M0,100 L0,75 C15,70 30,85 45,60 C60,40 75,55 100,20 L100,100 Z" 
                fill="url(#area-gradient)" 
              />
              <path 
                d="M0,75 C15,70 30,85 45,60 C60,40 75,55 100,20" 
                fill="none" 
                stroke="#10B981" 
                strokeWidth="2.5" 
              />
              <defs>
                <linearGradient id="area-gradient" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          <div className="flex justify-between mt-3 font-mono text-[10px] text-white/40 uppercase tracking-wider">
            <span>Jan</span>
            <span>Mar</span>
            <span>Mai</span>
            <span>Jul</span>
            <span>Set</span>
            <span>Nov</span>
          </div>
        </div>

        {/* Asset Allocation (Investment vs Liquidity) */}
        <div className="glass-card rounded-2xl p-6 md:col-span-4 flex flex-col h-[400px] border border-white/5">
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-mono text-xs uppercase tracking-wider text-white/40">
              Alocação de Ativos
            </h3>
            <PieChart className="w-4 h-4 text-white/40" />
          </div>

          <div className="flex-grow flex flex-col justify-center gap-6">
            {/* Investments progress card */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-white">Investimentos</span>
                <span className="font-mono text-champagne-gold">75%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-champagne-gold rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(230,190,138,0.5)]"
                  style={{ width: "75%" }}
                ></div>
              </div>
              <p className="font-mono text-xs text-white/40 mt-1.5">
                {formatValue(investmentValue)}
              </p>
            </div>

            {/* Liquidity progress card */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-white">Liquidez Imediata</span>
                <span className="font-mono text-success-emerald">25%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-success-emerald rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  style={{ width: "25%" }}
                ></div>
              </div>
              <p className="font-mono text-xs text-white/40 mt-1.5">
                {formatValue(liquidityValue)}
              </p>
            </div>
          </div>

          {/* AI suggestion box */}
          <div className="mt-4 bg-[#c5a880]/5 border border-[#c5a880]/15 p-3.5 rounded-xl flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
            <p className="text-[11px] text-white/80 leading-relaxed font-sans">
              <strong>Sugestão da IA:</strong> Rebalanceie sua carteira para reduzir perdas por liquidez excessiva. Recomendo alocar {currency === "USD" ? "$15,000" : "R$ 75.000,00"} adicionais em títulos de renda fixa privada de alto rendimento.
            </p>
          </div>
        </div>

        {/* Budget vs Actual Stacked Columns */}
        <div className="glass-card rounded-2xl p-6 md:col-span-6 h-[350px] flex flex-col border border-white/5">
          <h3 className="font-mono text-xs uppercase tracking-wider text-white/40 mb-6">
            Orçamento vs Realizado (Acompanhamento)
          </h3>
          <div className="flex-grow flex items-end gap-6 pb-2 border-b border-white/5">
            {/* Outubro */}
            <div className="flex-grow flex flex-col justify-end items-center gap-1.5 h-full">
              <div className="w-12 bg-danger-crimson/80 h-[25%] rounded-t-md relative group hover:bg-danger-crimson">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#050505] border border-danger-crimson px-2 py-0.5 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-mono text-white whitespace-nowrap z-10">
                  +25% Excedente
                </div>
              </div>
              <div className="w-12 bg-champagne-gold/60 h-[75%] rounded-b-md"></div>
              <span className="text-xs font-mono text-white/40 mt-2">Out</span>
            </div>
            
            {/* Novembro */}
            <div className="flex-grow flex flex-col justify-end items-center gap-1.5 h-full">
              <div className="w-12 bg-success-emerald/60 h-[80%] rounded-md hover:bg-success-emerald/80 transition-colors"></div>
              <span className="text-xs font-mono text-white/40 mt-2">Nov</span>
            </div>

            {/* Dezembro */}
            <div className="flex-grow flex flex-col justify-end items-center gap-1.5 h-full">
              <div className="w-12 bg-danger-crimson/80 h-[10%] rounded-t-md relative group hover:bg-danger-crimson">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#050505] border border-danger-crimson px-2 py-0.5 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-mono text-white whitespace-nowrap z-10">
                  +10% Excedente
                </div>
              </div>
              <div className="w-12 bg-champagne-gold/60 h-[50%] rounded-b-md"></div>
              <span className="text-xs font-mono text-white/40 mt-2">Dez</span>
            </div>
          </div>

          <div className="flex gap-4 mt-4 font-mono text-xs text-white/40 justify-center">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-champagne-gold/60"></span> Orçado
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-danger-crimson/80"></span> Excedido
            </div>
          </div>
        </div>

        {/* Recurring Expenses Card */}
        <div className="glass-card rounded-2xl p-6 md:col-span-6 h-[350px] flex flex-col border border-white/5">
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-mono text-xs uppercase tracking-wider text-white/40">
              Despesas Recorrentes Ativas
            </h3>
            <span className="text-xs font-mono text-white bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
              -{formatValue(convertVal(4250.00, "USD"))}/mês
            </span>
          </div>

          <div className="flex-1 overflow-y-auto hide-scrollbar space-y-3 pr-1">
            
            {/* Item 1 - Financiamento */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-champagne-gold/15 flex items-center justify-center text-champagne-gold border border-champagne-gold/20 shrink-0">
                  <Home className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Parcela Imobiliária</p>
                  <p className="text-xs text-white/40 font-mono">Vencimento: Dia 15</p>
                </div>
              </div>
              <span className="font-mono text-sm font-bold text-white">
                -{formatValue(convertVal(3500.00, "USD"))}
              </span>
            </div>

            {/* Item 2 - Cloud Services */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-ai-cyan/15 flex items-center justify-center text-ai-cyan border border-ai-cyan/20 shrink-0">
                  <Cloud className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Serviços de Nuvem (SaaS)</p>
                  <p className="text-xs text-white/40 font-mono">Vencimento: Dia 22</p>
                </div>
              </div>
              <span className="font-mono text-sm font-bold text-white">
                -{formatValue(convertVal(150.00, "USD"))}
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
