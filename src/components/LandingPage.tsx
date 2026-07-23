import React, { useState, useEffect } from "react";
import { 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Mic, 
  Sparkles, 
  TrendingUp, 
  Check, 
  FileText, 
  LifeBuoy, 
  Download,
  Smartphone,
  CheckCircle,
  CreditCard,
  Zap
} from "lucide-react";
import LegalModals from "./LegalModals";

interface LandingPageProps {
  onLoginSuccess: (user: { 
    name: string; 
    email: string; 
    role: "user" | "admin"; 
    plan: "Gratuito" | "Pro" | "Premium"; 
    initialSetupCompleted: boolean 
  }) => void;
}

type AuthScreenState = "login" | "signup" | "forgot" | "verify";

export default function LandingPage({ onLoginSuccess }: LandingPageProps) {
  const [authScreen, setAuthScreen] = useState<AuthScreenState>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Legal Modal control
  const [activeLegalModal, setActiveLegalModal] = useState<"privacy" | "terms" | "support" | null>(null);

  // Interactive Loop Frame State for Hero Section
  const [heroLoopIndex, setHeroLoopIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroLoopIndex((prev) => (prev + 1) % 3);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const handleAuthAction = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanEmail = email.toLowerCase().trim();

    if (authScreen === "signup") {
      if (!name.trim() || !cleanEmail || !password) {
        setError("Por favor, preencha seu nome completo, e-mail e senha para criar a conta.");
        return;
      }
      setLoading(true);

      const newUser = {
        name: name.trim(),
        email: cleanEmail,
        password: password,
        role: "user" as const,
        plan: "Gratuito" as const,
        initialSetupCompleted: false,
      };

      // Save user to registered users in localStorage
      try {
        const stored = localStorage.getItem("cmg_registered_users");
        const list = stored ? JSON.parse(stored) : [];
        const filtered = list.filter((u: any) => u.email.toLowerCase() !== cleanEmail);
        filtered.push(newUser);
        localStorage.setItem("cmg_registered_users", JSON.stringify(filtered));
      } catch (err) {
        console.error("Error saving registered user:", err);
      }

      setTimeout(() => {
        setLoading(false);
        onLoginSuccess({
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          plan: newUser.plan,
          initialSetupCompleted: newUser.initialSetupCompleted
        });
      }, 800);

    } else if (authScreen === "login") {
      if (!cleanEmail || !password) {
        setError("E-mail e senha são obrigatórios para acessar.");
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        
        // Check if user was previously saved in registered list
        let registeredUser: any = null;
        try {
          const stored = localStorage.getItem("cmg_registered_users");
          if (stored) {
            const list = JSON.parse(stored);
            registeredUser = list.find((u: any) => u.email.toLowerCase() === cleanEmail);
          }
        } catch (e) {
          console.error(e);
        }

        if (cleanEmail === "futurehumanty2023ia@gmail.com" || cleanEmail === "futurehuanty2023ia@gmail.com") {
          onLoginSuccess({
            name: "Administrador do Sistema",
            email: cleanEmail,
            role: "admin",
            plan: "Premium",
            initialSetupCompleted: true,
          });
        } else if (cleanEmail === "admin@cademinhagrana.com") {
          onLoginSuccess({
            name: "Administrador Geral",
            email: "admin@cademinhagrana.com",
            role: "admin",
            plan: "Premium",
            initialSetupCompleted: true,
          });
        } else if (cleanEmail === "carlos@cademinhagrana.com") {
          onLoginSuccess({
            name: "Carlos Wealth",
            email: "carlos@cademinhagrana.com",
            role: "user",
            plan: "Premium",
            initialSetupCompleted: true,
          });
        } else if (registeredUser) {
          onLoginSuccess({
            name: registeredUser.name,
            email: registeredUser.email,
            role: registeredUser.role || "user",
            plan: registeredUser.plan || "Gratuito",
            initialSetupCompleted: registeredUser.initialSetupCompleted ?? true
          });
        } else {
          // Derive clean name from email if not explicitly registered
          const namePart = cleanEmail.split("@")[0] || "Usuário";
          const formattedName = namePart
            .split(/[._-]/)
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ");

          onLoginSuccess({
            name: name.trim() || formattedName,
            email: cleanEmail,
            role: "user",
            plan: "Gratuito",
            initialSetupCompleted: true,
          });
        }
      }, 800);

    } else if (authScreen === "forgot") {
      if (!cleanEmail) {
        setError("Informe seu e-mail cadastrado para redefinir a senha.");
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        alert(`E-mail com instruções para redefinição de senha enviado com sucesso para ${cleanEmail}!`);
        setAuthScreen("login");
      }, 800);
    }
  };

  // Google OAuth Login Simulation
  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    const cleanEmail = email.trim().toLowerCase() || "usuario.google@gmail.com";
    const namePart = cleanEmail.split("@")[0];
    const derivedName = namePart
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

    setTimeout(() => {
      setGoogleLoading(false);
      onLoginSuccess({
        name: name.trim() || derivedName || "Usuário Google",
        email: cleanEmail,
        role: "user",
        plan: "Gratuito",
        initialSetupCompleted: true,
      });
    }, 800);
  };

  const skipToDemo = (role: "user" | "admin") => {
    if (role === "admin") {
      onLoginSuccess({
        name: "Administrador do Sistema",
        email: "admin@cademinhagrana.com",
        role: "admin",
        plan: "Premium",
        initialSetupCompleted: true,
      });
    } else {
      onLoginSuccess({
        name: "Carlos Wealth",
        email: "carlos@cademinhagrana.com",
        role: "user",
        plan: "Premium",
        initialSetupCompleted: true,
      });
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#E0D8D0] flex flex-col font-sans selection:bg-amber-500 selection:text-black relative overflow-x-hidden">
      
      {/* Background Lighting Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[800px] right-0 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* TOP HEADER */}
      <header className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
            <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <span className="text-base font-black tracking-widest text-white uppercase font-sans block">
              Cadê Minha Grana
            </span>
            <span className="text-[9px] text-amber-500 font-mono uppercase tracking-widest block">
              AI WEALTH MANAGEMENT
            </span>
          </div>
        </div>

        {/* Header Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-white/70">
          <button onClick={() => scrollToSection("dobra-1")} className="hover:text-amber-400 transition-colors cursor-pointer">
            Início
          </button>
          <button onClick={() => scrollToSection("dobra-2")} className="hover:text-amber-400 transition-colors cursor-pointer">
            Entrar / Cadastro
          </button>
          <button onClick={() => scrollToSection("dobra-3")} className="hover:text-amber-400 transition-colors cursor-pointer">
            Planos
          </button>
        </div>

        {/* Action Header Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scrollToSection("dobra-2")}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-xs hover:from-amber-400 hover:to-orange-500 transition-all cursor-pointer shadow-md"
          >
            Acessar
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 1ª DOBRA: HERO SECTION COM FRAME INTERATIVO EM LOOP */}
      {/* ========================================================= */}
      <section id="dobra-1" className="py-16 md:py-24 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Hero Text Column */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            GESTAO FINANCEIRA INTELIGENTE COM IA MULTIMODAL
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            O Controle Financeiro por <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Voz e Visão IA</span> que Transforma Seu Patrimônio
          </h1>

          <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-2xl">
            Abandone o preenchimento manual maçante de planilhas. Com o <strong>Cadê Minha Grana</strong>, você apenas fala o que gastou ou envia um print do recibo — nossa IA categoriza, calcula o fluxo futuro e descobre vazamentos automaticamente.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => scrollToSection("dobra-2")}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold text-sm hover:from-amber-400 hover:to-orange-500 transition-all flex items-center gap-2 shadow-xl shadow-amber-500/20 cursor-pointer"
            >
              Testar Agora Gratuitamente
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => scrollToSection("dobra-3")}
              className="px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-all cursor-pointer"
            >
              Conhecer os Planos
            </button>
          </div>

          {/* Social Proof Seals */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-white/50 font-mono">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Criptografia Privada</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Lançamento em 3 Segundos por Voz</span>
            </div>
          </div>
        </div>

        {/* Right Column: INTERACTIVE FRAME IN LOOP */}
        <div className="lg:col-span-5">
          <div className="glass-card rounded-3xl border border-white/10 p-6 bg-[#0c0c0e] shadow-2xl relative overflow-hidden space-y-5">
            
            {/* Window Top Controls */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                <span className="text-[10px] font-mono text-white/40 ml-2">SIMULADOR DE ENTRADA POR IA</span>
              </div>
            </div>

            {/* Loop Interactive Frame Steps */}
            <div className="min-h-[220px] flex flex-col justify-center space-y-4">
              
              {/* STATE 0: Voice Command Input */}
              {heroLoopIndex === 0 && (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                    <div className="w-10 h-10 rounded-full bg-amber-500 text-black flex items-center justify-center animate-pulse shrink-0">
                      <Mic className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-400 font-mono font-bold block uppercase">Comando de Voz Capturado:</span>
                      <p className="text-xs text-white italic font-semibold">"Gastei R$ 45 no almoço do Outback hoje"</p>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-white/40 text-center animate-pulse">
                    Enviando áudio para o modelo multimodal Gemini AI...
                  </div>
                </div>
              )}

              {/* STATE 1: AI Processing & Extraction */}
              {heroLoopIndex === 1 && (
                <div className="space-y-3 animate-fade-in">
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        IA Extraiu com Sucesso:
                      </span>
                      <span className="text-white/40">Hoje, 13:45</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                      <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                        <span className="text-[9px] text-white/40 block font-mono">ESTABELECIMENTO</span>
                        <span className="font-bold text-white">Outback Steakhouse</span>
                      </div>
                      <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                        <span className="text-[9px] text-white/40 block font-mono">VALOR & CATEGORIA</span>
                        <span className="font-bold text-red-400 font-mono">-R$ 45,00 (Restaurantes)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STATE 2: Balance & Insights Updated */}
              {heroLoopIndex === 2 && (
                <div className="space-y-3 animate-fade-in">
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-amber-400 font-bold font-mono">AI INSIGHT GERADO:</span>
                      <span className="text-[10px] font-mono text-white/40">Real-time</span>
                    </div>
                    <p className="text-xs text-white/90 leading-relaxed font-sans">
                      "Com este gasto computado, você ainda possui R$ 1.250 no orçamento de Lazer este mês. Sugerimos destinar R$ 150 para sua Meta de Reserva de Emergência."
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Loop Indicator Dots */}
            <div className="flex items-center justify-center gap-2 pt-2 border-t border-white/10">
              <div className={`h-1.5 rounded-full transition-all ${heroLoopIndex === 0 ? "w-6 bg-amber-500" : "w-1.5 bg-white/20"}`}></div>
              <div className={`h-1.5 rounded-full transition-all ${heroLoopIndex === 1 ? "w-6 bg-emerald-500" : "w-1.5 bg-white/20"}`}></div>
              <div className={`h-1.5 rounded-full transition-all ${heroLoopIndex === 2 ? "w-6 bg-amber-500" : "w-1.5 bg-white/20"}`}></div>
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================= */}
      {/* 2ª DOBRA: CENTRAL DE LOGIN, CADASTRO, GOOGLE AUTH & SENHA */}
      {/* ========================================================= */}
      <section id="dobra-2" className="py-16 px-6 bg-[#09090b] border-y border-white/10 w-full">
        <div className="max-w-md mx-auto space-y-6">
          
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              ÁREA DE ACESSO
            </span>
            <h2 className="text-2xl font-bold text-white font-sans">
              Entre na Sua Conta
            </h2>
            <p className="text-xs text-white/60">
              Acesse seu dashboard seguro e gerencie seu patrimônio com IA.
            </p>
          </div>

          {/* Main Card Auth Box */}
          <div className="glass-card rounded-3xl border border-white/10 p-8 bg-[#101013] shadow-2xl space-y-6">
            
            {/* GOOGLE AUTH BUTTON */}
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-neutral-100 text-black font-bold text-xs transition-all flex items-center justify-center gap-3 cursor-pointer shadow-md disabled:opacity-50"
            >
              {googleLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Continuar com a Conta do Google</span>
                </>
              )}
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-white/10 w-full"></div>
              <span className="bg-[#101013] px-3 text-[10px] font-mono uppercase text-white/40 shrink-0">
                ou com e-mail e senha
              </span>
            </div>

            {/* Form Toggle Tabs */}
            <div className="flex bg-[#18181b] p-1 rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => { setAuthScreen("login"); setError(""); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  authScreen === "login" ? "bg-amber-500 text-black shadow" : "text-white/40 hover:text-white"
                }`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => { setAuthScreen("signup"); setError(""); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  authScreen === "signup" ? "bg-amber-500 text-black shadow" : "text-white/40 hover:text-white"
                }`}
              >
                Criar Conta
              </button>
            </div>

            {/* Error Feedback */}
            {error && (
              <div className="p-3 bg-red-950/40 border border-red-500/20 rounded-xl text-xs text-red-400 text-center font-mono">
                {error}
              </div>
            )}

            <form onSubmit={handleAuthAction} className="space-y-4">
              
              {authScreen === "forgot" && (
                <div className="text-center p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1">
                  <p className="text-xs text-amber-400 font-bold">Recuperação de Senha</p>
                  <p className="text-[11px] text-white/60">Digite seu e-mail abaixo para receber as instruções de acesso.</p>
                </div>
              )}

              {authScreen === "signup" && (
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/40 uppercase">Nome Completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-4 h-4 text-white/30" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Hadassa Estrela"
                      className="w-full bg-[#18181c] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-amber-500/40"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-white/40 uppercase">E-mail Cadastrado</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-white/30" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full bg-[#18181c] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-amber-500/40"
                  />
                </div>
              </div>

              {authScreen !== "forgot" && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono text-white/40 uppercase">Senha</label>
                    {authScreen === "login" && (
                      <button
                        type="button"
                        onClick={() => setAuthScreen("forgot")}
                        className="text-[10px] font-mono text-amber-400 hover:underline cursor-pointer"
                      >
                        Esqueceu a senha?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-4 h-4 text-white/30" />
                    
                    {/* Password Input with Eye Toggle */}
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#18181c] border border-white/10 rounded-xl py-3 pl-10 pr-10 text-xs text-white focus:outline-none focus:border-amber-500/40"
                    />

                    {/* EYE TOGGLE BUTTON */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-white/40 hover:text-white transition-colors cursor-pointer"
                      title={showPassword ? "Ocultar senha" : "Exibir senha"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold text-xs hover:from-amber-400 hover:to-orange-500 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2 shadow-lg"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : authScreen === "login" ? (
                  "Acessar Dashboard"
                ) : authScreen === "signup" ? (
                  "Criar Minha Conta"
                ) : (
                  "Enviar Link de Recuperação"
                )}
              </button>

              {authScreen === "forgot" && (
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => { setAuthScreen("login"); setError(""); }}
                    className="text-xs text-amber-400 hover:underline font-mono cursor-pointer"
                  >
                    ← Voltar para Entrar
                  </button>
                </div>
              )}

            </form>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 3ª DOBRA: CHAMADO PARA AÇÃO (CTA) & SELEÇÃO DE PLANOS */}
      {/* ========================================================= */}
      <section id="dobra-3" className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12 text-center">
        
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            ESCOLHA O SEU RITMO DE EVOLUÇÃO
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-white font-sans">
            Comece Gratuitamente ou Libere o Poder Total da IA
          </h2>
          <p className="text-xs md:text-sm text-white/60 leading-relaxed">
            Sem contratos engessados. Alterne de plano a qualquer momento ou utilize a versão Gratuita sem cartão de crédito.
          </p>
        </div>

        {/* 3 Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          
          {/* PLAN 1: Starter Free */}
          <div className="glass-card rounded-3xl border border-white/10 p-6 bg-[#0e0e11] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase text-white/40 block">PLAN STARTER</span>
              <h3 className="text-xl font-bold text-white">Gratuito</h3>
              <div className="text-2xl font-black text-white font-mono">
                R$ 0 <span className="text-xs text-white/40 font-normal">/ para sempre</span>
              </div>
              <p className="text-xs text-white/60">Ideal para quem deseja iniciar o controle financeiro por voz básico sem custos.</p>
              
              <ul className="space-y-2 text-xs text-white/80 pt-2 border-t border-white/10">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Até 30 lançamentos por Voz/Mês</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Dashboard e Análise Patrimonial</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Suporte via Comunidade</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => scrollToSection("dobra-2")}
              className="w-full py-3 rounded-xl bg-white/10 border border-white/10 text-white font-bold text-xs hover:bg-white/20 transition-all cursor-pointer text-center"
            >
              Começar Grátis Sem Cartão
            </button>
          </div>

          {/* PLAN 2: PRO */}
          <div className="glass-card rounded-3xl border border-amber-500/40 p-6 bg-[#14120f] flex flex-col justify-between space-y-6 relative overflow-hidden shadow-xl shadow-amber-500/5">
            <div className="absolute top-0 right-0 bg-amber-500 text-black font-mono font-bold text-[9px] uppercase px-3 py-1 rounded-bl-xl">
              MAIS POPULAR
            </div>

            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase text-amber-400 block">PLAN PRO WEALTH</span>
              <h3 className="text-xl font-bold text-white">Pro</h3>
              <div className="text-2xl font-black text-amber-400 font-mono">
                R$ 29 <span className="text-xs text-white/40 font-normal">/ mês</span>
              </div>
              <p className="text-xs text-white/60">Para quem exige leitor de recibos OCR por imagem e conselhos da IA sem restrições.</p>
              
              <ul className="space-y-2 text-xs text-white/80 pt-2 border-t border-white/10">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Lançamentos por Voz Ilimitados</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Leitura por OCR de Comprovantes/Prints</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Assistente Copiloto IA 24/7</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => scrollToSection("dobra-2")}
              className="w-full py-3 rounded-xl bg-amber-500 text-black font-extrabold text-xs hover:bg-amber-400 transition-all cursor-pointer text-center shadow-lg shadow-amber-500/20"
            >
              Assinar Plano Pro
            </button>
          </div>

          {/* PLAN 3: PREMIUM */}
          <div className="glass-card rounded-3xl border border-white/10 p-6 bg-[#0e0e11] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase text-orange-400 block">PLAN PREMIUM VIP</span>
              <h3 className="text-xl font-bold text-white">Premium</h3>
              <div className="text-2xl font-black text-white font-mono">
                R$ 59 <span className="text-xs text-white/40 font-normal">/ mês</span>
              </div>
              <p className="text-xs text-white/60">Acesso antecipado à Fase 2 de Automação Open Finance e suporte VIP dedicado.</p>
              
              <ul className="space-y-2 text-xs text-white/80 pt-2 border-t border-white/10">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Tudo do Plano Pro</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-orange-400 shrink-0" />
                  <span><strong>Open Finance</strong> (Segunda Fase)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Relatórios Fiscais e Consultoria IA VIP</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => scrollToSection("dobra-2")}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold text-xs hover:from-amber-400 hover:to-orange-500 transition-all cursor-pointer text-center"
            >
              Assinar Plano Premium
            </button>
          </div>

        </div>

      </section>

      {/* ========================================================= */}
      {/* RODAPÉ CORPORATIVO COMPLETO (FOOTER) */}
      {/* ========================================================= */}
      <footer className="mt-auto border-t border-white/10 bg-[#030304] py-12 px-6 w-full text-xs text-white/60">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-black text-xs">
              CMG
            </div>
            <div>
              <span className="font-bold text-white block">Cadê Minha Grana Inc.</span>
              <span className="text-[10px] text-white/40">Plataforma de Gestão Patrimonial por Inteligência Artificial</span>
            </div>
          </div>

          {/* Footer Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs">
            <button
              onClick={() => setActiveLegalModal("privacy")}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Políticas de Privacidade (LGPD)
            </button>

            <button
              onClick={() => setActiveLegalModal("terms")}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Termos de Uso
            </button>

            <button
              onClick={() => setActiveLegalModal("support")}
              className="hover:text-amber-400 transition-colors cursor-pointer text-amber-400 font-semibold flex items-center gap-1"
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              Relatar Problema / Suporte
            </button>
          </div>

          {/* Copyright */}
          <div className="text-[10px] font-mono text-white/40 text-center md:text-right">
            © 2026 Cadê Minha Grana. Todos os direitos reservados.
          </div>

        </div>
      </footer>

      {/* Legal & Support Modal */}
      <LegalModals
        activeModal={activeLegalModal}
        onClose={() => setActiveLegalModal(null)}
      />

    </div>
  );
}
