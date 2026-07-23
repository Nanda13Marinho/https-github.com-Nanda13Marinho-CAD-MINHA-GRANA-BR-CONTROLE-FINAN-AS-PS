import React, { useState, useEffect } from "react";
import { AppData, Transaction, Leak } from "./types";
import HomeDashboard from "./components/HomeDashboard";
import DetailedDashboard from "./components/DetailedDashboard";
import CashFlowView from "./components/CashFlowView";
import RadarTrackerView from "./components/RadarTrackerView";
import AIChatView from "./components/AIChatView";
import ScannerModal from "./components/ScannerModal";
import AddTransactionModal from "./components/AddTransactionModal";

// Integrate the 5 newly built views
import SplashView from "./components/SplashView";
import AuthView from "./components/AuthView";
import InitialSetupView from "./components/InitialSetupView";
import PlansView from "./components/PlansView";
import AdminDashboard from "./components/AdminDashboard";
import Footer from "./components/Footer";

import { 
  Compass, 
  BarChart3, 
  ArrowLeftRight, 
  Radar, 
  MessageSquare, 
  Menu, 
  X, 
  User, 
  Sparkles, 
  LogOut, 
  Settings, 
  Bell, 
  Globe,
  Plus,
  ShieldCheck,
  CreditCard,
  Sun,
  Moon,
  Download,
  FileText
} from "lucide-react";

interface UserSession {
  name: string;
  email: string;
  role: "user" | "admin";
  plan: "Gratuito" | "Pro" | "Premium";
  initialSetupCompleted: boolean;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "detailed" | "cashflow" | "radar" | "chat" | "plans" | "admin">("dashboard");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const isLight = theme === "light";
  const [currency, setCurrency] = useState<"USD" | "BRL">("BRL");
  const [showScanner, setShowScanner] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [addModalType, setAddModalType] = useState<"income" | "expense">("expense");
  const [chatLoading, setChatLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTriggerAdd = (type: "income" | "expense" = "expense") => {
    setAddModalType(type);
    setShowAdd(true);
  };
  
  // App-wide session states
  const [splashCompleted, setSplashCompleted] = useState<boolean>(() => {
    return localStorage.getItem("cmg_splash_done") === "true";
  });
  const [user, setUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem("cmg_session");
    return saved ? JSON.parse(saved) : null;
  });

  // App-wide persistent database state
  const [demoDb, setDemoDb] = useState<AppData | null>(null);
  const [data, setData] = useState<AppData>({
    transactions: [],
    goals: [],
    cards: [],
    leaks: [],
    recurring: [],
    chatMessages: [],
    budget: [],
    ocrLogs: []
  });

  // Action feedback toasts
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

