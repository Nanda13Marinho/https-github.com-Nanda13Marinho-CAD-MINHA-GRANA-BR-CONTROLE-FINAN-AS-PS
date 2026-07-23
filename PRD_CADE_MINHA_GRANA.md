# PDR - Documento de Requisitos do Produto (Product Requirements Document)
## **Cadê Minha Grana — Gestão Financeira Pessoal de Alta Performance com IA**

---

### **1. Visão Geral do Produto**
* **Nome da Aplicação:** Cadê Minha Grana
* **Categoria:** FinTech / Personal Financial Management (PFM) / Inteligência Artificial Aplicada
* **Idioma Oficial:** Português do Brasil (pt-BR)
* **Público-Alvo:** Profissionais, investidores, empreendedores e famílias que buscam controle financeiro automatizado, rápido, privado e sem o fardo do preenchimento manual maçante.
* **Proposta Principal de Valor:** Simplificar e acelerar a gestão financeira através de entrada por **Voz com IA** e **OCR de Comprovantes/Prints**, eliminando a necessidade de planilhas manuais.

---

### **2. Problema vs. Solução**

#### **O Problema:**
* **Atrito no Lançamento:** A maioria dos aplicativos exige o preenchimento manual de formulários longos para cada cafezinho ou transporte, levando ao abandono do controle financeiro em poucas semanas.
* **Planilhas Complexas:** Planilhas requerem manutenção constante, não possuem inteligência preditiva e não alertam sobre recorrências perigosas.
* **Privacidade e Receio de Integração Bancária Directa:** Muitos usuários evitam conceder senhas e acessos bancários diretos por receio de vazamentos de dados ou bugs no Open Finance.

#### **A Solução "Cadê Minha Grana":**
* **Lançamento em Segundos por Voz:** O usuário apenas fala (*"Gastei 45 reais no almoço do Outback hoje"*) e a IA identifica valor, estabelecimento, data e categoria instantaneamente.
* **Lançamento por Print / Foto:** Envio de prints de PIX, recibos, comprovantes bancários ou notas fiscais com extração de dados por OCR.
* **Inteligência Preditiva (AI Insight):** Análise em tempo real que sugere alocações para reserva de emergência e identifica picos de gastos operando em Real (R$) ou Dólar (US$).
* **Projeção de Fluxo de Caixa Futuro:** Cronograma horizontal rolável para antecipar contas, salários e vencimentos das próximas semanas.

---

### **3. Arquitetura Técnica e Tecnologias**

* **Frontend:**
  * **React 18 + TypeScript + Vite:** Renderização de alta performance e interface fluida.
  * **Tailwind CSS:** Design de elite com tema escuro (Dark Luxury / Obsidian Gold) sofisticado.
  * **Lucide React:** Biblioteca de ícones vetoriais modernos.
  * **Recharts:** Visualização de gráficos financeiros dinâmicos e comparativos.
* **Backend & Servidor:**
  * **Node.js + Express:** API Gateway responsável pelo processamento de transações, autenticação de sessão e proxies seguros.
  * **Google GenAI SDK (@google/genai / Gemini 3.5 Flash):** Modelo avançado de linguagem natural e visão computacional para interpretação de comandos de voz, leitura de comprovantes e geração de conselhos financeiros.
* **Modos de Entrada de Dados:**
  * **Web Speech API + Gemini Parser:** Captura o áudio do microfone do dispositivo, transcreve em tempo real e estrutura um objeto JSON financeiro padronizado.
  * **OCR por Visão Computacional:** Leitura de imagens base64 via IA multimodal.

---

### **4. Módulos e Funcionalidades Principais**

#### **Módulo 1: Dashboard Consolidado**
* Exibição de Saldo Consolidado com alternância dinâmica entre moedas (BRL `R$` / USD `$`).
* Métrica de Fluxo Líquido mensal centralizada no gráfico circular.
* Indicadores visuais de variação percentual (*vs. mês anterior* e *vs. média anterior*).
* Card dinâmico **AI Insight**: Sugestões acionáveis geradas por Inteligência Artificial em Português do Brasil.

