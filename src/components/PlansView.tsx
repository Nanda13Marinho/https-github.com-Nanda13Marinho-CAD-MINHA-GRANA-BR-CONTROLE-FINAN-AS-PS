import React, { useState } from "react";
import { Check, ShieldCheck, Sparkles, CreditCard as CardIcon, QrCode, RefreshCw, Download, FileText } from "lucide-react";

interface PlansViewProps {
  currentPlan: "Gratuito" | "Pro" | "Premium";
  onUpgrade: (plan: "Gratuito" | "Pro" | "Premium") => void;
  currency: "USD" | "BRL";
  userRole?: "user" | "admin";
}

interface Invoice {
  id: string;
  date: string;
  plan: string;
  amount: number;
  currency: string;
  status: "Pago" | "Pendente";
}

export default function PlansView({ currentPlan, onUpgrade, currency, userRole }: PlansViewProps) {
  const [selectedPlan, setSelectedPlan] = useState<"Gratuito" | "Pro" | "Premium" | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<"pricing" | "checkout" | "success">("pricing");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "pix">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);

  // Billing history
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "INV-9821-B",
      date: "04 Jul 2026",
      plan: currentPlan === "Premium" ? "Premium" : currentPlan === "Pro" ? "Pro" : "Gratuito",
      amount: currentPlan === "Premium" ? 59 : currentPlan === "Pro" ? 29 : 0,
      currency: "BRL",
      status: "Pago"
    },
    {
      id: "INV-8732-A",
      date: "04 Jun 2026",
      plan: "Gratuito",
      amount: 0,
      currency: "BRL",
      status: "Pago"
    }
  ]);

  const planCost = {
    Gratuito: 0,
    Pro: currency === "USD" ? 5.90 : 29.00,
    Premium: currency === "USD" ? 11.90 : 59.00
  };

  const formattedCost = (plan: "Gratuito" | "Pro" | "Premium") => {
    const cost = planCost[plan];
    if (currency === "USD") {
      return `$ ${cost.toFixed(2)}`;
    }
    return `R$ ${cost.toFixed(2)}`;
  };

  const handleSelectPlan = (plan: "Gratuito" | "Pro" | "Premium") => {
    if (plan === "Gratuito") {
      onUpgrade("Gratuito");
      setSelectedPlan(null);
      setCheckoutStep("pricing");
      return;
    }
    setSelectedPlan(plan);
    setCheckoutStep("checkout");
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setCheckoutStep("success");
      
      // Upgrade logic
      if (selectedPlan) {
        onUpgrade(selectedPlan);
        
        // Add invoice to history
        const newInvoice: Invoice = {
          id: `INV-${Math.floor(1000 + Math.random() * 9000)}-K`,
          date: "Hoje",
          plan: selectedPlan,
          amount: planCost[selectedPlan],
          currency: currency,
          status: "Pago"
        };
        setInvoices([newInvoice, ...invoices]);
      }
    }, 1800);
  };

  const copyPixCode = () => {
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in text-[#E0D8D0]">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-2xl font-black text-white font-sans uppercase tracking-tight">Planos e Assinaturas</h2>
          <p className="text-sm text-white/40 mt-1">
            Gerencie seu nível de acesso seguro aos servidores de IA e OCR do Cadê Minha Grana.
          </p>
        </div>
        <div className="glass-card px-4 py-2 rounded-xl border border-amber-500/30 flex items-center gap-2.5 bg-amber-500/5">
          <ShieldCheck className="w-4.5 h-4.5 text-amber-500 shrink-0" />
          <div className="text-xs">
            <span className="text-white/40 block">Plano Ativo</span>
            <strong className="text-amber-500 font-bold uppercase tracking-wider">
              {currentPlan === "Premium" ? "Plano Premium (Ativo)" : currentPlan === "Pro" ? "Plano Pro (Ativo)" : "Plano Gratuito (Ativo)"}
            </strong>
          </div>
        </div>
      </div>

      {checkoutStep === "pricing" && (
        <div className="space-y-8">
          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Free Plan */}
            <div className={`glass-card rounded-2xl p-6 border relative overflow-hidden transition-all flex flex-col justify-between ${
              currentPlan === "Gratuito" ? "border-white/20 bg-white/[0.02]" : "border-white/5 bg-[#0a0a0c]"
            }`}>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white">Plano Gratuito</h3>
                    <p className="text-xs text-white/40">Controle básico de finanças</p>
                  </div>
                  {currentPlan === "Gratuito" && (
                    <span className="text-[10px] bg-white/10 text-white font-mono uppercase tracking-widest px-2.5 py-1 rounded border border-white/10">Ativo</span>
                  )}
                </div>
                
                <div className="py-4">
                  <span className="text-3xl font-black text-white">{formattedCost("Gratuito")}</span>
                  <span className="text-xs text-white/40 font-mono"> /mês</span>
                </div>

                <div className="border-t border-white/5 pt-4 space-y-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#E0D8D0] shrink-0" />
                    <span>Lançamentos manuais ilimitados</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#E0D8D0] shrink-0" />
                    <span>2 Escaneamentos de Nota (OCR) /mês</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#E0D8D0] shrink-0" />
                    <span>Assistente de IA com respostas simples</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                {currentPlan === "Gratuito" ? (
                  <button disabled className="w-full py-3 px-4 rounded-xl bg-white/5 text-white/40 border border-white/5 font-semibold text-xs text-center cursor-not-allowed">
                    Seu Plano Atual
                  </button>
                ) : (
                  <button 
                    onClick={() => handleSelectPlan("Gratuito")}
                    className="w-full py-3 px-4 rounded-xl bg-white/5 text-white border border-white/10 hover:bg-white/10 font-semibold text-xs text-center transition-all cursor-pointer"
                  >
                    Mudar para Gratuito
                  </button>
                )}
              </div>
            </div>

            {/* Pro Plan */}
            <div className={`glass-card rounded-2xl p-6 border relative overflow-hidden transition-all flex flex-col justify-between ${
              currentPlan === "Pro" ? "border-amber-500/40 bg-amber-500/[0.02]" : "border-white/5 bg-[#0a0a0c]"
            }`}>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white">Plano Pro</h3>
                    <p className="text-xs text-white/40">Para o investidor moderno</p>
                  </div>
                  {currentPlan === "Pro" && (
                    <span className="text-[10px] bg-amber-500/15 text-amber-500 font-mono uppercase tracking-widest px-2.5 py-1 rounded border border-amber-500/20">Ativo</span>
                  )}
                </div>
                
                <div className="py-4">
                  <span className="text-3xl font-black text-white">{formattedCost("Pro")}</span>
                  <span className="text-xs text-white/40 font-mono"> /mês</span>
                </div>

                <div className="border-t border-white/5 pt-4 space-y-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Lançamentos manuais ilimitados</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <strong className="text-white font-semibold">OCR Ilimitado (Leitura de notas)</strong>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Análise profunda de IA nos lançamentos</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Exportação de dados (PDF, CSV, OFX)</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                {currentPlan === "Pro" ? (
                  <button disabled className="w-full py-3 px-4 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 font-semibold text-xs text-center cursor-not-allowed">
                    Seu Plano Atual
                  </button>
                ) : (
                  <button 
                    onClick={() => handleSelectPlan("Pro")}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-xs text-center hover:from-amber-400 hover:to-orange-500 transition-all cursor-pointer shadow-lg shadow-orange-950/10"
                  >
                    Adquirir Plano Pro
                  </button>
                )}
              </div>
            </div>

            {/* Premium Plan */}
            <div className={`glass-card rounded-2xl p-6 border relative overflow-hidden transition-all flex flex-col justify-between ${
              currentPlan === "Premium" ? "border-amber-500/40 bg-amber-500/[0.04]" : "border-amber-500/20 bg-gradient-to-b from-[#110e08] to-[#0a0a0c]"
            }`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full blur-xl"></div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-lg font-bold text-white">Plano Premium</h3>
                      <Sparkles className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className="text-xs text-amber-500">Gestão Suprema de Patrimônio</p>
                  </div>
                  {currentPlan === "Premium" && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-500 font-mono uppercase tracking-widest px-2.5 py-1 rounded border border-amber-500/30">Ativo</span>
                  )}
                </div>
                
                <div className="py-4">
                  <span className="text-3xl font-black text-amber-500">{formattedCost("Premium")}</span>
                  <span className="text-xs text-white/40 font-mono"> /mês</span>
                </div>

                <div className="border-t border-amber-500/10 pt-4 space-y-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-white font-medium">Tudo do plano PRO</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Conexão bancária real automática <span className="text-[10px] text-amber-400/90 font-mono bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 ml-1">Fase Beta / Breve</span></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <strong className="text-amber-500">Multiacas & Multicarteiras integradas</strong>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Assistente Financeiro IA 24/7 de alta performance</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Suporte prioritário exclusivo por assessores</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                {currentPlan === "Premium" ? (
                  <button disabled className="w-full py-3 px-4 rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/30 font-semibold text-xs text-center cursor-not-allowed">
                    Seu Plano Atual
                  </button>
                ) : (
                  <button 
                    onClick={() => handleSelectPlan("Premium")}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-black font-black text-xs text-center hover:from-amber-300 hover:to-amber-500 transition-all cursor-pointer shadow-lg shadow-orange-950/20"
                  >
                    Adquirir Plano Premium
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Open Finance Roadmap & Automation Card */}
          <div className="glass-card rounded-2xl p-5 border border-amber-500/20 bg-amber-500/[0.02] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 shrink-0">
                <Sparkles className="w-5 h-5 text-amber-500" />
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-500 uppercase tracking-wider text-[11px]">Automações e Open Finance</span>
                  <span className="bg-amber-500/15 text-amber-400 font-mono text-[9px] px-2 py-0.5 rounded border border-amber-500/30">Recurso Exclusivo Premium</span>
                </div>
                <p className="text-white/70 leading-relaxed max-w-3xl">
                  A <strong>Sincronização Bancária Automática (Open Finance)</strong> está <strong>PREVISTA PARA A SEGUNDA FASE DE IMPLEMENTAÇÃO DE AUTOMAÇÃO DO APP</strong>, como um diferencial futuro exclusivo dos assinantes do plano <strong>Premium</strong>. Atualmente, o sistema opera com máxima eficiência através da leitura inteligente por <strong>Voz e OCR de Comprovantes/Notas</strong>, preservando a agilidade e a privacidade do usuário.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 self-start md:self-center shrink-0">
              <a 
                href="/presentation"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-amber-500 text-[#010814] hover:bg-white transition-all font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.25)] cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                Apresentação Executiva (PDF)
              </a>

              {userRole === "admin" && (
                <a 
                  href="/api/download-prd"
                  download="PRD_CADE_MINHA_GRANA.md"
                  className="px-4 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all font-bold text-xs flex items-center gap-2 cursor-pointer border border-white/10"
                >
                  <Download className="w-4 h-4" />
                  Baixar PDR (.md)
                </a>
              )}
            </div>
          </div>

          {/* Billing History List */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 font-sans">Histórico de Cobranças</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-white/40 font-mono uppercase tracking-wider">
                    <th className="pb-3 font-semibold">ID da Fatura</th>
                    <th className="pb-3 font-semibold">Data de Emissão</th>
                    <th className="pb-3 font-semibold">Plano Adquirido</th>
                    <th className="pb-3 font-semibold">Valor Total</th>
                    <th className="pb-3 font-semibold">Situação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-4 font-mono text-white/80">{inv.id}</td>
                      <td className="py-4 text-white/60">{inv.date}</td>
                      <td className="py-4 font-semibold text-white">Plano {inv.plan}</td>
                      <td className="py-4 font-bold font-mono">
                        {inv.currency === "USD" ? `$ ${inv.amount.toFixed(2)}` : `R$ ${inv.amount.toFixed(2)}`}
                      </td>
                      <td className="py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-success-emerald/10 text-success-emerald border border-success-emerald/20 font-semibold font-mono text-[10px]">
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {checkoutStep === "checkout" && selectedPlan && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Order Summary */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 bg-[#0c0c0e] lg:col-span-1 space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">Resumo do Pedido</h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-white/40">Plano Selecionado:</span>
                <strong className="text-white font-semibold uppercase text-sm">Plano {selectedPlan}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/40">Período de Assinatura:</span>
                <span className="text-white/60">Mensal (Renovação automática)</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/5 pt-4">
                <span className="text-white/40 font-medium">Subtotal:</span>
                <span className="text-white/80 font-bold font-mono text-sm">{formattedCost(selectedPlan)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-white/40 font-medium">Taxas e Encargos:</span>
                <span className="text-success-emerald font-bold font-mono">R$ 0,00</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <strong className="text-amber-500 font-bold">Total a Pagar:</strong>
                <strong className="text-amber-500 font-black font-mono text-lg">{formattedCost(selectedPlan)}</strong>
              </div>
            </div>

            <button 
              onClick={() => setCheckoutStep("pricing")}
              className="w-full py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-all text-xs font-semibold text-center cursor-pointer"
            >
              Alterar Plano Selecionado
            </button>
          </div>

          {/* Interactive Payment form */}
          <div className="glass-card rounded-2xl p-6 border border-white/15 bg-[#0a0a0c] lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h3 className="text-lg font-bold text-white">Método de Pagamento</h3>
              <div className="flex bg-white/5 border border-white/15 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${paymentMethod === "card" ? "bg-amber-500 text-black" : "text-white/40 hover:text-white"}`}
                >
                  <CardIcon className="w-3.5 h-3.5" />
                  Cartão
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("pix")}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${paymentMethod === "pix" ? "bg-amber-500 text-black" : "text-white/40 hover:text-white"}`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  PIX
                </button>
              </div>
            </div>

            {paymentMethod === "card" ? (
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">Nome Impresso no Cartão</label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    placeholder="CARLOS ALBERTO WEALTH"
                    className="w-full bg-[#131315] border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-amber-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">Número do Cartão de Crédito</label>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    placeholder="4000 1234 5678 9010"
                    value={cardNumber}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
                      setCardNumber(v);
                    }}
                    className="w-full bg-[#131315] border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-amber-500/40 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">Vencimento</label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      placeholder="MM/AA"
                      value={expiry}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, "");
                        if (v.length > 2) v = `${v.slice(0, 2)}/${v.slice(2, 4)}`;
                        setExpiry(v);
                      }}
                      className="w-full bg-[#131315] border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-amber-500/40 font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">Código CVV</label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      placeholder="382"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-[#131315] border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-amber-500/40 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-sm hover:from-amber-400 hover:to-orange-500 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Processando Pagamento Seguro...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4.5 h-4.5" />
                        Confirmar e Ativar Assinatura
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6 text-center py-4">
                <p className="text-xs text-white/60 leading-relaxed max-w-md mx-auto">
                  Escaneie o código QR abaixo com o aplicativo do seu banco para ativar instantaneamente o seu plano por PIX.
                </p>

                {/* Simulated QR code box */}
                <div className="w-44 h-44 bg-white rounded-2xl p-3 mx-auto flex items-center justify-center border-4 border-amber-500/20">
                  <svg className="w-full h-full text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" strokeWidth="2" />
                    <rect x="14" y="3" width="7" height="7" strokeWidth="2" />
                    <rect x="3" y="14" width="7" height="7" strokeWidth="2" />
                    <path d="M14 14h2v2h-2zm4 0h2v2h-2zm-2 4h2v2h-2zm4 0h2v2h-2zm-4-2h2v-2h-2zm4-2h2v2h-2zm-6 6h2v-2h-2z" />
                  </svg>
                </div>

                <div className="space-y-3 max-w-sm mx-auto">
                  <button
                    onClick={copyPixCode}
                    className="w-full py-2.5 px-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold text-white transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {copiedPix ? "Código PIX Copiado!" : "Copiar Chave Copia-e-Cola"}
                  </button>

                  <button
                    onClick={handlePaymentSubmit}
                    disabled={loading}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-sm hover:from-amber-400 hover:to-orange-500 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Aguardando confirmação do PIX...
                      </>
                    ) : (
                      "Simular Confirmação de Pagamento PIX"
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {checkoutStep === "success" && selectedPlan && (
        <div className="glass-card rounded-2xl border-2 border-success-emerald/30 bg-success-emerald/[0.02] p-8 text-center max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 bg-success-emerald/10 border border-success-emerald/20 text-success-emerald rounded-full flex items-center justify-center mx-auto animate-bounce">
            <ShieldCheck className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white font-sans uppercase">Assinatura Ativada!</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Obrigado! Sua transação foi liquidada e seu acesso ao <strong className="text-amber-500 uppercase tracking-wide">Plano {selectedPlan}</strong> já está 100% ativo nos servidores de nuvem.
            </p>
          </div>

          <div className="bg-[#0c0c0e] border border-white/5 rounded-xl p-4 text-xs font-mono space-y-1 text-left max-w-sm mx-auto">
            <p className="text-white/40">Status: <span className="text-success-emerald font-bold">CONCLUÍDO</span></p>
            <p className="text-white/40">Nível do Token: <span className="text-white font-bold">{selectedPlan} Member</span></p>
            <p className="text-white/40">Renovação: <span className="text-white">Mensal Automática</span></p>
            <p className="text-white/40">Cobrança: <span className="text-white">{formattedCost(selectedPlan)}</span></p>
          </div>

          <button
            onClick={() => setCheckoutStep("pricing")}
            className="py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-xs hover:from-amber-400 hover:to-orange-500 transition-all cursor-pointer shadow-lg shadow-orange-950/20"
          >
            Retornar aos Planos
          </button>
        </div>
      )}

    </div>
  );
}