  const triggerToast = (message: string, type: "success" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Persist session state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("cmg_session", JSON.stringify(user));
    } else {
      localStorage.removeItem("cmg_session");
    }
  }, [user]);

  const handleSplashComplete = () => {
    setSplashCompleted(true);
    localStorage.setItem("cmg_splash_done", "true");
  };

  const handleLoginSuccess = (loggedInUser: UserSession) => {
    setUser(loggedInUser);
    triggerToast(`Bem-vindo, ${loggedInUser.name}!`);
    
    // Automatically route to appropriate screen
    if (loggedInUser.role === "admin") {
      setActiveTab("admin");
    } else {
      setActiveTab("dashboard");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setSplashCompleted(true);
    localStorage.setItem("cmg_splash_done", "true");
    localStorage.removeItem("cmg_session");
    setActiveTab("dashboard");
    triggerToast("Você saiu do sistema com segurança.", "info");
  };

  const handleSetupComplete = (setup: { currency: "USD" | "BRL"; goalName: string; goalTarget: number }) => {
    setCurrency(setup.currency);
    
    // Create first target goal in DB
    const newGoal = {
      id: `goal_${Date.now()}`,
      name: setup.goalName,
      target: setup.goalTarget,
      current: 0
    };

    const nextDb = {
      ...data,
      goals: [newGoal, ...data.goals]
    };

    syncDb(nextDb);

    if (user) {
      const updatedUser = {
        ...user,
        initialSetupCompleted: true
      };
      setUser(updatedUser);

      // Persist user in registered list for future logins
      try {
        const stored = localStorage.getItem("cmg_registered_users");
        const list = stored ? JSON.parse(stored) : [];
        const existingIdx = list.findIndex((u: any) => u.email.toLowerCase() === updatedUser.email.toLowerCase());
        if (existingIdx >= 0) {
          list[existingIdx] = updatedUser;
        } else {
          list.push(updatedUser);
        }
        localStorage.setItem("cmg_registered_users", JSON.stringify(list));
      } catch (e) {
        console.error(e);
      }
    }
    triggerToast("Configuração inicial do patrimônio concluída!", "success");
  };

  // Fetch initial demo data from backend
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/data");
        if (res.ok) {
          const db: AppData = await res.json();
          setDemoDb(db);
        }
      } catch (e) {
        console.error("Error loading db.json", e);
      }
    }
    loadData();
  }, []);

  // Isolate database per user session
  useEffect(() => {
    const isDemoUser = !user || user.email.toLowerCase() === "carlos@cademinhagrana.com" || user.email.toLowerCase() === "admin@cademinhagrana.com";

    if (isDemoUser) {
      if (demoDb) {
        setData(demoDb);
      }
    } else if (user) {
      // Real client account - load user's clean database from localStorage
      const userKey = `cmg_user_db_${user.email.toLowerCase()}`;
      const saved = localStorage.getItem(userKey);
      if (saved) {
        try {
          setData(JSON.parse(saved));
        } catch (e) {
          console.error("Error parsing user db", e);
        }
      } else {
        // Initialize brand clean dataset for newly registered real client
        const cleanDb: AppData = {
          transactions: [],
          goals: [],
          cards: [],
          leaks: [],
          recurring: [],
          chatMessages: [],
          budget: [],
          ocrLogs: []
        };
        setData(cleanDb);
        localStorage.setItem(userKey, JSON.stringify(cleanDb));
      }
    }
  }, [user, demoDb]);

  // Sync to appropriate storage (localStorage for real users, /api/data for demo mode)
  const syncDb = async (updatedData: AppData) => {
    try {
      setData(updatedData);
      const isDemoUser = !user || user.email.toLowerCase() === "carlos@cademinhagrana.com" || user.email.toLowerCase() === "admin@cademinhagrana.com";
      
      if (!isDemoUser && user) {
        const userKey = `cmg_user_db_${user.email.toLowerCase()}`;
        localStorage.setItem(userKey, JSON.stringify(updatedData));
      } else {
        await fetch("/api/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData)
        });
      }
    } catch (e) {
      console.error("Failed to sync database", e);
    }
  };

  // Chat request proxy to Gemini API
  const handleSendMessage = async (text: string) => {
    setChatLoading(true);
    // Append user message instantly
    const localChat = [...data.chatMessages, { id: `user_${Date.now()}`, sender: "user" as const, text }];
    setData(prev => ({ ...prev, chatMessages: localChat }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      if (!res.ok) {
        throw new Error("Falha ao comunicar com o modelo Gemini.");
      }

      const json = await res.json();
      if (json.reply) {
        setData(json.db);
      }
    } catch (e: any) {
      triggerToast(e.message || "Erro no processamento da IA", "info");
    } finally {
      setChatLoading(false);
    }
  };

  // Manual Transaction saving
  const handleSaveTransaction = async (newT: Omit<Transaction, "id">) => {
    const fullT: Transaction = {
      ...newT,
      id: `manual_${Date.now()}`
    };

    const nextDb = {
      ...data,
      transactions: [fullT, ...data.transactions]
    };
    await syncDb(nextDb);
    triggerToast(`Lançamento "${fullT.merchant}" salvo com sucesso!`);
  };

  // OCR scan importation
  const handleOcrSuccess = async (scanned: Transaction) => {
    const nextDb = {
      ...data,
      transactions: [scanned, ...data.transactions]
    };
    await syncDb(nextDb);
    triggerToast(`Lançamento OCR "${scanned.merchant}" importado com sucesso!`);
  };

  // Actionable Radar Leaks Resolver
  const handleUpdateLeakStatus = async (id: string, status: Leak["status"]) => {
    const nextLeaks = data.leaks.map((leak) => {
      if (leak.id === id) {
        return { ...leak, status };
      }
      return leak;
    });

    const targetLeak = data.leaks.find(l => l.id === id);
    const costFormatted = currency === "USD" ? `$${(targetLeak?.cost || 0) / 5}` : `R$ ${targetLeak?.cost},00`;

    // Calculate effect as a refunded transaction
    let refundT: Transaction | null = null;
    if (status === "cancelled") {
      refundT = {
        id: `refund_${Date.now()}`,
        merchant: `Estorno: ${targetLeak?.name}`,
        category: "Other",
        amount: targetLeak?.cost || 0, // Positives are income
        currency: "BRL",
        date: "Hoje",
        type: "income",
        status: "Cleared"
      };
    }

    const nextDb = {
      ...data,
      leaks: nextLeaks,
      transactions: refundT ? [refundT, ...data.transactions] : data.transactions
    };
    await syncDb(nextDb);

    if (status === "cancelled") {
      triggerToast(`Inscrição "${targetLeak?.name}" cancelada! Saldo reembolsado em ${costFormatted}.`);
    } else if (status === "consolidated") {
      triggerToast(`Serviços em "${targetLeak?.name}" consolidados com sucesso!`);
    } else if (status === "challenged") {
      triggerToast(`Tarifa bancária "${targetLeak?.name}" contestada de volta!`);
    } else {
      triggerToast(`Vazamento ignorado.`);
    }
  };

  // Review pending manual transaction psychology analysis using AI Reviewed flag
  const handleReviewTransaction = async (id: string) => {
    const nextT = data.transactions.map((t) => {
      if (t.id === id) {
        return { ...t, status: "Cleared" as const, aiReviewed: true };
      }
      return t;
    });

    const nextDb = {
      ...data,
      transactions: nextT
    };
    await syncDb(nextDb);
    triggerToast("Análise de Psicologia de Gastos concluída pelo consultor de IA!");
  };

  // Cash Flow executing simulated advisory transfers
  const handleExecuteTransfer = async (amount: number, dest: string) => {
    const transferT: Transaction = {
      id: `transfer_${Date.now()}`,
      merchant: `Transferência para ${dest}`,
      category: "Investments",
      amount: -amount,
      currency,
      type: "expense",
      status: "Cleared",
      date: "Hoje"
    };

    const nextDb = {
      ...data,
      transactions: [transferT, ...data.transactions]
    };
    await syncDb(nextDb);
    triggerToast(`Transferência de ${currency === "USD" ? `$${amount}` : `R$ ${amount}`} para ${dest} efetuada!`);
  };

  // Step 1: Render Loading Splash
  if (!splashCompleted) {
    return <SplashView onComplete={handleSplashComplete} />;
  }

  // Step 2: Render Authentication Shell
  if (!user) {
    return <AuthView onLoginSuccess={handleLoginSuccess} />;
  }

  // Step 3: Render User Onboarding wizard (Moeda e Metas)
  if (!user.initialSetupCompleted) {
    return <InitialSetupView userEmail={user.email} onComplete={handleSetupComplete} />;
  }

  // Step 4: Render Full SaaS Application
  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-300 ${isLight ? "bg-slate-100 text-slate-900" : "bg-[#050505] text-[#E0D8D0]"}`}>
      
      {/* Dynamic Action Toasts */}
      {toast && (
        <div className="fixed top-6 right-6 bg-[#0a0a0c] border border-amber-500/30 text-[#E0D8D0] rounded-xl py-3.5 px-5 flex items-center gap-3 shadow-2xl z-50 animate-slide-in max-w-sm">
          <Sparkles className="w-4.5 h-4.5 text-amber-500 shrink-0" />
          <p className="text-xs font-semibold leading-relaxed font-sans">{toast.message}</p>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 bg-[#050505] border-r border-white/10 w-64 flex flex-col z-40 transition-transform lg:translate-x-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        
        {/* Logo / Brand block */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-700 rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/20 shrink-0">
              <span className="text-black font-black text-xl font-sans">$</span>
            </div>
            <div>
              <h1 className="text-sm font-black tracking-widest text-white uppercase font-sans">
                Cadê Minha Grana
              </h1>
              <span className="text-[10px] text-champagne-gold font-mono uppercase tracking-widest block mt-0.5">
                AI Wealth Manager
              </span>
            </div>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
            className="lg:hidden text-white/40 hover:text-[#E0D8D0]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto hide-scrollbar">
          
          <button 
            onClick={() => { setActiveTab("dashboard"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "dashboard" 
                ? "bg-champagne-gold/10 border border-champagne-gold/25 text-champagne-gold" 
                : "text-white/40 hover:text-[#E0D8D0] hover:bg-white/5 border border-transparent"
            }`}
          >
            <Compass className="w-5 h-5 shrink-0" />
            Dashboard Principal
          </button>

          <button 
            onClick={() => { setActiveTab("detailed"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "detailed" 
                ? "bg-champagne-gold/10 border border-champagne-gold/25 text-champagne-gold" 
                : "text-white/40 hover:text-[#E0D8D0] hover:bg-white/5 border border-transparent"
            }`}
          >
            <BarChart3 className="w-5 h-5 shrink-0" />
            Análise Patrimonial
          </button>

          <button 
            onClick={() => { setActiveTab("cashflow"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "cashflow" 
                ? "bg-champagne-gold/10 border border-champagne-gold/25 text-champagne-gold" 
                : "text-white/40 hover:text-[#E0D8D0] hover:bg-white/5 border border-transparent"
            }`}
          >
            <ArrowLeftRight className="w-5 h-5 shrink-0" />
            Projeção de Fluxo
          </button>

          <button 
            onClick={() => { setActiveTab("radar"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "radar" 
                ? "bg-champagne-gold/10 border border-champagne-gold/25 text-champagne-gold" 
                : "text-white/40 hover:text-[#E0D8D0] hover:bg-white/5 border border-transparent"
            }`}
          >
            <Radar className="w-5 h-5 shrink-0" />
            Radar de Assinaturas
          </button>

          <button 
            onClick={() => { setActiveTab("chat"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "chat" 
                ? "bg-champagne-gold/10 border border-champagne-gold/25 text-champagne-gold font-bold" 
                : "text-white/40 hover:text-[#E0D8D0] hover:bg-white/5 border border-transparent"
            }`}
          >
            <MessageSquare className="w-5 h-5 shrink-0" />
            Assistente IA
          </button>

          {/* SaaS Plans / Subscription billing control */}
          <button 
            onClick={() => { setActiveTab("plans"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "plans" 
                ? "bg-amber-500/10 border border-amber-500/25 text-amber-500" 
                : "text-white/40 hover:text-[#E0D8D0] hover:bg-white/5 border border-transparent"
            }`}
          >
            <ShieldCheck className="w-5 h-5 shrink-0" />
            Planos & Assinaturas
          </button>

        </nav>

        {/* User profile footer info */}
        <div className="p-4 border-t border-white/10 bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs uppercase shrink-0">
              {user.name.slice(0, 1)}
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                {/* Online Green Dot placed in front of user name */}
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" title="Online"></span>
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
              </div>
              {user.role === 'admin' ? (
                <p className="text-[10px] text-red-400 font-mono font-bold uppercase tracking-wider mt-0.5">
                  Admin
                </p>
              ) : (
                <p className="text-[10px] text-amber-400/80 font-mono font-semibold uppercase tracking-wider mt-0.5">
                  {user.plan || "Gratuito"}
                </p>
              )}
            </div>
            <button 
              onClick={handleLogout}
              title="Sair com segurança"
              aria-label="Sign out" 
              className="text-white/40 hover:text-danger-crimson transition-colors cursor-pointer p-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>

      {/* Main Container */}
      <div className="flex-grow lg:pl-64 flex flex-col min-h-screen">
        
        {/* Global Floating Header */}
        <header className="h-16 border-b border-white/10 bg-[#050505]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-mono text-white/40 hidden md:inline">
              MÓDULO DE GESTÃO PATRIMONIAL CONECTADO • V1.0 • SEGURO
            </span>

            {user.email.toLowerCase() === "carlos@cademinhagrana.com" || user.email.toLowerCase() === "admin@cademinhagrana.com" ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-semibold">
                ⚡ Modo Demo
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            
            {/* Mode / Theme Selector Toggle Next to Currency */}
            <button
              onClick={() => {
                const nextTheme = theme === "dark" ? "light" : "dark";
                setTheme(nextTheme);
                triggerToast(nextTheme === "light" ? "Modo Claro ativado" : "Modo Escuro ativado", "info");
              }}
              className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                isLight 
                  ? "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-700" 
                  : "bg-white/5 hover:bg-white/10 border-white/10 text-amber-400"
              }`}
              title={isLight ? "Alternar para Modo Escuro" : "Alternar para Modo Claro"}
            >
              {isLight ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden sm:inline text-[11px]">Modo Escuro</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline text-[11px]">Modo Claro</span>
                </>
              )}
            </button>

            {/* Discreet Currency Conversion Toggle (Without country initials) */}
            <div className="bg-white/5 border border-white/10 rounded-md p-0.5 flex items-center shadow-inner">
              <button 
                onClick={() => setCurrency("BRL")}
                className={`px-2 py-0.5 text-[10px] font-bold rounded transition-all cursor-pointer ${currency === "BRL" ? "bg-amber-500 text-black shadow-sm" : "text-white/40 hover:text-[#E0D8D0]"}`}
                title="Real (R$)"
              >
                R$
              </button>
              <button 
                onClick={() => setCurrency("USD")}
                className={`px-2 py-0.5 text-[10px] font-bold rounded transition-all cursor-pointer ${currency === "USD" ? "bg-amber-500 text-black shadow-sm" : "text-white/40 hover:text-[#E0D8D0]"}`}
                title="Dólar ($)"
              >
                $
              </button>
            </div>

            {/* Simulated Notification bell */}
            <button aria-label="Notifications" className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-on-surface-variant hover:text-white hover:bg-white/10 transition-all shrink-0">
              <Bell className="w-4 h-4" />
            </button>

          </div>
        </header>

        {/* Workspace Body content */}
        <main className="flex-grow p-6 md:p-8 max-w-7xl w-full mx-auto pb-16">
          {activeTab === "dashboard" && (
            <HomeDashboard 
              data={data}
              currency={currency}
              userEmail={user.email}
              onTriggerScanner={() => setShowScanner(true)}
              onTriggerAdd={handleTriggerAdd}
              onReviewTransaction={handleReviewTransaction}
            />
          )}

          {activeTab === "detailed" && (
            <DetailedDashboard 
              data={data}
              currency={currency}
            />
          )}

          {activeTab === "cashflow" && (
            <CashFlowView 
              data={data}
              currency={currency}
              onTriggerAdd={handleTriggerAdd}
              onExecuteTransfer={handleExecuteTransfer}
            />
          )}

          {activeTab === "radar" && (
            <RadarTrackerView 
              data={data}
              currency={currency}
              onUpdateLeakStatus={handleUpdateLeakStatus}
            />
          )}

          {activeTab === "chat" && (
            <AIChatView 
              data={data}
              onSendMessage={handleSendMessage}
              loading={chatLoading}
            />
          )}

          {activeTab === "plans" && (
            <PlansView 
              currentPlan={user.plan}
              userRole={user.role}
              onUpgrade={(newPlan) => {
                setUser({
                  ...user,
                  plan: newPlan
                });
                triggerToast(`Parabéns! Você atualizou sua assinatura para o plano ${newPlan}.`);
              }}
              currency={currency}
            />
          )}

          {activeTab === "admin" && (
            <AdminDashboard 
              data={data}
              currency={currency}
              onExitAdmin={() => setActiveTab("dashboard")}
              onUpdateData={async (nextData) => {
                await syncDb(nextData);
                triggerToast("Banco de dados atualizado pelo Administrador!");
              }}
            />
          )}
        </main>

        {/* Dedicated App Footer */}
        <Footer onTriggerToast={triggerToast} />

      </div>

      {/* Modals & Overlays */}
      {showScanner && (
        <ScannerModal 
          onClose={() => setShowScanner(false)}
          onSuccess={handleOcrSuccess}
        />
      )}

      {showAdd && (
        <AddTransactionModal 
          onClose={() => setShowAdd(false)}
          onSave={handleSaveTransaction}
          initialType={addModalType}
        />
      )}

    </div>
  );
}
