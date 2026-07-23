import React, { useState } from "react";
import { LifeBuoy, ShieldCheck, FileText, Heart } from "lucide-react";
import LegalModals from "./LegalModals";

interface FooterProps {
  onTriggerToast?: (msg: string, type?: "success" | "info") => void;
  className?: string;
}

export default function Footer({ onTriggerToast, className = "" }: FooterProps) {
  const [activeLegalModal, setActiveLegalModal] = useState<"privacy" | "terms" | "support" | null>(null);

  return (
    <>
      <footer className={`border-t border-white/10 bg-[#030305] py-8 px-6 text-xs text-white/60 font-sans ${className}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand & Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center font-bold text-black text-xs shadow-md shadow-amber-500/20 shrink-0">
              CMG
            </div>
            <div>
              <span className="font-bold text-white block text-sm tracking-wide">
                Cadê Minha Grana
              </span>
              <span className="text-[10px] text-white/40 font-mono">
                Gestão Financeira Pessoal com Inteligência Artificial
              </span>
            </div>
          </div>

          {/* Links for Terms, Privacy, Support */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium">
            <button
              onClick={() => setActiveLegalModal("terms")}
              className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-white/40" />
              <span>Termos de Uso</span>
            </button>

            <button
              onClick={() => setActiveLegalModal("privacy")}
              className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-white/40" />
              <span>Política de Privacidade</span>
            </button>

            <a
              href="/presentation"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-300 transition-colors cursor-pointer text-amber-400 font-bold flex items-center gap-1.5 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 shadow-sm"
              title="Abrir Apresentação do Modelo de Negócio em formato executivo para salvar em PDF"
            >
              <span>📄 Apresentação do Negócio (PDF)</span>
            </a>

            <button
              onClick={() => setActiveLegalModal("support")}
              className="hover:text-amber-400 transition-colors cursor-pointer text-amber-400 font-semibold flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/10"
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>Suporte & Relato de Erro</span>
            </button>
          </div>

          {/* Copyright Notice */}
          <div className="text-[11px] font-mono text-white/40 text-center md:text-right flex flex-col items-center md:items-end gap-1">
            <div>
              © {new Date().getFullYear()} <strong className="text-white/70">Cadê Minha Grana</strong>. Todos os direitos reservados.
            </div>
            <div className="text-[10px] text-white/30 flex items-center gap-1">
              Desenvolvido com <Heart className="w-3 h-3 text-red-500 inline fill-red-500" /> para alta performance financeira
            </div>
          </div>

        </div>
      </footer>

      {/* Interactive Legal & Support Modals */}
      <LegalModals
        activeModal={activeLegalModal}
        onClose={() => setActiveLegalModal(null)}
        onTriggerToast={onTriggerToast}
      />
    </>
  );
}
