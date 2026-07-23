import React, { useEffect, useState } from "react";

interface SplashViewProps {
  onComplete: () => void;
}

export default function SplashView({ onComplete }: SplashViewProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 400);
          return 100;
        }
        return prev + 4;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,163,89,0.08)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="flex flex-col items-center max-w-sm w-full text-center z-10 space-y-8 animate-fade-in">
        {/* Pulsing Luxury SVG Logo Emblem */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          <div className="relative w-20 h-20 bg-gradient-to-br from-[#121214] to-[#0a0a0b] border-2 border-amber-500/40 rounded-2xl flex items-center justify-center shadow-2xl">
            <svg
              className="w-12 h-12 text-amber-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
        </div>

        {/* Brand Names */}
        <div className="space-y-2">
          <h1 className="text-2xl font-black tracking-widest text-white uppercase font-sans">
            CADÊ MINHA GRANA
          </h1>
          <p className="text-xs text-amber-500/80 font-mono uppercase tracking-widest">
            Gestão Patrimonial por Inteligência Artificial
          </p>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-48 space-y-2">
          <div className="h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-75"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-white/30 font-mono tracking-widest">
            {progress < 40
              ? "INICIALIZANDO PORTFÓLIO..."
              : progress < 80
              ? "CONECTANDO BANCO DE DADOS..."
              : "CONEXÃO SEGURA PRONTA"}
          </p>
        </div>
      </div>

      {/* Decorative corners */}
      <div className="absolute bottom-6 text-[9px] font-mono text-white/20">
        SISTEMA DE SEGURANÇA BANCÁRIA • V1.0 • TLS 1.3
      </div>
    </div>
  );
}
