# Briefing Técnico — MVP Plataforma de Gamificação IA
**Para: Claude Code**
**Versão: 1.0 — Abril 2026**

---

## 1. VISÃO GERAL DO PROJETO

Desenvolver uma plataforma web **desktop** de gamificação sobre Inteligência Artificial para executivos e profissionais brasileiros. O usuário realiza uma jornada de 6 fases + 1 fase surpresa, respondendo perguntas que revelam seu nível de maturidade em IA, acumula pontos e compete em um ranking anônimo.

**Nome atual:** Jornada IA *(nome em aberto — usar como placeholder)*
**Público:** Desktop only — executivos e gestores brasileiros
**Deploy:** GitHub Pages ou Vercel
**Prazo:** sem prazo fixo — prioridade é qualidade da experiência

---

## 2. STACK TECNOLÓGICA

| Camada | Tecnologia | Motivo |
|--------|-----------|--------|
| Frontend | **Next.js 14** (App Router) | Performance, SSR, deploy fácil |
| Estilização | **Tailwind CSS** | Agilidade, consistência |
| Autenticação | **Supabase Auth** (Google OAuth) | Login com Google sem gerenciar senhas |
| Banco de dados | **Supabase** (PostgreSQL) | Gratuito no tier inicial, seguro, gerenciado |
| Deploy | **Vercel** + repositório **GitHub** | CI/CD automático, domínio gratuito |
| Fontes | Google Fonts: Playfair Display, Lora, Raleway | Identidade visual aprovada |

---

## 3. AUTENTICAÇÃO E DADOS DO USUÁRIO

### Login
- **Apenas Google OAuth** via Supabase Auth
- Sem cadastro manual, sem senha
- Dados coletados: nome, e-mail, foto do Google (apenas para exibição)
- **LGPD:** não armazenar dados sensíveis além do necessário para o funcionamento

### Dados persistidos por usuário
```
users
  id (uuid, Supabase Auth)
  name (string)
  email (string)
  avatar_url (string)
  created_at (timestamp)

progress
  user_id (fk users)
  phase_id (int, 1–7)
  question_id (int)
  answer (string, A/B/C/D)
  points (int)
  completed_at (timestamp)

phase_completions
  user_id (fk users)
  phase_id (int)
  total_points (int)
  maturity_profile (string) — apenas fase 1
  completed_at (timestamp)
```

---

## 4. ESTRUTURA DE PÁGINAS

```
/ → Splash Screen (pública)
/auth/callback → Callback do Google OAuth
/hub → Hub Central (autenticado)
/fase/[id] → Tela de fase — introdução (autenticado)
/fase/[id]/pergunta/[num] → Tela de pergunta (autenticado)
/fase/[id]/resultado → Tela de resultado da fase (autenticado)
/dashboard → Dashboard de KPI — apenas para o dono (Ricardo)
```

---

## 5. DESIGN SYSTEM — IDENTIDADE VISUAL APROVADA

### Paleta de cores
```css
--color-primary:     #D4A853;  /* Dourado Alabama */
--color-primary-dark:#8B6914;  /* Âmbar Escuro */
--color-secondary:   #4A6B8A;  /* Azul Aço */
--color-bg:          #F5EDD8;  /* Creme Marfim — fundo principal */
--color-bg-alt:      #E8DCC8;  /* Bege Claro */
--color-bg-card:     #fff9f0;  /* Branco Quente — cards */
--color-text:        #3A3228;  /* Marrom Profundo — texto */
--color-accent:      #C0392B;  /* Vermelho Jenny — usar com moderação */
```

### Tipografia
```css
font-family-display: 'Playfair Display', serif;  /* H1, títulos, destaque */
font-family-body:    'Lora', serif;               /* Corpo de texto */
font-family-ui:      'Raleway', sans-serif;       /* Botões, labels, UI */
```

### Estilo visual
- **Storyboard corporativo** — traços de esboço, texturas de papel, aquarela sutil
- Fundo: papel levemente amarelado com linhas de caderno (opacity 0.04)
- Cards: `background: #fff9f0`, `border: 1.5px solid rgba(212,168,83,0.4)`, `border-radius: 12–16px`
- Sombras: estilo offset `box-shadow: 3px 3px 0px #8B6914` (não blur)
- **NUNCA usar:** neon, dark mode, glassmorphism, gradientes frios, fontes geométricas modernas

