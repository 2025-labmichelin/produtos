# Dashboard de Projetos — Neoenergia × Wittel

> **Versão:** PROD **v1.1**
> **Tecnologia:** HTML + JS puro (sem dependências externas)
> **Entrada de dados:** export JSON do Trello (arquivo único)

---

## 1) Visão Geral

Este dashboard lê **um arquivo JSON exportado do Trello** diretamente no navegador e apresenta:

* **KPIs** no topo (Cards Total, Cards Ativos, Atrasados – final/kanban, Finalizados)
* **4 cards de distribuição** em formato de tiles: **Fora do fluxo**, **Pré‑projeto**, **Projetos (execução)** e **CX**
* **Tabela detalhada** com Projeto, Lista, Responsável, Entrega, Entrega Final, PUC, Progresso, Atualizado e Link

Sem back‑end, sem bibliotecas externas e sem envio de dados para servidores.

---

## 2) Como usar (produção)

1. Abra o **HTML** publicado (GitHub Pages ou outro hosting estático).
2. Clique em **Carregar JSON** e selecione o export do Trello (ex.: `projetos.json`).
3. Aguarde a mensagem **“Arquivo carregado com sucesso • N cards ativos”**.

> **Dica:** a leitura usa `FileReader`, então **não há CORS**. O arquivo fica **local** no navegador.

---

## 3) Definições de contagem

### 3.1 O que é **Cards Total**

* **Válidos** = todos os cards **abertos** do Trello **menos** exclusões (abaixo)
* **Bruto** = todos os cards **abertos** do Trello (antes das exclusões)
* **KPI “Cards Total”** exibe:
  **Número grande** = *Válidos*
  **%** ao lado = *Válidos / Bruto*

### 3.2 Exclusões aplicadas

* **Listas excluídas**: `Painel`, `Manual de Utilização`
* **Cards‑placeholder**: qualquer card cujo **nome = nome da lista** (após **normalização**: trim, acentos e caixa)
* **Cards fechados** (`closed: true`) nunca entram

### 3.3 “Cards Ativos”

* Soma dos cards distribuídos entre as **listas ativas** (15 etapas):

  * **Pré‑projeto**: `Nova Demanda`, `Estudo Téc/RN`, `Levantamento de Esforço`, `Aprovação de Esforço`
  * **Execução**: `Planejamento`, `Cronograma`, `Debito Técnico`, `Construção da EF`, `Confirmação da EF (WTéc)`, `Validação EF`, `Pronto para DEV`, `Dev`, `QA Wittel`, `Certificação`, `Deploy`

### 3.4 “Finalizados” e “Fora do fluxo”

* **Finalizados**: `Concluído`, `Acompanha Resultados`
* **Fora do fluxo**: `Backlog`, `Suspenso`, `Cancelado`

---

## 4) Regras de negócio

### 4.1 Datas

* **Entrega (due)**: do campo `due` do Trello
* **Entrega Final (finalDue)**: maior data encontrada no checklist cujo nome contém **“Data de Entrega”** (no card). Se não houver, fica `—`.
* **Atualizado**: `dateLastActivity` do card; se o Trello enviar uma data futura, cortamos para **hoje**.
* **Atrasado (kanban)**: `due` no passado **e** card **não** está finalizado nem fora do fluxo.
* **Atrasado (final)**: `finalDue` no passado **e** card **não** está finalizado nem fora do fluxo.
* **Stale / “Sem atualização”**: se `Atualizado` ≥ **10 dias** atrás e o card **não** está finalizado nem fora do fluxo.

### 4.2 Progresso (%)

* Soma de **todos os checklists** do card:
  `progress = itens_concluídos / itens_totais` (se não houver itens, mostra `—`).

### 4.3 Normalização de listas (sinônimos)

Os nomes de lista são normalizados (acentos/caixa/“do/de”). Mapeamentos principais:

