# Jornada IA

Quiz gamificado sobre Inteligência Artificial para executivos brasileiros. Sete fases temáticas (inspiradas em Forrest Gump), pontuação por maturidade e dashboard analítico para o organizador.

**Stack:** Next.js 14 · TypeScript · Supabase (Auth + PostgreSQL) · Tailwind CSS

---

## Pré-requisitos

- Node.js 18+
- npm 9+ (ou pnpm/yarn)
- Conta no [Supabase](https://supabase.com) (gratuita)
- Conta no [Google Cloud Console](https://console.cloud.google.com) para OAuth

---

## 1. Configurar o Supabase

### 1.1 Criar projeto

1. Acesse [supabase.com](https://supabase.com) → **New project**
2. Escolha uma região próxima ao Brasil (ex: South America - São Paulo)
3. Anote a **URL do projeto** e as **chaves de API** em *Project Settings → API*

### 1.2 Executar migrações

No painel do Supabase, vá em **SQL Editor** e execute os arquivos na ordem:

```sql
-- 1. Tabelas principais e políticas RLS
-- Conteúdo de: supabase/migrations/001_quiz_tables.sql

-- 2. Coluna de perfil de maturidade
-- Conteúdo de: supabase/migrations/002_add_maturity_profile.sql
```

Ou cole cada arquivo diretamente no SQL Editor e clique em **Run**.

### 1.3 Configurar autenticação Google OAuth

1. No painel do Supabase: **Authentication → Providers → Google**
2. Habilite o provider Google e copie a **Callback URL** exibida
   (formato: `https://SEU_PROJETO.supabase.co/auth/v1/callback`)
3. No [Google Cloud Console](https://console.cloud.google.com):
   - Crie um projeto → **APIs & Services → Credentials**
   - Clique em **Create Credentials → OAuth Client ID**
   - Tipo de aplicação: **Web application**
   - Em *Authorized redirect URIs*, cole a Callback URL do Supabase
   - Copie o **Client ID** e **Client Secret**
4. De volta no Supabase, preencha o **Client ID** e **Client Secret** do Google e salve

---

## 2. Variáveis de ambiente

Copie o arquivo de exemplo e preencha com suas credenciais:

```bash
cp .env.example .env.local
```

| Variável | Onde encontrar |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → service_role |
| `NEXT_PUBLIC_OWNER_EMAIL` | Seu e-mail de login (terá acesso a `/dashboard`) |

> **Atenção:** `SUPABASE_SERVICE_ROLE_KEY` nunca deve ser exposta ao cliente. Ela é usada apenas em Server Components no dashboard admin.

---

## 3. Rodar localmente

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

> Para testar o login localmente, adicione `http://localhost:3000/auth/callback` nas URIs autorizadas do Google Cloud Console.

### Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (porta 3000) |
| `npm run build` | Build de produção com lint e type check |
| `npm run start` | Inicia o servidor de produção (requer build anterior) |
| `npm run lint` | Executa ESLint em todo o projeto |

---

## 4. Deploy na Vercel

### 4.1 Via GitHub (recomendado)

1. Faça push do repositório para o GitHub
2. Acesse [vercel.com](https://vercel.com) → **New Project** → importe o repositório
3. Na tela de configuração, adicione as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_OWNER_EMAIL`
4. Clique em **Deploy**

### 4.2 Após o deploy: configurar URL de produção

Pegue a URL da Vercel (ex: `https://jornada-ia.vercel.app`) e configure:

**Supabase → Authentication → URL Configuration:**
- Site URL: `https://jornada-ia.vercel.app`
- Redirect URLs: `https://jornada-ia.vercel.app/auth/callback`

**Google Cloud Console → OAuth Client → Authorized redirect URIs:**
- Adicione: `https://jornada-ia.vercel.app/auth/callback`

### 4.3 Via Vercel CLI

```bash
npm i -g vercel
vercel
```

---

## 5. Estrutura do banco de dados

```
auth.users                          (gerenciado pelo Supabase)
├─ id            uuid  PK
├─ email         text
└─ user_metadata       → name, avatar_url (vindos do Google)

question_answers                    (respostas individuais)
├─ id            uuid  PK
├─ user_id       uuid  FK → auth.users
├─ phase_id      int        (1–7)
├─ question_id   int        (1–5)
├─ option_letter text       (A–D)
├─ points_earned int        (1–5)
└─ answered_at   timestamptz

phase_completions                   (uma linha por fase concluída)
├─ id               uuid  PK
├─ user_id          uuid  FK → auth.users
├─ phase_id         int        (1–7)
├─ total_points     int        (0–25)
├─ maturity_profile text       (preenchido apenas na fase 1)
└─ completed_at     timestamptz
```

**RLS ativo:** usuários leem e escrevem apenas os próprios dados. A tabela `phase_completions` tem política pública de leitura para exibir ranking anônimo. O dashboard admin usa `service_role`, que ignora RLS.

---

## 6. Rotas da aplicação

| Rota | Descrição | Proteção |
|---|---|---|
| `/` | Splash com login Google | Pública |
| `/auth/callback` | Callback OAuth | Pública (API Route) |
| `/hub` | Dashboard do participante | Login obrigatório |
| `/fase/[id]` | Intro da fase | Login + lock sequencial |
| `/fase/[id]/pergunta/[num]` | Perguntas | Login + lock sequencial |
| `/fase/[id]/resultado` | Resultado da fase | Login obrigatório |
| `/dashboard` | Analytics do organizador | Login + `OWNER_EMAIL` |

---

## 7. Fluxo completo

```
/ → Google OAuth → /auth/callback
                         └─ /hub
                              └─ /fase/1
                                   └─ /fase/1/pergunta/1 → 2 → 3 → 4 → 5
                                        └─ /fase/1/resultado
                                             └─ /fase/2 → ... → /fase/7/resultado
                                                                       └─ /hub
```

Cada fase só é desbloqueada após a conclusão da anterior. A fase 7 (bônus surpresa, 25 pts) requer a conclusão das fases 1–6.
