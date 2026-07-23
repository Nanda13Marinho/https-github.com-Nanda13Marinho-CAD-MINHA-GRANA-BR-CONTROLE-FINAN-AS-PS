import React, { useState, useRef, useEffect } from "react";
import { AppData, ChatMessage } from "../types";
import { Send, Mic, Square, Sparkles, User, RefreshCw, Volume2, Shield } from "lucide-react";

interface AIChatViewProps {
  data: AppData;
  onSendMessage: (text: string) => Promise<void>;
  loading: boolean;
}

export default function AIChatView({ data, onSendMessage, loading }: AIChatViewProps) {
  const [inputText, setInputText] = useState("");
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingTimer = useRef<NodeJS.Timeout | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data.chatMessages, loading]);

  const handleSend = () => {
    if (!inputText.trim() || loading) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // Simulated premium voice recognition
  const handleStartRecording = () => {
    setRecording(true);
    setRecordingTime(0);
    recordingTimer.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);

    // After 4.5 seconds, automatically simulate transcription
    setTimeout(() => {
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
        setRecording(false);
        // Realistic preset commands
        const voiceCommands = [
          "Como posso economizar R$ 500 adicionais este mês?",
          "Quais vazamentos de caixa ativos o Radar detectou?",
          "Gere uma meta de poupança inteligente baseada no meu saldo",
          "Adicionar despesa de Uber de 24 dólares de ontem"
        ];
        const randomCommand = voiceCommands[Math.floor(Math.random() * voiceCommands.length)];
        onSendMessage(randomCommand);
      }
    }, 4500);
  };

  const handleStopRecording = () => {
    if (recordingTimer.current) {
      clearInterval(recordingTimer.current);
    }
    setRecording(false);
    // Transcribe first available
    onSendMessage("Como posso economizar R$ 500 adicionais este mês?");
  };

  const quickPrompts = [
    { label: "Analisar Vazamentos", text: "Quais são meus vazamentos ativos de caixa e assinaturas do Radar?" },
    { label: "Otimizar Despesas", text: "Como posso cortar custos desnecessários sem alterar meu estilo de vida?" },
    { label: "Meta de Poupança", text: "Me ajude a planejar uma meta para comprar um imóvel ou carro de luxo" },
    { label: "Evolução Net Worth", text: "Qual a melhor estratégia para acelerar o crescimento do meu patrimônio em Q3?" }
  ];

  return (
    <div className="glass-card rounded-2xl h-[calc(100vh-12rem)] flex flex-col overflow-hidden border border-white/5 shadow-2xl relative">
      
      {/* Chat Header */}
      <div className="p-5 border-b border-white/5 bg-[#1f1f21]/80 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-ai-cyan/15 flex items-center justify-center border border-ai-cyan/20 animate-pulse">
            <Sparkles className="w-5 h-5 text-ai-cyan" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-sans">Cadê Minha Grana AI</h2>
            <p className="text-[10px] text-success-emerald font-mono flex items-center gap-1 mt-0.5 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-success-emerald"></span>
              Gemini 3.5 Flash Active
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-white/40 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
            Real-Time Analysis
          </span>
        </div>
      </div>

      {/* Messages Sandbox */}
      <div className="flex-grow overflow-y-auto p-5 space-y-6 hide-scrollbar relative bg-[#131315]/45">
        
        {data.chatMessages.map((msg) => {
          const isAI = msg.sender === "ai";
          return (
            <div 
              key={msg.id} 
              className={`flex items-start gap-3.5 ${isAI ? "" : "flex-row-reverse"}`}
            >
              {/* Avatar */}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                isAI 
                  ? "bg-ai-cyan/10 border-ai-cyan/20 text-ai-cyan" 
                  : "bg-champagne-gold/10 border-champagne-gold/20 text-champagne-gold"
              }`}>
                {isAI ? <Sparkles className="w-4.5 h-4.5" /> : <User className="w-4.5 h-4.5" />}
              </div>

              {/* Message Body */}
              <div className={`max-w-[80%] rounded-2xl p-4 leading-relaxed text-sm ${
                isAI 
                  ? "bg-[#1f1f21] border border-white/5 text-white" 
                  : "bg-champagne-gold/10 border border-champagne-gold/25 text-white"
              }`}>
                <div className="prose prose-invert prose-sm">
                  {msg.text.split("\n").map((para, i) => (
                    <p key={i} className="mb-2 last:mb-0">
                      {/* Robust support for bolding and italics formatting in simple markdown */}
                      {para.split("**").map((chunk, j) => {
                        if (j % 2 === 1) return <strong key={j} className="text-champagne-gold font-bold">{chunk}</strong>;
                        return chunk;
                      })}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-ai-cyan/10 border border-ai-cyan/20 flex items-center justify-center text-ai-cyan animate-pulse">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div className="bg-[#1f1f21] border border-white/5 rounded-2xl p-4 flex items-center gap-2 text-sm text-white/40 font-mono">
              <RefreshCw className="w-4 h-4 animate-spin text-ai-cyan" />
              IA está computando uma estratégia...
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggestion Quick Prompts Row */}
      {data.chatMessages.length <= 1 && !loading && (
        <div className="px-5 py-3 border-t border-white/5 bg-[#1f1f21]/20 flex gap-2 overflow-x-auto hide-scrollbar shrink-0">
          {quickPrompts.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(chip.text)}
              className="px-3 py-1.5 bg-[#1f1f21] border border-white/5 text-xs text-white hover:border-ai-cyan/40 hover:bg-ai-cyan/5 rounded-full transition-all cursor-pointer whitespace-nowrap font-medium"
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}

      {/* Active Soundwave Recording Visual Overlay */}
      {recording && (
        <div className="absolute inset-x-0 bottom-18 bg-deep-navy/95 border-t border-ai-cyan/30 p-4 flex flex-col items-center justify-center z-20 animate-slide-up">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-danger-crimson animate-ping"></span>
            <span className="font-mono text-xs text-danger-crimson font-bold">
              GRAVANDO ÁUDIO COMANDO... {recordingTime}s
            </span>
          </div>
          
          {/* Animated SVG Soundwave lines */}
          <div className="flex items-center gap-1.5 h-10 mb-2">
            <div className="w-1 bg-ai-cyan h-4 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
            <div className="w-1 bg-ai-cyan h-8 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></div>
            <div className="w-1 bg-ai-cyan h-10 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></div>
            <div className="w-1 bg-ai-cyan h-6 rounded-full animate-bounce" style={{ animationDelay: "0.45s" }}></div>
            <div className="w-1 bg-ai-cyan h-9 rounded-full animate-bounce" style={{ animationDelay: "0.6s" }}></div>
            <div className="w-1 bg-ai-cyan h-4 rounded-full animate-bounce" style={{ animationDelay: "0.75s" }}></div>
          </div>
          
          <button 
            onClick={handleStopRecording}
            className="px-4 py-1.5 bg-danger-crimson text-white text-[10px] font-mono rounded-full border border-danger-crimson/30"
          >
            PARAR & ENVIAR
          </button>
        </div>
      )}

      {/* Input Tray */}
      <div className="p-4 border-t border-white/5 bg-[#1f1f21]/80 flex gap-3 items-center z-10 shrink-0">
        
        {/* Voice recording button */}
        <button 
          onClick={recording ? handleStopRecording : handleStartRecording}
          title={recording ? "Stop recording" : "Record voice instruction"}
          className={`p-3 rounded-xl border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
            recording 
              ? "bg-danger-crimson/20 border-danger-crimson text-danger-crimson animate-pulse" 
              : "bg-white/5 border-white/5 text-white/40 hover:text-white hover:border-white/10"
          }`}
        >
          {recording ? <Square className="w-5 h-5 fill-danger-crimson" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Text Input */}
        <input 
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Pergunte ao consultor de IA..."
          className="flex-grow bg-[#131315] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-ai-cyan/40 placeholder:text-white/40"
        />

        {/* Send Action */}
        <button 
          onClick={handleSend}
          disabled={!inputText.trim() || loading}
          className="p-3 rounded-xl bg-ai-cyan text-[#010814] hover:bg-white hover:text-deep-navy transition-colors shrink-0 flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        >
          <Send className="w-5 h-5" />
        </button>

      </div>

    </div>
  );
}
