import React, { useState } from "react";
import { LifeBuoy, ShieldCheck, FileText } from "lucide-react";
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
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-5 text-center">
          
          {/* Terms / Privacy Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium">
            <button
              onClick={() => setActiveLegalModal("terms")}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-white/70"
            >
              <FileText className="w-3.5 h-3.5 text-white/40" />
              <span>Termos de Uso</span>
            </button>
            <span className="text-white/20 hidden sm:inline">•</span>
            <button
              onClick={() => setActiveLegalModal("privacy")}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-white/70"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-white/40" />
              <span>Política de Privacidade</span>
            </button>
          </div>

          {/* Connected Copyright & Developer Statement in White */}
          <div className="text-xs font-mono text-white/80 tracking-wide">
            Desenvolvido por <strong className="text-white font-bold">Nanda Marinho</strong>. Todos os direitos reservados.
          </div>

          {/* Support Button Positioned Below All Rights Reserved with White Text */}
          <div className="pt-1">
            <button
              onClick={() => setActiveLegalModal("support")}
              className="hover:bg-white/15 transition-all cursor-pointer text-white font-medium text-xs flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/15 shadow-sm"
            >
              <LifeBuoy className="w-4 h-4 text-white" />
              <span className="text-white">Suporte & Relato de Erro</span>
            </button>
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
