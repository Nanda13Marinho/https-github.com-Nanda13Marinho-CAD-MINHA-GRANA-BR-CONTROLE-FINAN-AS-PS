import React, { useState, useEffect } from "react";
import { AppData, Transaction } from "../types";
import { TrendingUp, ArrowDown, ArrowUp, Zap, X, Eye, FileText, PlusCircle, CheckCircle, Clock } from "lucide-react";

interface HomeDashboardProps {
  data: AppData;
  currency: "USD" | "BRL";
  onTriggerScanner: () => void;
  onTriggerAdd: () => void;
  onReviewTransaction: (id: string) => void;
}

export default function HomeDashboard({
  data,
  currency,
  onTriggerScanner,
  onTriggerAdd,
  onReviewTransaction
}: HomeDashboardProps) {
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

  // Calculate stats from dynamic database
  const totalBalanceBase = 124592.00; // Static premium base offset
  const deltaTransactions = data.transactions.reduce((sum, t) => {
    return sum + convertVal(t.amount, t.currency);
  }, 0);
  const totalBalance = convertVal(totalBalanceBase, "USD") + deltaTransactions;

  // Monthly income and expenses
  const monthlyIncome = data.transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + convertVal(t.amount, t.currency), 0) + convertVal(7125.00, "USD"); // Offset base salary

  const monthlyExpenses = Math.abs(
    data.transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + convertVal(t.amount, t.currency), 0)
  ) + convertVal(3500.00, "USD") + convertVal(150.00, "USD"); // Offset mortgage & base cloud expenses

  // Spent breakdown for Cash Flow Overview ring chart
  const incomePercent = 65;
  const fixedPercent = 25;
  const discPercent = 10;
  const netFlow = monthlyIncome - monthlyExpenses;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Balance Card */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-champagne-gold/5 rounded-bl-full blur-2xl group-hover:bg-champagne-gold/10 transition-colors duration-500"></div>
          <div className="flex justify-between items-center mb-4">
            <span className="font-mono text-xs uppercase tracking-wider text-white/40">
              {currency === "USD" ? "Total Balance" : "Saldo Consolidado"}
            </span>
            <span className="material-symbols-outlined text-champagne-gold">account_balance</span>
          </div>
          <div className="text-3xl font-bold font-sans tracking-tight text-champagne-gold mb-3 shimmer-gold bg-clip-text">
            {formatValue(totalBalance)}
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-success-emerald/10 text-success-emerald text-xs font-semibold border border-success-emerald/20">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              +2.4%
            </span>
            <span className="text-xs text-white/40 font-mono">
              {currency === "USD" ? "vs last month" : "vs mês anterior"}
            </span>
          </div>
          
          {/* Sparkline Visualizer */}
          <div className="mt-6 h-12 w-full flex items-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
            <div className="w-1/6 bg-champagne-gold/20 h-1/4 rounded-t-sm"></div>
            <div className="w-1/6 bg-champagne-gold/30 h-2/4 rounded-t-sm"></div>
            <div className="w-1/6 bg-champagne-gold/40 h-1/3 rounded-t-sm"></div>
            <div className="w-1/6 bg-champagne-gold/60 h-3/4 rounded-t-sm"></div>
            <div className="w-1/6 bg-champagne-gold/80 h-2/3 rounded-t-sm"></div>
            <div className="w-1/6 bg-champagne-gold h-full rounded-t-sm"></div>
          </div>
        </div>

        {/* Monthly Income Card */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="flex justify-between items-center mb-4">
            <span className="font-mono text-xs uppercase tracking-wider text-white/40">
              {currency === "USD" ? "Monthly Income" : "Entradas Mensais"}
            </span>
            <ArrowDown className="w-5 h-5 text-success-emerald" />
          </div>
          <div className="text-3xl font-bold tracking-tight text-white mb-3">
            {formatValue(monthlyIncome)}
          </div>
          <div className="text-xs text-white/40 font-mono">
            {currency === "USD" ? "Expected: $15,000" : "Esperado: R$ 75.000,00"}
          </div>
          <div className="mt-6 w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-success-emerald rounded-full transition-all duration-1000"
              style={{ width: "95%" }}
            ></div>
          </div>
        </div>

        {/* Monthly Expenses Card */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="flex justify-between items-center mb-4">
            <span className="font-mono text-xs uppercase tracking-wider text-white/40">
              {currency === "USD" ? "Monthly Expenses" : "Saídas Mensais"}
            </span>
            <ArrowUp className="w-5 h-5 text-danger-crimson" />
          </div>
          <div className="text-3xl font-bold tracking-tight text-white mb-3">
            {formatValue(monthlyExpenses)}
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-danger-crimson/10 text-danger-crimson text-xs font-semibold border border-danger-crimson/20">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              +1.2%
            </span>
            <span className="text-xs text-white/40 font-mono">
              {currency === "USD" ? "vs avg" : "vs média anterior"}
            </span>
          </div>

          <div className="mt-6 w-full flex items-end gap-1.5 h-12 opacity-80">
            <div className="flex-1 bg-white/5 h-[40%] rounded-t-sm relative hover:bg-white/10"><div className="absolute bottom-0 w-full h-full bg-danger-crimson/40 rounded-t-sm"></div></div>
            <div className="flex-1 bg-white/5 h-[60%] rounded-t-sm relative hover:bg-white/10"><div className="absolute bottom-0 w-full h-full bg-danger-crimson/60 rounded-t-sm"></div></div>
            <div className="flex-1 bg-white/5 h-[30%] rounded-t-sm relative hover:bg-white/10"><div className="absolute bottom-0 w-full h-full bg-danger-crimson/30 rounded-t-sm"></div></div>
            <div className="flex-1 bg-white/5 h-[80%] rounded-t-sm relative hover:bg-white/10"><div className="absolute bottom-0 w-full h-full bg-danger-crimson/80 rounded-t-sm"></div></div>
            <div className="flex-1 bg-white/5 h-[100%] rounded-t-sm relative hover:bg-white/10"><div className="absolute bottom-0 w-full h-full bg-danger-crimson rounded-t-sm"></div></div>
          </div>
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