### Botão primário (aprovado — Estilo A)
```css
.btn-primary {
  font-family: 'Raleway', sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #F5EDD8;
  background: #3A3228;
  border: none;
  outline: 3px solid #3A3228;
  outline-offset: 3px;
  border-radius: 4px;
  padding: 15px 28px;
}
.btn-primary:hover {
  background: #8B6914;
  outline-color: #8B6914;
}
```

---

## 6. TELAS — ESPECIFICAÇÃO DETALHADA

### 6.1 Splash Screen (`/`)
- Fundo creme com gradiente golden hour
- Linhas de caderno sutis no background (opacity 0.04)
- Cantos decorativos SVG (estilo esboço)
- Pena branca animada flutuando (CSS animation, loop 6s)
- Eyebrow: "Uma jornada sobre inteligência artificial"
- Título: "Jornada IA" — Playfair Display Bold
- Subtítulo em itálico: "para executivos que querem mais do que hype"
- Divisor decorativo dourado
- Frase adaptada do filme em itálico com aspas decorativas
- Botão "Entrar com Google" — ícone SVG do Google + estilo vintage
- Rodapé separado: dots de fases + "Desktop · Gratuito · Sem coleta de dados sensíveis"

### 6.2 Hub Central (`/hub`)
**Header:**
- Logo + nome da plataforma (esquerda)
- Avatar do usuário + nome + perfil de maturidade (direita)

