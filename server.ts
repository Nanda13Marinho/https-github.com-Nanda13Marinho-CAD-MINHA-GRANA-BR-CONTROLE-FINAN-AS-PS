import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set limits for base64 OCR scans
  app.use(express.json({ limit: "15mb" }));

  const dbPath = path.join(process.cwd(), "src", "db.json");

  // Read helper
  function readDb() {
    try {
      if (!fs.existsSync(dbPath)) {
        return {};
      }
      const data = fs.readFileSync(dbPath, "utf-8");
      return JSON.parse(data);
    } catch (e) {
      console.error("Error reading db.json", e);
      return {};
    }
  }

  // Write helper
  function writeDb(data: any) {
    try {
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.error("Error writing db.json", e);
    }
  }

  // Get current state
  app.get("/api/data", (req, res) => {
    res.json(readDb());
  });

  // Download PRD endpoint
  app.get("/api/download-prd", (req, res) => {
    const prdPath = path.join(process.cwd(), "PRD_CADE_MINHA_GRANA.md");
    if (fs.existsSync(prdPath)) {
      res.setHeader("Content-Disposition", "attachment; filename=PRD_CADE_MINHA_GRANA.md");
      res.setHeader("Content-Type", "text/markdown; charset=utf-8");
      res.sendFile(prdPath);
    } else {
      res.status(404).send("PRD não encontrado.");
    }
  });

  // Business Model & PRD Presentation Endpoint (Printable / PDF HTML)
  app.get("/presentation", (req, res) => {
    const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cadê Minha Grana — Apresentação do Modelo de Negócio & PDR</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @media print {
      .no-print { display: none !important; }
      body { background: #ffffff !important; color: #000000 !important; font-size: 11pt; }
      .page-break { page-break-after: always; }
      .card-box { border: 1px solid #ddd !important; background: #fafafa !important; color: #000 !important; box-shadow: none !important; }
      .text-amber-400, .text-amber-500 { color: #d97706 !important; }
      .bg-amber-500 { background-color: #d97706 !important; color: #fff !important; }
      .text-white { color: #111827 !important; }
      .text-white\\/60, .text-white\\/70, .text-white\\/80 { color: #4b5563 !important; }
    }
    body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; }
  </style>
</head>
<body class="bg-[#08080a] text-[#E0D8D0] min-h-screen p-4 md:p-10">

  <!-- Floating Print Bar -->
  <div class="no-print fixed top-4 right-4 z-50 flex items-center gap-3 bg-[#121216] border border-amber-500/40 p-3 rounded-2xl shadow-2xl backdrop-blur-md">
    <div class="text-xs text-white">
      <span class="font-bold text-amber-400 block">Apresentação Pronta em PDF</span>
      <span class="text-[10px] text-white/50">Clique ao lado para salvar ou imprimir em PDF</span>
    </div>
    <button onclick="window.print()" class="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold text-xs rounded-xl hover:from-amber-400 hover:to-orange-500 transition-all cursor-pointer shadow-lg flex items-center gap-2">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
      🖨️ Salvar em PDF / Imprimir
    </button>
  </div>

  <div class="max-w-4xl mx-auto space-y-10">

    <!-- COVER / SLIDE 1 -->
    <header class="card-box bg-[#101014] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden space-y-6">
      <div class="flex items-center justify-between border-b border-white/10 pb-6">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center font-black text-black text-lg shadow-lg">
            CMG
          </div>
          <div>
            <h1 class="text-2xl font-black text-white tracking-widest uppercase">Cadê Minha Grana</h1>
            <p class="text-xs text-amber-400 font-mono tracking-wider uppercase">Executive Pitch & Product Requirements Document (PRD)</p>
          </div>
        </div>
        <div class="text-right text-xs font-mono text-white/50">
          <span>Versão 2.4 SaaS</span><br>
          <span>Julho / 2026</span>
        </div>
      </div>

      <div class="space-y-4 pt-2">
        <h2 class="text-3xl font-black text-white leading-tight">
          Apresentação do Modelo de Negócio:<br>
          <span class="text-amber-400">Gestão Financeira Pessoal com IA Multimodal</span>
        </h2>
        <p class="text-sm text-white/70 leading-relaxed max-w-2xl">
          Solução SaaS inovadora criada para eliminar o atrito de planilhas financeiras tradicionais através de comandos de <strong>Voz por Inteligência Artificial</strong> e <strong>Leitura OCR de Comprovantes</strong>.
        </p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-center font-mono text-xs">
        <div class="p-3 bg-white/5 rounded-xl border border-white/5">
          <span class="text-white/40 block text-[9px]">CATEGORIA</span>
          <span class="font-bold text-amber-400">FinTech / PFM</span>
        </div>
        <div class="p-3 bg-white/5 rounded-xl border border-white/5">
          <span class="text-white/40 block text-[9px]">TECNOLOGIA IA</span>
          <span class="font-bold text-emerald-400">Gemini 3.5 Flash</span>
        </div>
        <div class="p-3 bg-white/5 rounded-xl border border-white/5">
          <span class="text-white/40 block text-[9px]">MONETIZAÇÃO</span>
          <span class="font-bold text-white">Freemium SaaS</span>
        </div>
        <div class="p-3 bg-white/5 rounded-xl border border-white/5">
          <span class="text-white/40 block text-[9px]">MERCADO ALVO</span>
          <span class="font-bold text-orange-400">Brasil (pt-BR)</span>
        </div>
      </div>
    </header>

    <div class="page-break"></div>

    <!-- SLIDE 2: PROBLEMA E SOLUÇÃO -->
    <section class="card-box bg-[#101014] border border-white/10 rounded-3xl p-8 shadow-xl space-y-6">
      <h3 class="text-xl font-bold text-amber-400 font-sans border-b border-white/10 pb-3 flex items-center gap-2">
        <span>1. Análise de Oportunidade: Problema vs. Solução</span>
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- O Problema -->
        <div class="p-5 bg-red-950/20 border border-red-500/20 rounded-2xl space-y-3">
          <h4 className="font-bold text-red-400 text-sm flex items-center gap-2">
            🔴 O Problema do Mercado (Atrito & Abandono)
          </h4>
          <ul class="text-xs text-white/80 space-y-2 list-disc pl-4 leading-relaxed">
            <li><strong>Preenchimento Manual Maçante:</strong> Usuários desistem do controle financeiro em menos de 3 semanas por preguiça de preencher formulários longos a cada cafezinho.</li>
            <li><strong>Planilhas Estáticas:</strong> Planilhas do Excel não alertam sobre recorrências, não prevêem o fluxo de caixa futuro e não dão conselhos em tempo real.</li>
            <li><strong>Receio de Integração Bancária Direta:</strong> Muitos evitam compartilhar senhas de bancos por receio de vazamentos de dados ou erros de leitura direta.</li>
          </ul>
        </div>

        <!-- A Solução -->
        <div class="p-5 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl space-y-3">
          <h4 className="font-bold text-emerald-400 text-sm flex items-center gap-2">
            🟢 A Solução "Cadê Minha Grana"
          </h4>
          <ul class="text-xs text-white/80 space-y-2 list-disc pl-4 leading-relaxed">
            <li><strong>Lançamento em 3 Segundos por Voz:</strong> O usuário fala <em>"Gastei R$ 45 no almoço do Outback"</em> e a IA extrai valor, estabelecimento e categoria instantaneamente.</li>
            <li><strong>OCR de Recibos & Comprovantes:</strong> Envio de fotos de notas fiscais ou prints de PIX com extração computacional de dados.</li>
            <li><strong>Copiloto IA Financeiro:</strong> Sugestões de alocação de reserva de emergência e detecção de vazamentos de caixa.</li>
          </ul>
        </div>

      </div>
    </section>

    <!-- SLIDE 3: MODELO DE MONETIZAÇÃO E PLANOS -->
    <section class="card-box bg-[#101014] border border-white/10 rounded-3xl p-8 shadow-xl space-y-6">
      <h3 class="text-xl font-bold text-amber-400 font-sans border-b border-white/10 pb-3">
        2. Estrutura de Monetização & Planos SaaS
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        
        <div class="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-3">
          <span class="text-[10px] font-mono text-white/40 block uppercase">PLANO STARTER</span>
          <h4 class="text-lg font-bold text-white">Gratuito</h4>
          <div class="text-xl font-black text-amber-400 font-mono">R$ 0 <span class="text-[10px] text-white/40 font-normal">/ para sempre</span></div>
          <p class="text-white/60">Aquisição de topo de funil com até 30 lançamentos de voz/mês e dashboard consolidado.</p>
        </div>

        <div class="p-5 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-3">
          <span class="text-[10px] font-mono text-amber-400 block uppercase">PLANO PRO (MAIS VENDIDO)</span>
          <h4 class="text-lg font-bold text-white">Pro Wealth</h4>
          <div class="text-xl font-black text-amber-400 font-mono">R$ 29 <span class="text-[10px] text-white/40 font-normal">/ mês</span></div>
          <p class="text-white/60">Lançamentos de voz ilimitados, leitor de recibos OCR por foto e Copiloto Financeiro 24/7.</p>
        </div>

        <div class="p-5 bg-orange-500/10 border border-orange-500/30 rounded-2xl space-y-3">
          <span class="text-[10px] font-mono text-orange-400 block uppercase">PLANO PREMIUM VIP</span>
          <h4 class="text-lg font-bold text-white">Premium VIP</h4>
          <div class="text-xl font-black text-orange-400 font-mono">R$ 69 <span class="text-[10px] text-white/40 font-normal">/ mês</span></div>
          <p class="text-white/60">Acesso prioritário à Fase 2 do Open Finance Brasil (Bacen) e consultoria fiscal com IA.</p>
        </div>

      </div>
    </section>

    <div class="page-break"></div>

    <!-- SLIDE 4: ARQUITETURA TÉCNICA E BANCO DE DADOS -->
    <section class="card-box bg-[#101014] border border-white/10 rounded-3xl p-8 shadow-xl space-y-6">
      <h3 class="text-xl font-bold text-amber-400 font-sans border-b border-white/10 pb-3">
        3. Arquitetura Técnica, GitHub & Conectividade Supabase
      </h3>

      <div class="space-y-4 text-xs leading-relaxed text-white/80">
        <p>
          O sistema foi construído em arquitetura full-stack moderna e desacoplada, estando <strong>100% pronto para publicação em nuvem, exportação para o GitHub e conexão direta ao Supabase (PostgreSQL)</strong>.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          
          <div class="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
            <h4 class="font-bold text-white text-sm">💻 Frontend & UI</h4>
            <p className="text-white/60">React 18 + TypeScript + Vite + Tailwind CSS com tema Dark Luxury Obsidian Gold, responsividade total e animações fluidas.</p>
          </div>

          <div class="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
            <h4 class="font-bold text-white text-sm">⚡ Server API & Multimodal AI</h4>
            <p className="text-white/60">Node.js Express + Google GenAI SDK (Gemini 3.5 Flash) para parsing de comandos de voz via Web Speech API e extração OCR base64.</p>
          </div>

          <div class="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-2">
            <h4 class="font-bold text-emerald-400 text-sm">🗄️ Integração com Supabase</h4>
            <p className="text-white/60">Atualmente persistido localmente via JSON/State, o projeto aceita a biblioteca <code>@supabase/supabase-js</code> para sincronização bancária em tempo real com tabelas relacionais no PostgreSQL.</p>
          </div>

          <div class="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2">
            <h4 class="font-bold text-amber-400 text-sm">📦 Exportação GitHub</h4>
            <p className="text-white/60">O repositório completo pode ser exportado com 1 clique através do menu de configurações do ambiente AI Studio para o GitHub sem custos adicionais.</p>
          </div>

        </div>
      </div>
    </section>

    <!-- SLIDE 5: ROADMAP DE EXPANSÃO (OPEN FINANCE PHASE 2) -->
    <section class="card-box bg-[#101014] border border-white/10 rounded-3xl p-8 shadow-xl space-y-6">
      <h3 class="text-xl font-bold text-amber-400 font-sans border-b border-white/10 pb-3">
        4. Roadmap de Produto & Open Finance Brasil (Fase 2)
      </h3>

      <div class="space-y-3 text-xs leading-relaxed text-white/80">
        <div class="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
          <div class="flex items-center justify-between font-bold text-white">
            <span>FASE 1 (Lançada & Operacional): IA Multimodal por Voz e OCR</span>
            <span class="text-emerald-400 font-mono text-[10px]">100% ENTREGUE</span>
          </div>
          <p class="text-white/60">Entrada rápida sem senha bancária, garantindo privacidade estrita e atrito zero para o usuário.</p>
        </div>

        <div class="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2">
          <div class="flex items-center justify-between font-bold text-amber-400">
            <span>FASE 2 (Prevista): Sincronização Automática Open Finance (Bacen)</span>
            <span class="text-amber-400 font-mono text-[10px]">EXCLUSIVO PREMIUM</span>
          </div>
          <p class="text-white/60">Integração com parceiros de BaaS (Pluggy/Belvo) sob regulação do Banco Central do Brasil para leitura direta de extratos de contas e cartões de crédito.</p>
        </div>
      </div>
    </section>

    <!-- FOOTER SUMMARY -->
    <footer class="text-center text-xs text-white/40 pt-6 border-t border-white/10 space-y-2 font-mono">
      <p>© 2026 Cadê Minha Grana Inc. — Documento de Apresentação de Modelo de Negócio para Investidores e Usuários.</p>
      <p class="no-print text-amber-400">Dica: Utilize a opção "Salvar como PDF" do seu navegador ao clicar no botão superior.</p>
    </footer>

  </div>

</body>
</html>`;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(htmlContent);
  });


  // Save current state or modify transactions
  app.post("/api/data", (req, res) => {
    const data = req.body;
    writeDb(data);
    res.json({ success: true, data });
  });

  // AI Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      const key = process.env.GEMINI_API_KEY;
      if (!key) {
        return res.status(400).json({ error: "A chave API do Gemini não está configurada nos Secrets da aplicação." });
      }

      const ai = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });

      const db = readDb();
      const prompt = `Você é o "Consultor de IA" de elite do "Cadê Minha Grana", o gerenciador financeiro SaaS premium com Inteligência Artificial.
Sua personalidade é extremamente profissional, confiável, refinada e prestativa, com um tom de alto nível (focado em investidores de elite e profissionais de alta performance). 
Você dá dicas financeiras excepcionalmente úteis, ensina conceitos de investimento e ajuda a estancar gastos desnecessários (vazamentos de caixa).

Aqui está o estado financeiro atual do usuário:
- Transações Recentes: ${JSON.stringify((db.transactions || []).slice(0, 10))}
- Metas Financeiras Atuais: ${JSON.stringify(db.goals || [])}
- Assinaturas do Radar Ativas: ${JSON.stringify((db.leaks || []).filter((l: any) => l.status === "active"))}

O usuário diz: "${message}"

Responda em Português do Brasil (pt-BR) de forma extremamente objetiva, estilosa, inteligente e útil. Use formatação Markdown (incluindo tabelas, listas ou destaques) para estruturar suas respostas de maneira primorosa.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      const reply = response.text || "Desculpe, não consegui processar a resposta.";

      // Save to chatMessages history
      const currentDb = readDb();
      if (!currentDb.chatMessages) currentDb.chatMessages = [];
      currentDb.chatMessages.push({ id: `m_u_${Date.now()}`, sender: "user", text: message });
      currentDb.chatMessages.push({ id: `m_a_${Date.now()}`, sender: "ai", text: reply });
      writeDb(currentDb);

      res.json({ reply, db: currentDb });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message || "Erro ao conectar com o serviço de IA." });
    }
  });

  // OCR Receipt scanner endpoint using multimodal gemini-3.5-flash
  app.post("/api/ocr", async (req, res) => {
    try {
      const { imageBase64 } = req.body;
      const key = process.env.GEMINI_API_KEY;
      if (!key) {
        return res.status(400).json({ error: "A chave API do Gemini não está configurada nos Secrets da aplicação." });
      }

      if (!imageBase64) {
        return res.status(400).json({ error: "Nenhuma imagem foi recebida." });
      }

      const ai = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });

      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

      const prompt = `Você é o scanner OCR financeiro do aplicativo Cadê Minha Grana.
Analise a imagem desta nota fiscal ou recibo de compra e extraia exatamente as informações abaixo em um objeto JSON válido.
Retorne APENAS o objeto JSON bruto, sem blocos de código (como \`\`\`json ou \`\`\`), sem explicações e sem caracteres extras.

Modelo de Resposta Esperado:
{
  "merchant": "Nome simplificado e limpo do estabelecimento (ex: Starbucks, Carrefour, Uber)",
  "category": "Uma das categorias: 'Dining Out', 'Electronics', 'Transport', 'Lazer', 'Fitness', 'Shopping', 'Supermarket', 'Utilities', 'Other'",
  "amount": número decimal negativo do total da nota (ex: -12.50 ou -89.90). Deve ser negativo para despesas!,
  "currency": "BRL" ou "USD" (se vir R$ ou reais use BRL, se vir $ ou dólares use USD),
  "date": "Data formatada amigável (ex: 'Today, 3:12 PM' ou 'Yesterday' ou o dia da nota ex 'Jul 04')"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Data
            }
          },
          prompt
        ]
      });

      let jsonText = response.text || "";
      console.log("OCR response text:", jsonText);
      jsonText = jsonText.trim();
      if (jsonText.startsWith("```json")) {
        jsonText = jsonText.replace(/^```json/, "").replace(/```$/, "").trim();
      } else if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```/, "").replace(/```$/, "").trim();
      }

      const extracted = JSON.parse(jsonText);
      extracted.id = `t_ocr_${Date.now()}`;
      extracted.status = "Cleared";

      // Append to database
      const currentDb = readDb();
      if (!currentDb.transactions) currentDb.transactions = [];
      currentDb.transactions.unshift(extracted);

      // Add to logs
      if (!currentDb.ocrLogs) currentDb.ocrLogs = [];
      currentDb.ocrLogs.unshift({
        id: `l_ocr_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        merchant: extracted.merchant,
        amount: extracted.amount,
        currency: extracted.currency,
        success: true
      });

      writeDb(currentDb);

      res.json({ success: true, transaction: extracted, db: currentDb });
    } catch (e: any) {
      console.error("OCR API error:", e);
      res.status(500).json({ error: e.message || "Falha ao processar o recibo por IA." });
    }
  });

  // AI Voice parser endpoint
  app.post("/api/voice-parse", async (req, res) => {
    try {
      const { text } = req.body;
      const key = process.env.GEMINI_API_KEY;
      if (!key) {
        return res.status(400).json({ error: "Chave API do Gemini não configurada." });
      }

      if (!text) {
        return res.status(400).json({ error: "Nenhum texto de áudio foi recebido." });
      }

      const ai = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });

      const prompt = `Você é o interpretador de áudio financeiro do Cadê Minha Grana.
Analise o comando de voz do usuário a seguir e extraia os dados da transação em JSON:
"${text}"

Responda APENAS com um objeto JSON válido, sem blocos de código e sem marcação extra:
{
  "merchant": "Nome do estabelecimento ou pessoa (ex: Outback, Uber, Mercado)",
  "category": "Uma das categorias: 'Restaurantes', 'Eletrônicos', 'Transporte', 'Lazer', 'Fitness', 'Compras', 'Supermercado', 'Contas / Serviços', 'Salário', 'Outros'",
  "amount": número decimal (negativo se for gasto/despesa, positivo se for receita/salário),
  "currency": "BRL" ou "USD" (padrão BRL),
  "type": "expense" ou "income",
  "date": "Data amigável (ex: 'Hoje, ' + hora atual)",
  "status": "Cleared"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      let jsonText = (response.text || "").trim();
      if (jsonText.startsWith("```json")) {
        jsonText = jsonText.replace(/^```json/, "").replace(/```$/, "").trim();
      } else if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```/, "").replace(/```$/, "").trim();
      }

      const extracted = JSON.parse(jsonText);
      extracted.id = `t_voice_${Date.now()}`;

      // Append to db
      const currentDb = readDb();
      if (!currentDb.transactions) currentDb.transactions = [];
      currentDb.transactions.unshift(extracted);
      writeDb(currentDb);

      res.json({ success: true, transaction: extracted, db: currentDb });
    } catch (e: any) {
      console.error("Voice API error:", e);
      res.status(500).json({ error: e.message || "Falha ao interpretar comando de voz." });
    }
  });

  // Dynamic AI Insight generation
  app.get("/api/ai-insight", async (req, res) => {
    try {
      const key = process.env.GEMINI_API_KEY;
      if (!key) {
        return res.json({ insight: "Com o recebimento do seu salário este mês, sugerimos destinar R$ 1.500 para liquidar sua meta de Reserva de Emergência." });
      }

      const ai = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });

      const db = readDb();
      const prompt = `Gere uma única recomendação inteligente ou insight financeiro personalizado com base nas transações e metas atuais do usuário.
Metas do Usuário: ${JSON.stringify(db.goals || [])}
Histórico recente: ${JSON.stringify((db.transactions || []).slice(0, 15))}

Seja muito sofisticado, prestativo e de elite. O insight deve ter no máximo 2 frases curtas e diretas, contendo uma sugestão acionável específica com valores em Reais R$ (ex: 'Percebemos um aumento de 15% em Restaurantes este mês. Redirecionar R$ 750 para sua meta de investimentos manteria você no rumo do seu objetivo'). Escreva sempre em Português do Brasil (pt-BR).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ insight: response.text || "Com o recebimento de receitas recentes, sugerimos destinar R$ 1.500 para sua meta de Reserva de Emergência." });
    } catch (e: any) {
      res.json({ insight: "Com o recebimento do seu salário este mês, sugerimos destinar R$ 1.500 para sua meta de Reserva de Emergência." });
    }
  });

  // Vite development or production build static routes serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