* `Levantamento do Esforço` → **Levantamento de Esforço**
* `Aprovação do Esforço` → **Aprovação de Esforço**
* `Construção EF` → **Construção da EF**
* `A Fazer` / `A fazer` → **Nova Demanda**
* `Confirmação EF (WTec)` / `Confirmacao da EF (WTec)` → **Confirmação da EF (WTéc)**

### 4.4 Ordenação da tabela

1. Em fluxo primeiro (não “Fora do fluxo”);
2. Depois **Final atrasado**;
3. Depois **Atrasado (kanban)**;
4. Depois **Progresso desc**.
   Clique no cabeçalho **Progresso** para alternar asc/desc.

---

## 5) Layout / UX

* **Tema claro** (inspirado em Apple / Salesforce): fundo neutro, cards brancos, tipografia clean.
* **Semânticas de cor**:
  `Concluído` = **verde**, `Atrasados` = **vermelho**, `Fora do fluxo` = **âmbar**, `Prioridade (PUC)` = **azul**.
* **Quatro cards** superiores (distribuição) com rótulos:
  **Fora do fluxo · Neoenergia**
  **Pré‑projeto · CSM Wittel**
  **Projetos (execução)**
  **CX**

---

## 6) Publicação (GitHub Pages)

1. Faça commit do **HTML** (arquivo único).
2. Ative o **GitHub Pages** na branch desejada.
3. Acesse a URL pública e use **Carregar JSON**.
4. (Opcional) Coloque `projetos.json` na mesma pasta e adicione um botão de fetch se desejar; o código já lida com cache via `?nocache=`.

> **Importante:** alguns browsers **bloqueiam `fetch` em `file://`**. Em PROD use sempre via HTTPS (Pages/hosting).

---

## 7) Diagnóstico / Troubleshooting

* **“Arquivo inválido”** ao carregar: verifique se é um **export do Trello** válido; se o arquivo tiver **BOM**, o código remove com `^\uFEFF`.
* **Nada acontece ao clicar em Carregar JSON**: verifique no Console do navegador (F12). A faixa de status (topo) exibe mensagens de erro.
* **KPIs zerados**: confirme se as listas do seu board batem com os nomes **normalizados** acima.

---

## 8) Desenvolvimento / Manutenção

Locais principais no código:

* **Listas ativas**: `ORDERED_ACTIVE_LABELS` (15 etapas)
* **Grupos/tiles**: `GROUP_PRE_LABELS`, `GROUP_EXEC_LABELS`, `GROUP_OUT_LABELS`, `GROUP_CX_LABELS`
* **Sinônimos de listas**: array `pairs` no parser (normalização)
* **Exclusões totais**: `EXCLUDE_FULL_LIST_KEYS` (ex.: `Painel`, `Manual de Utilização`)
* **Limiar de stale**: `STALE_DAYS = 10`

Para trocar nomes/ordem, edite os arrays acima. Para incluir novas exclusões globais, adicione em `EXCLUDE_FULL_LIST_KEYS`.

---

## 9) Roadmap (ideias)

* Badge de **total** no título de cada card de distribuição (opcional)
* Ordenação **por quantidade** dentro dos cards (hoje é ordem fixa)
* Export **CSV** a partir da tabela
* Tema escuro opcional (toggle)

---

## 10) Histórico

* **v1.1** — *Atual*:

  * KPI **Cards Total** (com % = válidos/bruto)
  * Novas etapas: **Nova Demanda** (antes “A Fazer”) e **Planejamento** em Execução
  * Quatro cards independentes (Fora do fluxo / Pré‑projeto / Execução / CX)
  * Coluna **Atualizado** a partir de `dateLastActivity` e marcação **stale**
  * Regras de normalização e exclusão refinadas
* **v1.0** — primeira versão em PROD

---

## 11) Licença

Uso interno Neoenergia × Wittel. Ajuste conforme políticas da empresa.
