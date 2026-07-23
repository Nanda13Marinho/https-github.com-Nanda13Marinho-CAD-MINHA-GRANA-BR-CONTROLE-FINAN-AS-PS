import React, { useState, useEffect } from "react";
import { AppData, Transaction } from "../types";
import { TrendingUp, ArrowDown, ArrowUp, Zap, X, Eye, FileText, PlusCircle, CheckCircle, Clock, Calendar, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

interface HomeDashboardProps {
  data: AppData;
  currency: "USD" | "BRL";
  userEmail?: string;
  onTriggerScanner: () => void;
  onTriggerAdd: (type?: "income" | "expense") => void;
  onReviewTransaction: (id: string) => void;
}

export default function HomeDashboard({
  data,
  currency,
  userEmail,
  onTriggerScanner,
  onTriggerAdd,
  onReviewTransaction
}: HomeDashboardProps) {
  const isDemoMode = !userEmail || userEmail.toLowerCase() === "carlos@cademinhagrana.com" || userEmail.toLowerCase() === "admin@cademinhagrana.com";

  const [monthOffset, setMonthOffset] = useState(0);

  const today = new Date();
  const targetDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const monthNameRaw = targetDate.toLocaleDateString("pt-BR", { month: "long" });
  const formattedMonthName = monthNameRaw.charAt(0).toUpperCase() + monthNameRaw.slice(1);
  const formattedYear = targetDate.getFullYear();

  const [aiInsight, setAiInsight] = useState<string>(
    currency === "USD" 
      ? "With your recent income received today, we suggest allocating $1,000 towards your Emergency Fund target."
      : "Com o recebimento das suas receitas este mês, sugerimos destinar R$ 5.000 para liquidar integralmente sua meta de Reserva de Emergência."
  );
  const [insightDismissed, setInsightDismissed] = useState(false);
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Fetch real-time AI insight
  useEffect(() => {
    async function fetchInsight() {
      setLoadingInsight(true);
      try {
        const res = await fetch("/api/ai-insight");
        if (res.ok) {
          const json = await res.json();
          if (json.insight) {
            setAiInsight(json.insight);
          }
        }
      } catch (e) {
        console.error("Failed to fetch live AI insight", e);
      } finally {
        setLoadingInsight(false);
      }
    }
    fetchInsight();
  }, [data.transactions]);

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

  // Calculate stats dynamically. Demo mode uses sample offsets, real accounts use exact real entries.
  const totalBalanceBase = isDemoMode ? 124592.00 : 0;
  const deltaTransactions = data.transactions.reduce((sum, t) => {
    return sum + convertVal(t.amount, t.currency);
  }, 0);
  const totalBalance = (isDemoMode ? convertVal(totalBalanceBase, "USD") : 0) + deltaTransactions;

  // Monthly income and expenses
  const monthlyIncome = data.transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + convertVal(t.amount, t.currency), 0) + (isDemoMode ? convertVal(7125.00, "USD") : 0);

  const monthlyExpenses = Math.abs(
    data.transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + convertVal(t.amount, t.currency), 0)
  ) + (isDemoMode ? convertVal(3650.00, "USD") : 0);

  // Spent breakdown for Cash Flow Overview ring chart
  const incomePercent = monthlyIncome > 0 ? 65 : 0;
  const fixedPercent = monthlyExpenses > 0 ? 25 : 0;
  const discPercent = monthlyExpenses > 0 ? 10 : 0;
  const netFlow = monthlyIncome - monthlyExpenses;

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Calendar & Month Navigation Bar */}
      <div className="bg-[#131315] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-extrabold text-white">
                {formattedMonthName} de {formattedYear}
              </h2>
              {monthOffset === 0 && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Mês Atual
                </span>
              )}
              {monthOffset < 0 && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Relatório Passado ({Math.abs(monthOffset)} {Math.abs(monthOffset) === 1 ? "mês atrás" : "meses atrás"})
                </span>
              )}
              {monthOffset > 0 && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Contas Programadas (+{monthOffset} {monthOffset === 1 ? "mês à frente" : "meses à frente"})
                </span>
              )}
            </div>
            <p className="text-xs text-white/50">
              {monthOffset < 0 
                ? "Visualizando histórico do relatório de despesas e receitas passadas." 
                : monthOffset > 0 
                ? "Visualizando contas programadas e projeções de vencimento futuro." 
                : "Acompanhamento em tempo real das entradas e saídas deste mês."}
            </p>
          </div>
        </div>

        {/* Month Navigation Controls */}
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <button
            onClick={() => setMonthOffset(prev => prev - 1)}
            className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-white transition-all flex items-center gap-1 cursor-pointer"
            title="Navegar para Mês Anterior (Relatório Passado)"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Mês Anterior</span>
          </button>

          {monthOffset !== 0 && (
            <button
              onClick={() => setMonthOffset(0)}
              className="p-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-xl text-amber-400 text-xs font-bold transition-all cursor-pointer"
              title="Voltar para Mês Atual"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setMonthOffset(prev => prev + 1)}
            className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-white transition-all flex items-center gap-1 cursor-pointer"
            title="Navegar para Próximo Mês (Contas Programadas)"
          >
            <span>Próximo Mês</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top Cards Grid: Entradas, Saídas e O que Resta */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Balance Card (O Que Resta) */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group border border-champagne-gold/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-champagne-gold/5 rounded-bl-full blur-2xl group-hover:bg-champagne-gold/10 transition-colors duration-500"></div>
          <div className="flex justify-between items-center mb-3">
            <span className="font-mono text-xs uppercase tracking-wider text-white/50 font-bold">
              O Que Resta (Saldo Total)
            </span>
            <span className="material-symbols-outlined text-champagne-gold">account_balance</span>
          </div>
          <div className="text-3xl font-bold font-sans tracking-tight text-champagne-gold mb-2 shimmer-gold bg-clip-text">
            {formatValue(totalBalance)}
          </div>
          <p className="text-xs text-white/50 font-sans">
            Balanço acumulado da sua conta
          </p>
        </div>

        {/* Monthly Income Card (O Que Entra) */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group border border-emerald-500/20 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1">
                <ArrowDown className="w-4 h-4 text-emerald-400" />
                O Que Entra (Receitas)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold">
                Entradas (+)
              </span>
            </div>
            <div className="text-3xl font-bold tracking-tight text-white mb-2">
              {formatValue(monthlyIncome)}
            </div>
            <p className="text-xs text-white/50 font-sans mb-4">
              Total recebido no período
            </p>
          </div>
          <button
            onClick={() => onTriggerAdd("income")}
            className="w-full py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            + Inserir Receita / Dinheiro
          </button>
        </div>

        {/* Monthly Expenses Card (O Que Sai) */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group border border-amber-500/20 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="font-mono text-xs uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1">
                <ArrowUp className="w-4 h-4 text-amber-400" />
                O Que Sai (Despesas)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-mono font-bold">
                Saídas (-)
              </span>
            </div>
            <div className="text-3xl font-bold tracking-tight text-white mb-2">
              {formatValue(monthlyExpenses)}
            </div>
            <p className="text-xs text-white/50 font-sans mb-4">
              Total gasto no período
            </p>
          </div>
          <button
            onClick={() => onTriggerAdd("expense")}
            className="w-full py-2.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-400 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            + Inserir Despesa / Gasto
          </button>
        </div>

      </div>

      {/* Middle Section: AI Insight and Cash Flow Ring Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* AI Insights Panel */}
        {!insightDismissed && (
          <div className="lg:col-span-1 glass-card rounded-2xl p-6 border border-ai-cyan/20 bg-ai-cyan/5 flex flex-col relative overflow-hidden animate-fade-in shadow-[inset_0_0_20px_rgba(245,158,11,0.05)]">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-6xl text-ai-cyan">psychology</span>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-ai-cyan animate-pulse">auto_awesome</span>
              <h3 className="text-lg font-bold text-white font-sans">AI Insight</h3>
            </div>
            
            <div className="flex-grow flex flex-col justify-center">
              <p className="text-sm leading-relaxed text-[#e4e2e3]/90">
                {loadingInsight ? (
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-ai-cyan animate-ping"></span>
                    Analisando seus dados em tempo real...
                  </span>
                ) : (
                  aiInsight
                )}
              </p>
              
              <div className="mt-6 pt-4 border-t border-ai-cyan/15 flex gap-3 z-10">
                <button 
                  onClick={onTriggerAdd}
                  className="flex-grow py-2 px-4 rounded-lg bg-ai-cyan text-[#010814] hover:bg-white hover:text-deep-navy transition-colors font-semibold text-xs flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)] cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  {currency === "USD" ? "Take Action" : "Executar Ação"}
                </button>
                <button 
                  onClick={() => setInsightDismissed(true)}
                  aria-label="Dismiss insight"
                  className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-[#E0D8D0] hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Spend Breakdown & Cash Flow Ring Chart */}
        <div className={`glass-card rounded-2xl p-6 flex flex-col ${insightDismissed ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">
              {currency === "USD" ? "Cash Flow Overview" : "Visão Geral de Fluxo de Caixa"}
            </h3>
            <span className="material-symbols-outlined text-on-surface-variant">more_horiz</span>
          </div>

          <div className="flex-grow flex flex-col md:flex-row items-center justify-around gap-6 py-4">
            {/* Elegant SVG Donut Chart */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="10" />
                {/* Income Segment (65%) */}
                <circle 
                  cx="50" cy="50" r="40" fill="none" 
                  stroke="#10B981" strokeWidth="10" 
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.65)}`}
                />
                {/* Fixed Segment (25%) */}
                <circle 
                  cx="50" cy="50" r="40" fill="none" 
                  stroke="#f59e0b" strokeWidth="10" 
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.25)}`}
                  style={{ transform: "rotate(234deg)", transformOrigin: "50px 50px" }}
                />
                {/* Discretionary Segment (10%) */}
                <circle 
                  cx="50" cy="50" r="40" fill="none" 
                  stroke="#f97316" strokeWidth="10" 
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.10)}`}
                  style={{ transform: "rotate(324deg)", transformOrigin: "50px 50px" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center pointer-events-none">
                <span className="text-[9px] uppercase font-mono tracking-wider text-white/40">
                  {currency === "USD" ? "Net Flow" : "Fluxo Líquido"}
                </span>
                <span className="text-xs md:text-sm font-extrabold text-white tracking-tight font-mono">
                  {netFlow >= 0 ? "+" : ""}{formatValue(netFlow)}
                </span>
              </div>
            </div>

            {/* Legend info */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-success-emerald"></div>
                <div>
                  <div className="text-sm font-medium text-white">
                    {currency === "USD" ? "Income (65%)" : "Entradas (65%)"}
                  </div>
                  <div className="text-xs text-white/40 font-mono">
                    {formatValue(monthlyIncome * 0.65)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-champagne-gold"></div>
                <div>
                  <div className="text-sm font-medium text-white">
                    {currency === "USD" ? "Fixed Expenses (25%)" : "Gastos Fixos (25%)"}
                  </div>
                  <div className="text-xs text-white/40 font-mono">
                    {formatValue(monthlyExpenses * 0.25)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-danger-crimson"></div>
                <div>
                  <div className="text-sm font-medium text-white">
                    {currency === "USD" ? "Discretionary (10%)" : "Lazer/Variável (10%)"}
                  </div>
                  <div className="text-xs text-white/40 font-mono">
                    {formatValue(monthlyExpenses * 0.10)}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Recent Transactions List Section */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white">
            {currency === "USD" ? "Recent Transactions" : "Lançamentos Recentes"}
          </h3>
          <div className="flex gap-2">
            <button 
              onClick={onTriggerScanner}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-ai-cyan/10 hover:bg-ai-cyan/20 text-ai-cyan rounded-lg text-xs font-mono border border-ai-cyan/20 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">document_scanner</span>
              OCR Scanner
            </button>
            <button 
              onClick={onTriggerAdd}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-champagne-gold/10 hover:bg-champagne-gold/20 text-champagne-gold rounded-lg text-xs font-mono border border-champagne-gold/20 transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Manual Lançamento
            </button>
          </div>
        </div>

        <div className="divide-y divide-white/5 space-y-1">
          {data.transactions.length === 0 ? (
            <p className="text-center py-8 text-white/40 text-sm">Nenhuma transação encontrada. Clique em Lançamento para começar!</p>
          ) : (
            data.transactions.map((t) => {
              const displayAmount = convertVal(t.amount, t.currency);
              const isExpense = t.type === "expense";
              return (
                <div 
                  key={t.id} 
                  className="flex items-center justify-between p-3.5 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-champagne-gold/10 transition-all shrink-0">
                      <span className="material-symbols-outlined text-white/40 group-hover:text-champagne-gold transition-colors">
                        {t.category === "Dining Out" ? "restaurant" :
                         t.category === "Salary" ? "payments" :
                         t.category === "Electronics" ? "shopping_bag" :
                         t.category === "Transport" ? "directions_car" :
                         t.category === "Fitness" ? "fitness_center" : "receipt"}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white flex items-center gap-1.5">
                        {t.merchant}
                        {t.aiReviewed && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-ai-cyan/10 text-ai-cyan text-[10px] font-mono border border-ai-cyan/20">
                            {currency === "USD" ? "AI Reviewed" : "Análise por IA"}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-white/40 font-mono">
                        {t.category} • {t.date}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className={`text-sm font-bold font-mono ${isExpense ? 'text-white' : 'text-success-emerald'}`}>
                      {isExpense ? "" : "+"}{formatValue(displayAmount)}
                    </span>
                    
                    {t.status === "Pending" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded mt-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {currency === "USD" ? "Pending" : "Pendente"}
                      </span>
                    ) : t.status === "Reviewed" ? (
                      <button 
                        onClick={() => onReviewTransaction(t.id)}
                        className="inline-flex items-center gap-1 text-[10px] text-ai-cyan bg-ai-cyan/10 border border-ai-cyan/20 px-2 py-0.5 rounded mt-1 font-mono hover:bg-ai-cyan hover:text-[#010814] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[12px]">psychology</span>
                        {currency === "USD" ? "Reviewed" : "Analisado"}
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded mt-1 font-mono">
                        <CheckCircle className="w-3 h-3 text-success-emerald" />
                        {currency === "USD" ? "Cleared" : "Confirmado"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