**Stats row (4 cards):**
- Pontuação total acumulada
- Fase atual
- Ranking geral (#posição entre N jogadores)
- Perfil de maturidade atual

**Trilha de fases (vertical):**
Linha tracejada dourada conectando as fases. Cada fase tem:
- Ícone emoji em círculo
- Nome da fase
- Descrição curta
- Badge de status: Concluída / Em andamento / Bloqueada
- Pontuação (se concluída)
- Mini barra de progresso (se em andamento)

Estados visuais:
- **Concluída:** círculo dourado preenchido + checkmark
- **Em andamento:** círculo com borda dourada + glow sutil
- **Bloqueada:** círculo cinza opaco + ícone de cadeado

Fase surpresa 🍫 aparece no final com borda vermelha tracejada e opacidade reduzida até ser desbloqueada.

**Sidebar:**
- CTA "Continuar [nome da fase]"
- Card de perfil de maturidade com barra de evolução
- Ranking com 5 posições ao redor do usuário (anônimos + você destacado em azul)

### 6.3 Tela de Pergunta (`/fase/[id]/pergunta/[num]`)
**Topbar:** nome da plataforma + fase atual + pontuação acumulada

**Barra de progresso:**
- Label "Pergunta X de 5"
- Barra de progresso linear
- 5 dots indicadores (done / active / pending)

**Card da pergunta:**
- Barra colorida no topo (gradiente dourado)
- Badge "Q[num]" + nome da fase
- Caixa de contexto azul (border-left: 3px solid #4A6B8A)
- Texto da pergunta em Playfair Display Bold
- 4 opções clicáveis

**Comportamento das opções:**
- Hover: deslocamento lateral 3px + borda dourada
- Após seleção: opções não selecionadas ficam com opacity 0.45 e cursor not-allowed
- Opção selecionada: fundo dourado claro + sombra offset
- Feedback educativo aparece abaixo com scroll suave
- Botão "Próxima pergunta →" aparece após resposta (Estilo A aprovado)

### 6.4 Tela de Resultado (`/fase/[id]/resultado`)
- Banner escuro com nome da fase + pontuação
- Card de perfil de maturidade com animação de entrada
  - Apenas na Fase 1: mostra o perfil completo com barra de maturidade animada
  - Outras fases: mostra pontuação + posição no ranking
- 3 stats: pontos da fase, perguntas respondidas, ranking geral
- Insight personalizado por perfil de maturidade
- Preview da próxima fase desbloqueada
- Botão "Avançar para [próxima fase]" (Estilo A)
- Botão secundário "Voltar ao hub"

### 6.5 Dashboard de KPI (`/dashboard`)
**Acesso restrito:** apenas para o usuário dono (verificar por e-mail no Supabase)

**Bloco 1 — KPI Total All Time (fundo escuro):**
- Usuários cadastrados
- Usuários ativos (pelo menos 1 fase iniciada)
- Taxa de conclusão geral
- Tempo médio por fase

**Filtros:** All time / 7 dias / 30 dias

**Bloco 2 — Funil de fases:**
- Barra por fase com % de início vs conclusão
- Marcador visual na fase com maior taxa de abandono

**Bloco 3 — Novos vs Retornantes:**
- Donut chart (SVG puro ou Recharts)

**Bloco 4 — Acessos por dia:**
- Gráfico de barras últimos 7 dias

**Bloco 5 — Três cards:**
- Distribuição de perfis de maturidade
- Pontuação média por fase
- Top 5 ranking + posição do dono

---

## 7. SISTEMA DE GAMIFICAÇÃO

### Pontuação
```
Fases 1–6: cada resposta vale 1, 2, 3 ou 4 pontos conforme maturidade
Fase Surpresa: cada resposta vale 5 pontos (todas as opções)
Pontuação máxima: 145 pontos
```

### Perfis de maturidade (calculado na Fase 1)
```
5–8 pts   → 🪶 A Pena ao Vento (Iniciante)
9–12 pts  → 👟 Começando a Correr (Explorador)
13–16 pts → 🏃 Na Corrida (Estrategista)
17–20 pts → 🍫 Sabe o que vai na Caixa (Avançado)
```

### Desbloqueio de fases
- Fases são sequenciais — cada fase só abre ao concluir a anterior
- Fase Surpresa só abre ao concluir as 6 fases principais

### Ranking
- **Ranking geral:** todos os usuários, ordenado por pontuação total
- **Ranking por perfil:** usuários agrupados pelo perfil da Fase 1
- Exibição anônima — o usuário vê sua posição e as 2 acima e 2 abaixo como "Jogador anônimo"

---

## 8. FASES E CONTEÚDO

### Estrutura de cada fase
```javascript
{
  id: 1,
  name: "O Banco do Parque",
  emoji: "🪑",
  theme: "Diagnóstico: Quem é você no mundo da IA?",
  questions: [/* 5 perguntas */]
}
```

### As 7 fases
| ID | Emoji | Nome | Tema |
|----|-------|------|------|
| 1 | 🪑 | O Banco do Parque | Diagnóstico de maturidade |
| 2 | 🏃 | Alabama | Alfabetização em IA |
| 3 | 🪶 | A Corrida | Trends 2026 / Agentic AI |
| 4 | 🌿 | Vietnam | Estratégia e casos de uso |
| 5 | 🚢 | Bubba Gump | Implementação e escala |
| 6 | 👨‍✈️ | Tenente Dan | Governança, ROI e maturidade |
| 7 | 🍫 | A Caixa de Chocolates | Fase surpresa bem-humorada |

### Estrutura de cada pergunta
```javascript
{
  id: 1,
  context: "70% dos projetos de IA falham porque...",
  question: "Como sua empresa decide...",
  options: [
    { letter: "A", text: "Ainda não chegamos...", points: 1 },
    { letter: "B", text: "Seguimos o que está...", points: 2 },
    { letter: "C", text: "Avaliamos o potencial...", points: 3 },
    { letter: "D", text: "Usamos uma matriz...", points: 4 }
  ],
  feedback: "A diferença entre empresas que escalam..."
}
```

**O banco completo de 35 perguntas está no arquivo:**
`banco-perguntas-gamificacao.md` — usar esse arquivo como fonte de dados para popular o banco ou criar o arquivo `questions.ts` de dados estáticos.

---

## 9. CURSOR CUSTOMIZADO (Easter Egg)

Implementar cursor customizado com tênis correndo seguindo o mouse:
- SVG de tênis estilo storyboard (traço à mão)
- Movimento suave com leve delay (lerp)
- Pode ter leve animação de "corrida" nos cadarços
- Desativar em inputs e áreas de texto para não atrapalhar

---

## 10. ELEMENTOS DECORATIVOS RECORRENTES

Usar em múltiplas telas como elementos de identidade:
- **Pena branca** (`🪶`) — elemento de transição e animação
- **Linhas de caderno** — background sutil em todas as telas
- **Cantos decorativos SVG** — bordas estilo esboço
- **Divisor dourado** — linha + diamante central
- **Grão analógico** — overlay sutil de textura (SVG filter ou pseudo-element)

---

## 11. SONS (opcional — implementar por último)

- Som suave ao selecionar uma opção
- Som de "conclusão" ao terminar uma fase
- Som de "desbloqueio" ao abrir nova fase
- Sem trilha sonora contínua
- Botão de mute acessível em todas as telas

---

## 12. RESPONSIVIDADE

**Desktop only** — a plataforma não precisa funcionar em mobile.
Breakpoint mínimo suportado: **1024px de largura**.
Exibir mensagem amigável em telas menores informando que a experiência é desktop.

---

## 13. CONFIGURAÇÃO DO SUPABASE

### Tabelas necessárias
```sql
-- Usuários (gerenciado pelo Supabase Auth)
-- Apenas criar as tabelas de progresso:

CREATE TABLE phase_completions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  phase_id int NOT NULL,
  total_points int NOT NULL,
  maturity_profile text,
  completed_at timestamp DEFAULT now()
);

CREATE TABLE question_answers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  phase_id int NOT NULL,
  question_id int NOT NULL,
  answer text NOT NULL,
  points int NOT NULL,
  answered_at timestamp DEFAULT now()
);

-- Row Level Security: usuário só acessa seus próprios dados
ALTER TABLE phase_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access own data" ON phase_completions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access own data" ON question_answers
  FOR ALL USING (auth.uid() = user_id);
```

### Variáveis de ambiente necessárias
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY= (apenas para dashboard admin)
NEXT_PUBLIC_OWNER_EMAIL= (e-mail do dono para acesso ao dashboard)
```

---

## 14. ESTRUTURA DE ARQUIVOS SUGERIDA

```
/
├── app/
│   ├── page.tsx                    # Splash Screen
│   ├── hub/page.tsx                # Hub Central
│   ├── fase/[id]/
│   │   ├── page.tsx                # Intro da fase
│   │   ├── pergunta/[num]/page.tsx # Tela de pergunta
│   │   └── resultado/page.tsx      # Resultado da fase
│   ├── dashboard/page.tsx          # Dashboard KPI
│   └── auth/callback/route.ts      # OAuth callback
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ProgressBar.tsx
│   │   └── Badge.tsx
│   ├── game/
│   │   ├── QuestionCard.tsx
│   │   ├── OptionButton.tsx
│   │   ├── FeedbackBox.tsx
│   │   ├── PhaseTrail.tsx
│   │   └── MaturityProfile.tsx
│   ├── layout/
│   │   ├── Topbar.tsx
│   │   └── PageBackground.tsx
│   └── decorative/
│       ├── Feather.tsx
│       ├── CornerDecor.tsx
│       └── CustomCursor.tsx
├── data/
│   └── questions.ts                # Banco completo das 35 perguntas
├── lib/
│   ├── supabase.ts
│   ├── auth.ts
│   └── scoring.ts
└── styles/
    └── globals.css                 # CSS variables + Tailwind
```

---

## 15. ORDEM DE DESENVOLVIMENTO RECOMENDADA

1. **Setup inicial** — Next.js + Tailwind + Supabase + Google OAuth
2. **Design tokens** — CSS variables, fontes, componentes base (Button, Card)
3. **Splash Screen** — primeira impressão, login com Google
4. **Hub Central** — dashboard do usuário com trilha de fases
5. **Tela de Pergunta** — fluxo completo de resposta com feedback
6. **Tela de Resultado** — perfil de maturidade + próxima fase
7. **Persistência** — salvar progresso e pontuação no Supabase
8. **Ranking** — cálculo e exibição anônima
9. **Dashboard KPI** — restrito ao dono
10. **Cursor customizado** — easter egg dos tênis
11. **Sons** — efeitos sonoros pontuais
12. **Tela de conclusão completa** — certificado (fase posterior)
13. **Deploy** — Vercel + GitHub

---

## 16. REFERÊNCIAS VISUAIS

As telas abaixo foram prototipadas e aprovadas. Usar como referência fiel de layout, cores e comportamento:

- **Splash Screen:** pena animada, fundo creme, botão Google vintage
- **Hub Central:** trilha vertical de fases com estados visuais claros
- **Tela de Pergunta:** contexto azul + pergunta + 4 opções + feedback + botão Estilo A
- **Tela de Resultado:** banner escuro + card de perfil + barra animada
- **Dashboard KPI:** fundo escuro para KPIs all time + funil + charts

---

*Briefing aprovado — iniciar desenvolvimento do MVP*
*Projeto: Jornada IA — Plataforma de Gamificação sobre IA*
*Abril 2026*