#### **Módulo 2: Cronograma de Contas Futuras (Cash Flow)**
* Barra de rolagem horizontal contínua (*Horizontal Scroll*) com indicador explicativo (*"← Deslize para ver todas as contas →"*).
* Blocos interativos por data (Hoje, Amanhã, Dias da Semana), categorizados com cores para Receitas (Verde) e Despesas (Vermelho).
* Painel de Transferências Planejadas e metas de alocação de capital.

#### **Módulo 3: Modal de Lançamentos Multimodal**
* **Aba Manual:** Formulário limpo com suporte a Moeda (BRL/USD), Categoria, Tipo e Status (Confirmado, Pendente, Analisado por IA).
* **Aba Voz por IA:** Botão de microfone interativo que ouve o comando em Português do Brasil e preenche os campos automaticamente.
* **Aba Print / OCR:** Zona de *Drag & Drop* para envio de arquivos de imagem/comprovante com análise automática pela visão computacional.

#### **Módulo 4: Copiloto Financeiro com IA (AI Chat Advisor)**
* Assistente virtual integrado capaz de responder dúvidas sobre orçamento, estratégias de investimento, reserva de emergência e cálculo de juros compostos.

#### **Módulo 5: Radar Financeiro e Assinaturas**
* Mapeamento de despesas recorrentes (Netflix, Spotify, Academias, Financiamentos) com alertas de vencimento próximo e score de saúde financeira.

#### **Módulo 6: Portal Administrativo Isolado**
* Área exclusiva acessível por administradores para gestão de usuários, controle de permissões e monitoramento de retenção e métricas do sistema.

#### **Módulo 7: Gestão de Planos e Monetização**
* Tabela comparativa de planos (Starter, Pro e Premium).
* **Posicionamento de Automações:** Esclarecimento de que a *Sincronização Bancária Automática (Open Finance)* está prevista para a **segunda fase de implementação de automação do app**, como um recurso exclusivo do plano **Premium**, enquanto a fase atual garante agilidade total via Voz e OCR.

---

### **5. Requisitos Necessários para Implementação do Open Finance (Fase 2)**

Caso o projeto evolua para integração bancária direta em tempo real, os seguintes requisitos formais, técnicos e regulatórios deverão ser atendidos:

1. **Credenciamento Regulatório (Bacen / Open Finance Brasil):**
   * Cadastro oficial no Diretório de Participantes do Open Finance mantido pelo Banco Central do Brasil.
   * Obtenção de Certificados Digitais do Padrão ICP-Brasil (e-CNPJ) do tipo A3 ou HSM para assinatura de mensagens e TLS mútuo (mTLS).
2. **Utilização de Hubs/Provedores de Open Banking (BaaS):**
   * Parceria com integradores autorizados (ex: Pluggy, Belvo ou Celcoin) para consumo de APIs padronizadas dos bancos sem necessidade de infraestrutura bancária do zero.
3. **Adequação à LGPD e Consentimento Explicito:**
   * Telas de opt-in formal onde o usuário autoriza explicitamente o compartilhamento de dados bancários com renovação periódica.
4. **Segurança e Conformidade (PCI-DSS & Criptografia):**
   * Criptografia de dados em trânsito (TLS 1.3) e em repouso (AES-256).
   * Armazenamento seguro de *tokens* de acesso renováveis via OAuth2/OIDC.

---

### **6. Requisitos Não-Funcionais**

* **Responsividade:** Layout desktop-first com adaptação mobile responsiva para telas de smartphones e tablets.
* **Desempenho:** Carregamento inicial em menos de 1.5 segundos; resposta das análises de IA em menos de 2 segundos.
* **Localização Linguística:** 100% dos textos da interface traduzidos e adaptados ao Português do Brasil (pt-BR).
* **Acessibilidade:** Contrastes de cores alinhados com os padrões WCAG AA.

---

*Documento gerado para apresentação e importação no NotebookLM / Apresentações Executivas.*
