import React, { useState } from "react";
import { X, ShieldCheck, FileText, Send, CheckCircle, LifeBuoy } from "lucide-react";

interface LegalModalsProps {
  activeModal: "privacy" | "terms" | "support" | null;
  onClose: () => void;
  onTriggerToast?: (msg: string, type?: "success" | "info") => void;
}

export default function LegalModals({ activeModal, onClose, onTriggerToast }: LegalModalsProps) {
  const [supportName, setSupportName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportSubject, setSupportSubject] = useState("Bug ou Problema Técnico");
  const [supportMessage, setSupportMessage] = useState("");
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!activeModal) return null;

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportEmail || !supportMessage) return;

    setSentSuccess(true);
    if (onTriggerToast) {
      onTriggerToast("Sua mensagem foi enviada à nossa equipe de suporte. Responderemos em até 2 horas!", "success");
    }

    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 backdrop-blur-md animate-fade-in">
      <div className="bg-[#121214] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col">
        
        {/* Header Modal */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#18181c]">
          <div className="flex items-center gap-3">
            {activeModal === "privacy" && <ShieldCheck className="w-6 h-6 text-amber-500" />}
            {activeModal === "terms" && <FileText className="w-6 h-6 text-amber-500" />}
            {activeModal === "support" && <LifeBuoy className="w-6 h-6 text-amber-500" />}
            <div>
              <h3 className="text-lg font-bold text-white font-sans">
                {activeModal === "privacy" && "Políticas de Privacidade & Segurança LGPD"}
                {activeModal === "terms" && "Termos de Uso e Licenciamento SaaS"}
                {activeModal === "support" && "Central de Suporte & Relato de Problemas"}
              </h3>
              <p className="text-[10px] text-amber-500/80 font-mono uppercase tracking-widest">
                Cadê Minha Grana • Documentação Oficial
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-white/80 scrollbar-thin scrollbar-thumb-amber-500/30">
          
          {/* POLÍTICAS DE PRIVACIDADE */}
          {activeModal === "privacy" && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-xs font-mono">
                🔒 Seus dados financeiros são encriptados com algoritmo bancário AES-256 e protegidos conforme a LGPD (Lei Nº 13.709/2018).
              </div>

              <h4 className="font-bold text-white text-sm">1. Coleta e Uso de Informações</h4>
              <p>
                O aplicativo <strong>Cadê Minha Grana</strong> coleta exclusivamente as informações fornecidas voluntariamente pelo usuário (como lançamentos via voz, upload de comprovantes em OCR e cadastros de e-mail) para alimentar os modelos analíticos de Inteligência Artificial e gerar seus relatórios patrimoniais.
              </p>

              <h4 className="font-bold text-white text-sm">2. Leitura por Voz e OCR de Imagens</h4>
              <p>
                Áudios capturados pelo microfone do dispositivo e fotos/prints de comprovantes são processados de forma efémera por instâncias seguras do Google Gemini AI. Nenhum arquivo de mídia bruta é vendido ou compartilhado com terceiros comercialmente.
              </p>

              <h4 className="font-bold text-white text-sm">3. Não Compartilhamento Bancário Involuntário</h4>
              <p>
                A plataforma opera em regime de isolamento e sigilo estrito. Dados de transações e patrimônios não são visíveis para outros usuários ou indexadores de busca.
              </p>

              <h4 className="font-bold text-white text-sm">4. Direitos do Titular dos Dados</h4>
              <p>
                Em conformidade com a LGPD, o usuário pode a qualquer momento solicitar a exportação completa de seu banco de dados em formato JSON ou a exclusão permanente de sua conta.
              </p>
            </div>
          )}

          {/* TERMOS DE USO */}
          {activeModal === "terms" && (
            <div className="space-y-4">
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/70 text-xs font-mono">
                ⚖️ Ao utilizar a plataforma Cadê Minha Grana, você concorda com as diretrizes de serviço abaixo.
              </div>

              <h4 className="font-bold text-white text-sm">1. Licença de Uso do Software (SaaS)</h4>
              <p>
                A plataforma concede ao usuário uma licença pessoal, intransferível e não exclusiva para uso dos recursos de gestão financeira e inteligência artificial de acordo com o plano contratado (Gratuito, Pro ou Premium).
              </p>

              <h4 className="font-bold text-white text-sm">2. Limitações de Responsabilidade Financeira</h4>
              <p>
                O Cadê Minha Grana é uma ferramenta analítica e informativa. Os conselhos gerados pelo assistente de IA não constituem recomendações formais de investimentos do mercado de capitais regulado pela CVM. O usuário é o único responsável por suas decisões de alocação de ativos.
              </p>

              <h4 className="font-bold text-white text-sm">3. Automações e Roadmap de Open Finance</h4>
              <p>
                A funcionalidade de Sincronização Bancária Automática (Open Finance) está catalogada como um recurso previsto para a segunda fase de automações, destinado exclusivamente aos assinantes do plano Premium. A versão atual garante automação por leitura inteligente de Voz e OCR.
              </p>
            </div>
          )}

          {/* CENTRAL DE SUPORTE E CONTATO */}
          {activeModal === "support" && (
            <div>
              {sentSuccess ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                  <CheckCircle className="w-12 h-12 text-success-emerald animate-bounce" />
                  <h4 className="text-base font-bold text-white">Mensagem Enviada com Sucesso!</h4>
                  <p className="text-xs text-white/60">Nossa equipe técnica avaliará seu relato imediatamente.</p>
                </div>
              ) : (
                <form onSubmit={handleSupportSubmit} className="space-y-4">
                  <p className="text-xs text-white/60">
                    Encontrou algum erro, dúvida sobre sua assinatura ou precisa de ajuda técnica? Preencha os dados abaixo para falar diretamente com os desenvolvedores.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-white/40 uppercase">Seu Nome</label>
                      <input 
                        type="text"
                        value={supportName}
                        onChange={(e) => setSupportName(e.target.value)}
                        placeholder="Nome completo"
                        className="w-full bg-[#131315] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/40"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-white/40 uppercase">Seu E-mail para Resposta</label>
                      <input 
                        type="email"
                        value={supportEmail}
                        onChange={(e) => setSupportEmail(e.target.value)}
                        placeholder="seuemail@exemplo.com"
                        className="w-full bg-[#131315] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/40"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-white/40 uppercase">Assunto do Contato</label>
                    <select
                      value={supportSubject}
                      onChange={(e) => setSupportSubject(e.target.value)}
                      className="w-full bg-[#131315] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/40"
                    >
                      <option value="Bug ou Problema Técnico">Relatar Bug ou Erro na Tela</option>
                      <option value="Dúvida sobre Planos e Cobrança">Dúvidas sobre Assinatura / Planos</option>
                      <option value="Sugestão de Funcionalidade">Sugestão de Melhoria de Funcionalidade</option>
                      <option value="Outros Assuntos">Outros Assuntos</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-white/40 uppercase">Detalhes da Mensagem ou Problema</label>
                    <textarea 
                      rows={4}
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      placeholder="Descreva o que aconteceu ou qual sua dúvida com o máximo de detalhes..."
                      className="w-full bg-[#131315] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500/40"
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-xs rounded-xl hover:from-amber-400 hover:to-orange-500 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                    Enviar Relato de Problema
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
