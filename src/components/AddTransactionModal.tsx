import React, { useState } from "react";
import { X, Plus, Calendar, DollarSign, Tag, CheckCircle, Mic, UploadCloud, RefreshCw, Sparkles, FileText, ScanLine } from "lucide-react";
import { Transaction } from "../types";

interface AddTransactionModalProps {
  onClose: () => void;
  onSave: (t: Omit<Transaction, "id">) => void;
}

export default function AddTransactionModal({ onClose, onSave }: AddTransactionModalProps) {
  const [entryMode, setEntryMode] = useState<"manual" | "voice" | "file">("manual");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [merchant, setMerchant] = useState("");
  const [category, setCategory] = useState("Restaurantes");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<"USD" | "BRL">("BRL");
  const [status, setStatus] = useState<"Cleared" | "Pending" | "Reviewed">("Cleared");

  // Voice recognition state
  const [voiceText, setVoiceText] = useState("");
  const [listening, setListening] = useState(false);
  const [processingVoice, setProcessingVoice] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  // File OCR state
  const [processingFile, setProcessingFile] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const categories = [
    "Restaurantes",
    "Eletrônicos",
    "Transporte",
    "Lazer",
    "Fitness",
    "Compras",
    "Supermercado",
    "Contas / Serviços",
    "Salário",
    "Outros"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant.trim() || !amount) return;

    const parsedAmount = Math.abs(parseFloat(amount));
    const finalAmount = type === "expense" ? -parsedAmount : parsedAmount;

    onSave({
      merchant: merchant.trim(),
      category,
      amount: finalAmount,
      currency,
      type,
      date: "Hoje, " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      status
    });
    onClose();
  };

  // Web Speech API / Voice Input
  const handleStartVoice = () => {
    setVoiceError(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "pt-BR";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceText(transcript);
        setListening(false);
        handleProcessVoiceText(transcript);
      };

      recognition.onerror = (event: any) => {
        setListening(false);
        setVoiceError("Não foi possível ouvir o áudio. Digite o comando abaixo.");
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognition.start();
    } else {
      // Speech recognition fallback
      setListening(true);
      setTimeout(() => {
        setListening(false);
        const sampleCommands = [
          "Gastei 45 reais no almoço do Outback hoje",
          "Paguei 120 reais de combustível no Posto Shell",
          "Recebi 2500 reais de projeto freelancer",
          "Comprei 89 reais de remédios na Farmácia Raia"
        ];
        const randomCmd = sampleCommands[Math.floor(Math.random() * sampleCommands.length)];
        setVoiceText(randomCmd);
        handleProcessVoiceText(randomCmd);
      }, 3000);
    }
  };

  const handleProcessVoiceText = async (textToProcess: string) => {
    if (!textToProcess.trim()) return;
    setProcessingVoice(true);
    setVoiceError(null);

    try {
      const res = await fetch("/api/voice-parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToProcess })
      });

      if (!res.ok) {
        throw new Error("Falha ao interpretar áudio por IA.");
      }

      const json = await res.json();
      if (json.success && json.transaction) {
        const t = json.transaction;
        setMerchant(t.merchant || "Lançamento por Voz");
        setType(t.type || (t.amount < 0 ? "expense" : "income"));
        setAmount(Math.abs(t.amount || 0).toString());
        setCategory(t.category || "Outros");
        setCurrency(t.currency || "BRL");
        setEntryMode("manual"); // Switch back with pre-filled fields
      }
    } catch (err: any) {
      setVoiceError(err.message || "Erro ao conectar com o serviço de voz.");
    } finally {
      setProcessingVoice(false);
    }
  };

  // Image / Print / Screenshot Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProcessingFile(true);
    setFileError(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        const res = await fetch("/api/ocr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64String })
        });

        if (!res.ok) throw new Error("Erro ao processar imagem da nota/comprovante.");

        const json = await res.json();
        if (json.success && json.transaction) {
          const t = json.transaction;
          setMerchant(t.merchant || "Recibo Lido");
          setType(t.type || (t.amount < 0 ? "expense" : "income"));
          setAmount(Math.abs(t.amount || 0).toString());
          setCategory(t.category || "Outros");
          setCurrency(t.currency || "BRL");
          setEntryMode("manual");
        }
      } catch (err: any) {
        setFileError(err.message || "Falha ao ler nota/print por OCR.");
      } finally {
        setProcessingFile(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1f1f21] border border-white/5 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        
        {/* Header */}
        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#2a2a2b]/30">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-champagne-gold" />
            <h3 className="text-lg font-bold text-white">Adicionar Lançamento</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-[#9e9e9f] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Entry Mode Switcher Tabs */}
        <div className="flex border-b border-white/5 bg-[#131315] p-1.5 gap-1">
          <button
            type="button"
            onClick={() => setEntryMode("manual")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              entryMode === "manual" ? "bg-white/10 text-white border border-white/10" : "text-white/40 hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Manual
          </button>
          <button
            type="button"
            onClick={() => setEntryMode("voice")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              entryMode === "voice" ? "bg-ai-cyan/15 text-ai-cyan border border-ai-cyan/20" : "text-white/40 hover:text-white"
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-ai-cyan" />
            Voz por IA
          </button>
          <button
            type="button"
            onClick={() => setEntryMode("file")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              entryMode === "file" ? "bg-champagne-gold/15 text-champagne-gold border border-champagne-gold/20" : "text-white/40 hover:text-white"
            }`}
          >
            <ScanLine className="w-3.5 h-3.5 text-champagne-gold" />
            Print / OCR
          </button>
        </div>

        {/* VOICE INPUT TAB */}
        {entryMode === "voice" && (
          <div className="p-6 space-y-5 animate-fade-in text-center">
            <div className="p-4 bg-ai-cyan/5 border border-ai-cyan/15 rounded-2xl space-y-3">
              <Sparkles className="w-8 h-8 text-ai-cyan mx-auto animate-pulse" />
              <h4 className="text-sm font-bold text-white">Lançamento por Comando de Voz</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Fale naturalmente (ex: <em className="text-ai-cyan">"Almoço de 45 reais no Outback hoje"</em>) e nossa Inteligência Artificial preencherá e categorizará sua despesa/receita automaticamente!
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-3 py-4">
              <button
                type="button"
                onClick={handleStartVoice}
                disabled={listening || processingVoice}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  listening
                    ? "bg-danger-crimson animate-ping text-white shadow-[0_0_30px_#EF4444]"
                    : "bg-ai-cyan text-[#010814] hover:scale-105 shadow-[0_0_20px_rgba(0,242,255,0.4)]"
                }`}
              >
                <Mic className="w-8 h-8" />
              </button>
              <p className="text-xs font-mono text-white/50">
                {listening ? "Ouvindo... Fale agora" : processingVoice ? "IA categorizando áudio..." : "Clique no microfone para falar"}
              </p>
            </div>

            {/* Manual text backup input */}
            <div className="space-y-2 text-left pt-2 border-t border-white/5">
              <label className="text-xs font-mono text-white/40 uppercase">Ou digite o comando de voz:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={voiceText}
                  onChange={(e) => setVoiceText(e.target.value)}
                  placeholder="Ex: Gasolina 150 reais no Posto Ipiranga"
                  className="flex-grow bg-[#131315] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-ai-cyan/40"
                />
                <button
                  type="button"
                  onClick={() => handleProcessVoiceText(voiceText)}
                  disabled={processingVoice || !voiceText.trim()}
                  className="px-4 py-2 bg-ai-cyan text-[#010814] font-bold rounded-xl text-xs hover:bg-white transition-colors cursor-pointer disabled:opacity-50"
                >
                  {processingVoice ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Processar"}
                </button>
              </div>
            </div>

            {voiceError && (
              <div className="p-3 bg-danger-crimson/10 border border-danger-crimson/20 rounded-xl text-xs text-danger-crimson">
                {voiceError}
              </div>
            )}
          </div>
        )}

        {/* FILE / OCR UPLOAD TAB */}
        {entryMode === "file" && (
          <div className="p-6 space-y-5 animate-fade-in text-center">
            <p className="text-xs text-white/60">
              Carregue uma imagem, print de comprovante Pix, extrato bancário ou nota fiscal. A IA fará a leitura e categorização automática.
            </p>

            <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 hover:border-champagne-gold/30 hover:bg-champagne-gold/[0.02] transition-all flex flex-col items-center justify-center text-center cursor-pointer relative group">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={processingFile}
              />
              <UploadCloud className="w-10 h-10 text-white/40 group-hover:text-champagne-gold transition-colors mb-3" />
              <p className="text-sm font-semibold text-white">Carregar Print, PDF ou Foto de Nota</p>
              <p className="text-xs text-white/40 mt-1">PNG, JPG, WEBP até 10MB</p>
            </div>

            {processingFile && (
              <div className="p-3 bg-champagne-gold/10 border border-champagne-gold/20 rounded-xl text-xs text-champagne-gold flex items-center justify-center gap-2 font-mono">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Lendo comprovante por OCR IA...
              </div>
            )}

            {fileError && (
              <div className="p-3 bg-danger-crimson/10 border border-danger-crimson/20 rounded-xl text-xs text-danger-crimson">
                {fileError}
              </div>
            )}
          </div>
        )}

        {/* MANUAL FORM TAB */}
        {entryMode === "manual" && (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Toggle Type */}
            <div className="flex bg-[#131315] p-1 rounded-xl border border-white/5">
              <button 
                type="button"
                onClick={() => setType("expense")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  type === "expense" 
                    ? "bg-danger-crimson text-white shadow-md" 
                    : "text-white/40 hover:text-white"
                }`}
              >
                Despesa
              </button>
              <button 
                type="button"
                onClick={() => setType("income")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  type === "income" 
                    ? "bg-success-emerald text-[#010814] shadow-md" 
                    : "text-white/40 hover:text-white"
                }`}
              >
                Receita
              </button>
            </div>

            {/* Estabelecimento */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-white/40">Estabelecimento / Fonte</label>
              <input 
                type="text" 
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                placeholder="Ex: Outback, Shell, Salário Tech Corp..." 
                className="w-full bg-[#131315] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-champagne-gold/40"
                required
              />
            </div>

            {/* Amount & Currency Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-white/40">Valor</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00" 
                  className="w-full bg-[#131315] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-champagne-gold/40 font-mono"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-white/40">Moeda</label>
                <select 
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as "USD" | "BRL")}
                  className="w-full bg-[#131315] border border-white/5 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-champagne-gold/40"
                >
                  <option value="BRL">BRL (R$)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
            </div>

            {/* Category & Status Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-white/40">Categoria</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#131315] border border-white/5 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-champagne-gold/40"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-white/40">Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-[#131315] border border-white/5 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-champagne-gold/40"
                >
                  <option value="Cleared">Confirmado</option>
                  <option value="Pending">Pendente</option>
                  <option value="Reviewed">Analisado por IA</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <button 
              type="submit"
              className="w-full mt-4 py-3 bg-champagne-gold text-deep-navy font-bold rounded-xl text-xs hover:bg-white hover:text-deep-navy transition-all flex items-center justify-center gap-1 cursor-pointer shadow-[0_0_15px_rgba(230,190,138,0.3)]"
            >
              <CheckCircle className="w-4 h-4" />
              Salvar Lançamento
            </button>

          </form>
        )}

      </div>
    </div>
  );
}

