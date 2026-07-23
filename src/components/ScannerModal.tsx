import React, { useState } from "react";
import { X, UploadCloud, Eye, RefreshCw, FileCheck, HelpCircle, ScanLine, Coffee, ShoppingCart } from "lucide-react";
import { Transaction } from "../types";

interface ScannerModalProps {
  onClose: () => void;
  onSuccess: (t: Transaction) => void;
}

export default function ScannerModal({ onClose, onSuccess }: ScannerModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scannedResult, setScannedResult] = useState<Transaction | null>(null);

  // Convert uploaded image to base64 and post to /api/ocr
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setScannedResult(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        const res = await fetch("/api/ocr", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ imageBase64: base64String })
        });

        if (!res.ok) {
          const json = await res.json();
          throw new Error(json.error || "Erro ao processar imagem.");
        }

        const data = await res.json();
        if (data.success && data.transaction) {
          setScannedResult(data.transaction);
        } else {
          throw new Error("Não foi possível extrair dados válidos da imagem.");
        }
      } catch (err: any) {
        setError(err.message || "Falha ao processar nota fiscal.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Preset sample receipts for zero-friction user testing
  const simulateSampleScan = async (sampleName: "starbucks" | "supermarket") => {
    setLoading(true);
    setError(null);
    setScannedResult(null);

    // Simulated beautiful sample receipts base64 contents
    // Apple Store representation
    const appleReceiptPreset = {
      merchant: sampleName === "starbucks" ? "Starbucks Coffee" : "Supermercado Pão de Açúcar",
      category: sampleName === "starbucks" ? "Restaurantes" : "Supermercado",
      amount: sampleName === "starbucks" ? -24.00 : -187.45,
      currency: sampleName === "starbucks" ? "USD" : "BRL",
      date: "Today, 10:15 AM",
      status: "Cleared" as const,
      id: `t_sim_${Date.now()}`
    };

    // Make an actual call with dummy mock image or simply insert direct with delay to feel realistic
    setTimeout(async () => {
      try {
        const res = await fetch("/api/data");
        if (res.ok) {
          const db = await res.json();
          if (!db.transactions) db.transactions = [];
          db.transactions.unshift(appleReceiptPreset);

          // Save back
          await fetch("/api/data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(db)
          });

          setScannedResult(appleReceiptPreset);
        }
      } catch (e) {
        setError("Erro na simulação do banco.");
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1f1f21] border border-white/5 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        
        {/* Header */}
        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#2a2a2b]/30">
          <div className="flex items-center gap-2">
            <ScanLine className="w-5 h-5 text-ai-cyan" />
            <h3 className="text-lg font-bold text-white">Scanner OCR por IA</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-sm text-white/40">
            Tire uma foto ou carregue um arquivo de nota fiscal / recibo de compra. Nossa Inteligência Artificial lerá os valores, identificará o estabelecimento e adicionará a transação automaticamente.
          </p>

          {/* Upload Dropzone */}
          <div className="border-2 border-dashed border-white/10 rounded-xl p-8 hover:border-ai-cyan/30 hover:bg-ai-cyan/[0.02] transition-all flex flex-col items-center justify-center text-center cursor-pointer relative group">
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={loading}
            />
            <UploadCloud className="w-10 h-10 text-white/40 group-hover:text-ai-cyan transition-colors mb-3" />
            <p className="text-sm font-semibold text-white">Selecionar Arquivo ou Arrastar</p>
            <p className="text-xs text-white/40 mt-1">Formatos suportados: JPG, PNG, WEBP (Max 5MB)</p>
          </div>

          {/* Preset testing alternatives */}
          <div className="space-y-2.5">
            <p className="text-xs font-mono uppercase tracking-wider text-white/40">
              Testar com Exemplos Premium (Sem arquivo)
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => simulateSampleScan("starbucks")}
                disabled={loading}
                className="p-3 bg-white/5 border border-white/5 hover:border-champagne-gold/30 rounded-xl text-xs text-left hover:bg-white/10 transition-all flex items-center justify-between cursor-pointer"
              >
                <div>
                  <p className="font-semibold text-white">Café Starbucks</p>
                  <p className="text-[10px] text-white/40 mt-0.5">$24.00 USD</p>
                </div>
                <Coffee className="w-5 h-5 text-champagne-gold" />
              </button>

              <button 
                onClick={() => simulateSampleScan("supermarket")}
                disabled={loading}
                className="p-3 bg-white/5 border border-white/5 hover:border-ai-cyan/30 rounded-xl text-xs text-left hover:bg-white/10 transition-all flex items-center justify-between cursor-pointer"
              >
                <div>
                  <p className="font-semibold text-white">Supermercado Pão de Açúcar</p>
                  <p className="text-[10px] text-white/40 mt-0.5">R$ 187.45 BRL</p>
                </div>
                <ShoppingCart className="w-5 h-5 text-ai-cyan" />
              </button>
            </div>
          </div>

          {/* Loader */}
          {loading && (
            <div className="p-4 bg-ai-cyan/5 border border-ai-cyan/15 rounded-xl flex items-center gap-3 justify-center text-sm text-white font-mono">
              <RefreshCw className="w-5 h-5 animate-spin text-ai-cyan" />
              OCR analisando recibo por IA...
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="p-4 bg-danger-crimson/10 border border-danger-crimson/20 rounded-xl text-xs text-danger-crimson">
              {error}
            </div>
          )}

          {/* Scan result display */}
          {scannedResult && (
            <div className="p-5 bg-success-emerald/5 border border-success-emerald/20 rounded-xl space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 text-success-emerald font-bold text-sm">
                <FileCheck className="w-5 h-5" />
                Transação Escaneada com Sucesso!
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs pt-1.5 border-t border-white/5">
                <div>
                  <p className="text-white/40 font-mono uppercase text-[9px] tracking-wider">Estabelecimento</p>
                  <p className="font-semibold text-white mt-0.5">{scannedResult.merchant}</p>
                </div>
                <div>
                  <p className="text-white/40 font-mono uppercase text-[9px] tracking-wider">Categoria</p>
                  <p className="font-semibold text-white mt-0.5">{scannedResult.category}</p>
                </div>
                <div>
                  <p className="text-white/40 font-mono uppercase text-[9px] tracking-wider">Valor Total</p>
                  <p className="font-bold text-white mt-0.5 font-mono text-sm">
                    {scannedResult.amount.toLocaleString(scannedResult.currency === "USD" ? "en-US" : "pt-BR", {
                      style: "currency",
                      currency: scannedResult.currency
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-white/40 font-mono uppercase text-[9px] tracking-wider">Data</p>
                  <p className="font-semibold text-white mt-0.5">{scannedResult.date}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  onSuccess(scannedResult);
                  onClose();
                }}
                className="w-full mt-2 py-2.5 bg-success-emerald text-[#010814] rounded-lg font-bold text-xs hover:bg-white hover:text-deep-navy transition-colors cursor-pointer"
              >
                Importar para Lançamentos
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
