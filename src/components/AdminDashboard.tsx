import React, { useState } from "react";
import { Users, ShieldCheck, Globe, Activity, Ban, Trash2, Search, Check, RefreshCw, Lock, BarChart2, Server, Eye, ExternalLink, Settings } from "lucide-react";
import { AppData } from "../types";

interface AdminDashboardProps {
  data?: AppData;
  currency: "USD" | "BRL";
  onExitAdmin?: () => void;
  onUpdateData?: (nextData: AppData) => void;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  plan: "Gratuito" | "Pro" | "Premium";
  role: "user" | "admin";
  status: "Ativo" | "Inativo" | "Suspenso";
  joined: string;
  lastAccess: string;
}

export default function AdminDashboard({ currency, onExitAdmin }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"users" | "analytics" | "security">("users");
  
  // Search and filter states for users
  const [searchTerm, setSearchTerm] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("all");

  // Google Analytics configuration state
  const [gaMeasurementId, setGaMeasurementId] = useState("G-9X72K4M1P0");
  const [gaSaved, setGaSaved] = useState(false);

  // Registered users list state
  const [users, setUsers] = useState<AdminUser[]>([
    {
      id: "u101",
      name: "Carlos Wealth",
      email: "carlos@cademinhagrana.com",
      plan: "Premium",
      role: "user",
      status: "Ativo",
      joined: "01 Abr 2026",
      lastAccess: "Hoje, 14:32"
    },
    {
      id: "u102",
      name: "João da Silva",
      email: "joao@exemplo.com.br",
      plan: "Gratuito",
      role: "user",
      status: "Ativo",
      joined: "12 Mai 2026",
      lastAccess: "Ontem, 18:10"
    },
    {
      id: "u103",
      name: "Administrador Geral",
      email: "admin@cademinhagrana.com",
      plan: "Premium",
      role: "admin",
      status: "Ativo",
      joined: "01 Jan 2026",
      lastAccess: "Agora"
    },
    {
      id: "u104",
      name: "Mariana de Souza",
      email: "mariana.souza@corp.com",
      plan: "Pro",
      role: "user",
      status: "Ativo",
      joined: "19 Jun 2026",
      lastAccess: "Hoje, 09:15"
    },
    {
      id: "u105",
      name: "Lucas Alvarenga",
      email: "lucas.alv@invest.com",
      plan: "Pro",
      role: "user",
      status: "Suspenso",
      joined: "22 Fev 2026",
      lastAccess: "14 Jul 2026"
    }
  ]);

  // System IP Access logs
  const accessLogs = [
    { id: "log_1", ip: "189.120.45.12", user: "admin@cademinhagrana.com", location: "São Paulo, BR", status: "200 OK", time: "Hoje, 15:20" },
    { id: "log_2", ip: "177.33.102.88", user: "mariana.souza@corp.com", location: "Rio de Janeiro, BR", status: "200 OK", time: "Hoje, 14:05" },
    { id: "log_3", ip: "201.88.14.200", user: "carlos@cademinhagrana.com", location: "Curitiba, BR", status: "200 OK", time: "Hoje, 12:44" },
    { id: "log_4", ip: "191.252.10.05", user: "joao@exemplo.com.br", location: "Belo Horizonte, BR", status: "200 OK", time: "Ontem, 22:11" },
  ];

  const handleUpdatePlan = (userId: string, newPlan: "Gratuito" | "Pro" | "Premium") => {
    setUsers(users.map(u => u.id === userId ? { ...u, plan: newPlan } : u));
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === "Ativo" ? "Suspenso" : "Ativo";
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Deseja realmente excluir esta conta de usuário permanentemente?")) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleSaveGa = (e: React.FormEvent) => {
    e.preventDefault();
    setGaSaved(true);
    setTimeout(() => setGaSaved(false), 3000);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = planFilter === "all" || u.plan.toLowerCase() === planFilter.toLowerCase();
    return matchesSearch && matchesPlan;
  });

  return (
    <div className="space-y-8 animate-fade-in text-[#E0D8D0]">
      
      {/* Header Banner for Isolated Admin Route */}
      <div className="bg-[#0e0909] border border-red-500/20 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex items-center gap-4 z-10">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white font-sans uppercase tracking-tight">Portal Administrativo Restrito</h1>
              <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                Acesso Seguro
              </span>
            </div>
            <p className="text-xs text-white/50 mt-1">
              Painel isolado de gerenciamento de contas de usuários, Google Analytics e infraestrutura de servidores. Sem acesso a dados financeiros dos clientes.
            </p>
          </div>
        </div>

        {onExitAdmin && (
          <button
            onClick={onExitAdmin}
            className="z-10 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            Sair do Modo Admin
          </button>
        )}
      </div>

      {/* Admin KPI Summary Cards (Users & Google Analytics Stats) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Users */}
        <div className="glass-card rounded-2xl p-5 border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
          <div className="flex justify-between items-center mb-3">
            <span className="font-mono text-xs uppercase tracking-wider text-white/40">Usuários Registrados</span>
            <Users className="w-4 h-4 text-white/40" />
          </div>
          <div className="text-3xl font-black font-mono text-white mb-1">{users.length}</div>
          <p className="text-[11px] text-white/40">
            <strong className="text-success-emerald">{users.filter(u => u.status === "Ativo").length} ativos</strong> • {users.filter(u => u.status === "Suspenso").length} suspensos
          </p>
        </div>

        {/* Real-time Google Analytics Visitors */}
        <div className="glass-card rounded-2xl p-5 border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
          <div className="flex justify-between items-center mb-3">
            <span className="font-mono text-xs uppercase tracking-wider text-white/40">Google Analytics (Agora)</span>
            <Globe className="w-4 h-4 text-ai-cyan animate-spin" style={{ animationDuration: "10s" }} />
          </div>
          <div className="text-3xl font-black font-mono text-ai-cyan mb-1">42</div>
          <p className="text-[11px] text-white/40">
            Visitantes simultâneos online
          </p>
        </div>

        {/* Monthly Pageviews */}
        <div className="glass-card rounded-2xl p-5 border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
          <div className="flex justify-between items-center mb-3">
            <span className="font-mono text-xs uppercase tracking-wider text-white/40">Sessões / Mês</span>
            <BarChart2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black font-mono text-amber-500 mb-1">18.420</div>
          <p className="text-[11px] text-white/40">
            Tempo médio de sessão: 4m 12s
          </p>
        </div>

        {/* Server Status */}
        <div className="glass-card rounded-2xl p-5 border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
          <div className="flex justify-between items-center mb-3">
            <span className="font-mono text-xs uppercase tracking-wider text-white/40">Servidor Cloud Run</span>
            <Activity className="w-4 h-4 text-success-emerald" />
          </div>
          <div className="text-3xl font-bold font-mono text-success-emerald mb-1">99.98%</div>
          <p className="text-[11px] text-white/40">
            Sem falhas detectadas
          </p>
        </div>

      </div>

      {/* Tabs Menu */}
      <div className="border-b border-white/5 flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "users" 
              ? "bg-red-500/10 border border-red-500/30 text-red-400" 
              : "text-white/40 hover:text-white bg-white/5 border border-white/5"
          }`}
        >
          <Users className="w-4 h-4" />
          Gerenciamento de Usuários ({users.length})
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "analytics" 
              ? "bg-red-500/10 border border-red-500/30 text-red-400" 
              : "text-white/40 hover:text-white bg-white/5 border border-white/5"
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          Google Analytics & Tráfego
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "security" 
              ? "bg-red-500/10 border border-red-500/30 text-red-400" 
              : "text-white/40 hover:text-white bg-white/5 border border-white/5"
          }`}
        >
          <Server className="w-4 h-4" />
          Segurança e Logs de Acesso
        </button>
      </div>

      {/* TAB 1: USER MANAGEMENT */}
      {activeTab === "users" && (
        <div className="glass-card rounded-2xl p-6 space-y-6 border border-white/5">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/5">
            <div>
              <h2 className="text-lg font-bold text-white font-sans">Cadastro de Usuários e Contas</h2>
              <p className="text-xs text-white/40 mt-0.5">Gerencie permissões, ativações e planos de cada cliente cadastrado no SaaS.</p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-grow md:w-64">
                <Search className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou e-mail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#131315] border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-red-500/40"
                />
              </div>

              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="bg-[#131315] border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-red-500/40"
              >
                <option value="all">Todos os Planos</option>
                <option value="gratuito">Plano Gratuito</option>
                <option value="pro">Plano Pro</option>
                <option value="premium">Plano Premium</option>
              </select>
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-white/40 font-mono uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Usuário / Nome</th>
                  <th className="pb-3 font-semibold">E-mail Cadastrado</th>
                  <th className="pb-3 font-semibold">Plano Contratado</th>
                  <th className="pb-3 font-semibold">Acesso</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Último Acesso</th>
                  <th className="pb-3 font-semibold text-right">Ações da Conta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-white/40 font-mono">
                      Nenhum usuário encontrado com os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-4 font-semibold text-white">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white text-xs">
                            {u.name.slice(0, 1)}
                          </div>
                          <span>{u.name}</span>
                        </div>
                      </td>
                      <td className="py-4 font-mono text-white/60">{u.email}</td>
                      <td className="py-4">
                        <select
                          value={u.plan}
                          onChange={(e) => handleUpdatePlan(u.id, e.target.value as any)}
                          className="bg-[#131315] border border-white/10 rounded px-2.5 py-1 text-white font-semibold text-[11px] focus:outline-none focus:border-red-500/40"
                        >
                          <option value="Gratuito">Gratuito</option>
                          <option value="Pro">Pro</option>
                          <option value="Premium">Premium</option>
                        </select>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono font-bold ${u.role === "admin" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-white/5 text-white/60"}`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-semibold font-mono text-[10px] ${u.status === "Ativo" ? "bg-success-emerald/10 text-success-emerald border border-success-emerald/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-4 font-mono text-white/40 text-[11px]">{u.lastAccess}</td>
                      <td className="py-4 text-right space-x-2">
                        <button
                          onClick={() => handleToggleStatus(u.id)}
                          title={u.status === "Ativo" ? "Suspender Conta" : "Reativar Conta"}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1 text-[11px]"
                        >
                          <Ban className="w-3.5 h-3.5 text-amber-500" />
                          <span>{u.status === "Ativo" ? "Suspender" : "Ativar"}</span>
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          title="Excluir Usuário"
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer inline-flex"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: GOOGLE ANALYTICS & TRAFFIC */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          
          {/* Google Analytics GA4 Configuration card */}
          <div className="glass-card rounded-2xl p-6 border border-white/5">
            <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white font-sans flex items-center gap-2">
                  <Globe className="w-5 h-5 text-ai-cyan" />
                  Integração Google Analytics (GA4)
                </h2>
                <p className="text-xs text-white/40 mt-1">
                  Configure a ID de Métrica do Google Analytics para rastrear eventos de tráfego, cadastros e acessos ao SaaS.
                </p>
              </div>
              <a 
                href="https://analytics.google.com" 
                target="_blank" 
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                Painel Google <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <form onSubmit={handleSaveGa} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-white/50 block">
                  ID de Medição do Google Analytics (GA4 Tag)
                </label>
                <input
                  type="text"
                  value={gaMeasurementId}
                  onChange={(e) => setGaMeasurementId(e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full bg-[#131315] border border-white/10 rounded-xl py-3 px-4 text-sm font-mono text-ai-cyan focus:outline-none focus:border-ai-cyan"
                  required
                />
              </div>

              <button
                type="submit"
                className="py-3 px-6 rounded-xl bg-ai-cyan hover:bg-white text-[#010814] font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {gaSaved ? <Check className="w-4 h-4 text-success-emerald" /> : null}
                {gaSaved ? "Tag GA4 Salva!" : "Salvar Configuração GA4"}
              </button>
            </form>
          </div>

          {/* Traffic Breakdown Visualizers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Traffic Sources */}
            <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-white/40">
                Origem do Tráfego (Últimos 30 dias)
              </h3>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white font-semibold">Busca Orgânica (Google)</span>
                    <span className="font-mono text-ai-cyan font-bold">48%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-ai-cyan rounded-full" style={{ width: "48%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white font-semibold">Acesso Direto (URL)</span>
                    <span className="font-mono text-champagne-gold font-bold">32%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-champagne-gold rounded-full" style={{ width: "32%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white font-semibold">Redes Sociais & Links</span>
                    <span className="font-mono text-success-emerald font-bold">20%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-success-emerald rounded-full" style={{ width: "20%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Device Category */}
            <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-white/40">
                Dispositivos de Acesso
              </h3>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white font-semibold">Smartphones Mobile</span>
                    <span className="font-mono text-white font-bold">65%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "65%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white font-semibold">Desktop / Laptops</span>
                    <span className="font-mono text-white font-bold">30%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "30%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white font-semibold">Tablets</span>
                    <span className="font-mono text-white font-bold">5%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: "5%" }}></div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 3: SECURITY AND IP LOGS */}
      {activeTab === "security" && (
        <div className="glass-card rounded-2xl p-6 space-y-6 border border-white/5">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white font-sans">Auditoria de Segurança e Conexões</h2>
              <p className="text-xs text-white/40 mt-0.5">Logs de IP de acesso e autenticação para prevenção contra acessos não autorizados.</p>
            </div>
            <span className="bg-success-emerald/10 text-success-emerald text-[10px] font-mono px-3 py-1 rounded-full border border-success-emerald/20 font-bold">
              SSL / TLS 1.3 ATIVO
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-white/40 font-mono uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Endereço IP</th>
                  <th className="pb-3 font-semibold">Conta de E-mail</th>
                  <th className="pb-3 font-semibold">Localização Estimada</th>
                  <th className="pb-3 font-semibold">Horário</th>
                  <th className="pb-3 font-semibold text-right">Resposta HTTP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {accessLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.01]">
                    <td className="py-3.5 font-bold text-ai-cyan">{log.ip}</td>
                    <td className="py-3.5 text-white/80">{log.user}</td>
                    <td className="py-3.5 text-white/50">{log.location}</td>
                    <td className="py-3.5 text-white/40">{log.time}</td>
                    <td className="py-3.5 text-right">
                      <span className="bg-success-emerald/10 text-success-emerald px-2 py-0.5 rounded text-[10px]">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
