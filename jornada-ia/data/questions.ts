export interface Option {
  letter: string
  text: string
  points: number
}

export interface Question {
  id: number
  context: string
  question: string
  options: Option[]
  feedback: string
}

export interface Phase {
  id: number
  name: string
  emoji: string
  theme: string
  questions: Question[]
}

export const phases: Phase[] = [
  {
    id: 1,
    name: 'O Banco do Parque',
    emoji: '🪑',
    theme: 'Diagnóstico: Quem é você no mundo da IA?',
    questions: [
      {
        id: 1,
        context: '70% dos projetos de IA falham porque as empresas começam pela ferramenta, não pelo problema de negócio.',
        question: 'Como sua empresa decide quais projetos de IA priorizar?',
        options: [
          { letter: 'A', text: 'Ainda não chegamos nesse ponto — não temos projetos de IA ativos', points: 1 },
          { letter: 'B', text: 'Seguimos o que está em alta no mercado ou o que concorrentes estão fazendo', points: 2 },
          { letter: 'C', text: 'Avaliamos o potencial, mas sem um critério formal de priorização', points: 3 },
          { letter: 'D', text: 'Usamos uma matriz de impacto e viabilidade com KPIs definidos antes de começar', points: 4 },
        ],
        feedback: 'A diferença entre empresas que escalam IA e as que ficam em pilotos eternos está exatamente aqui: as bem-sucedidas definem o critério de sucesso antes de iniciar. "Reduzir 15% no tempo de atendimento" ou "aumentar 10% na resolução no primeiro contato" são exemplos de KPIs concretos. Sem isso, qualquer ferramenta parece boa — e nenhuma entrega resultado mensurável.',
      },
      {
        id: 2,
        context: 'A Gartner aponta que até 2026, 30% dos projetos de IA Generativa serão abandonados por má qualidade de dados — não por falta de tecnologia.',
        question: 'Como você descreveria a situação dos dados da sua empresa hoje?',
        options: [
          { letter: 'A', text: 'Dados espalhados em planilhas, sistemas legados e e-mails — sem estrutura central', points: 1 },
          { letter: 'B', text: 'Temos alguns sistemas integrados, mas ainda há muitos silos entre áreas', points: 2 },
          { letter: 'C', text: 'Dados razoavelmente organizados, mas com gaps de qualidade e governança', points: 3 },
          { letter: 'D', text: 'Base de dados estruturada, governada e confiável para alimentar modelos de IA', points: 4 },
        ],
        feedback: 'Dados são o combustível da IA — e a maioria das empresas brasileiras está tentando rodar um carro de Fórmula 1 com combustível adulterado. Antes de escolher qualquer ferramenta, a pergunta certa é: meus dados estão prontos? Se não, o caminho mais rápido é o MVDS — Minimum Viable Data Set: limpe apenas os dados necessários para o caso de uso prioritário.',
      },
      {
        id: 3,
        context: 'IA não consegue aprender o que está apenas na cabeça das pessoas. Empresas que cresceram sem documentação de processos usam IA para automatizar caos — mais rápido, em maior escala, com menos controle.',
        question: 'Como estão documentados os processos da sua área ou empresa?',
        options: [
          { letter: 'A', text: 'Quase nada documentado — o conhecimento está nas pessoas, não em sistemas', points: 1 },
          { letter: 'B', text: 'Documentação existe, mas desatualizada ou incompleta', points: 2 },
          { letter: 'C', text: 'Processos principais documentados, mas com gaps em áreas críticas', points: 3 },
          { letter: 'D', text: 'Base de conhecimento estruturada, atualizada e acessível para toda a equipe', points: 4 },
        ],
        feedback: 'Antes de automatizar qualquer coisa, é preciso documentar o processo AS-IS — como ele realmente funciona, não como deveria funcionar. Essa base vai alimentar tanto o RAG quanto o treinamento de agentes. Empresas que pulam essa etapa descobrem tarde que estavam automatizando o problema, não a solução.',
      },
      {
        id: 4,
        context: '"Sem dono, não começa." Projetos de IA sem um responsável formal com autoridade real são os primeiros a serem cortados no próximo ciclo de budget.',
        question: 'Existe alguém na sua empresa que é o "dono" formal das iniciativas de IA — com responsabilidade e KPI definidos?',
        options: [
          { letter: 'A', text: 'Não — IA é assunto de todo mundo, o que na prática significa que não é de ninguém', points: 1 },
          { letter: 'B', text: 'Informalmente sim, mas sem autoridade ou recursos garantidos', points: 2 },
          { letter: 'C', text: 'Temos um responsável, mas a governança ainda está sendo estruturada', points: 3 },
          { letter: 'D', text: 'Sim — há um líder de IA com budget, equipe e metas claras', points: 4 },
        ],
        feedback: 'Não precisa ser um CDO ou um Chief AI Officer — mas precisa ser alguém com nome, responsabilidade e recurso. Projetos sem dono formal sobrevivem enquanto o entusiasta original está presente. Quando ele sai ou muda de área, o projeto para. Institucionalizar a liderança de IA é o que transforma um projeto em uma capacidade permanente da empresa.',
      },
      {
        id: 5,
        context: 'O maior diferencial das empresas que lideram em IA não é tecnologia: é clareza. Saber onde está, o que falta e qual o próximo passo concreto.',
        question: 'Se você fosse resumir em uma frase onde sua empresa está na jornada de IA, qual seria?',
        options: [
          { letter: 'A', text: '"Ainda estamos assistindo de fora — com curiosidade mas sem movimento"', points: 1 },
          { letter: 'B', text: '"Já demos os primeiros passos, mas sem muita clareza do caminho"', points: 2 },
          { letter: 'C', text: '"Estamos na corrida — com tropeços, mas em movimento real"', points: 3 },
          { letter: 'D', text: '"Sabemos onde estamos, para onde vamos e o que precisamos para chegar lá"', points: 4 },
        ],
        feedback: 'Essa resposta não é sobre humildade ou arrogância — é sobre consciência. Você acabou de completar seu diagnóstico. O perfil que aparece agora reflete onde você e sua empresa estão neste momento. Não existe posição errada — existe o próximo passo certo para cada posição. A jornada começa aqui.',
      },
    ],
  },
  {
    id: 2,
    name: 'Alabama',
    emoji: '🏃',
    theme: 'Alfabetização em IA: você sabe do que está falando?',
    questions: [
      {
        id: 1,
        context: 'AI Literacy não é saber programar — é saber fazer as perguntas certas. Existe uma diferença enorme entre automação, machine learning e IA generativa. Usar o termo errado na reunião certa pode significar contratar a solução errada.',
        question: 'Quando alguém na sua empresa fala em "usar IA", o que geralmente está sendo considerado?',
        options: [
          { letter: 'A', text: 'Não sabemos bem distinguir — IA, automação e chatbot parecem a mesma coisa', points: 1 },
          { letter: 'B', text: 'Sabemos que existem tipos diferentes, mas usamos os termos de forma genérica', points: 2 },
          { letter: 'C', text: 'Conseguimos diferenciar IA generativa, automação e machine learning no contexto do negócio', points: 3 },
          { letter: 'D', text: 'A equipe tem clareza técnica e de negócio suficiente para escolher a abordagem certa por caso de uso', points: 4 },
        ],
        feedback: 'Automação executa regras fixas. Machine learning aprende com dados históricos. IA generativa cria conteúdo novo. São três abordagens com custos, prazos e casos de uso completamente diferentes. Um workshop de AI Literacy para lideranças — de 1 dia — é um dos quick wins com maior ROI em qualquer empresa: evita meses de retrabalho por desalinhamento de expectativas.',
      },
      {
        id: 2,
        context: 'O conceito de MVDS — Minimum Viable Data Set — resolve um dos maiores bloqueios em projetos de IA: a paralisia por dados imperfeitos. Em vez de esperar o Data Lake perfeito, você limpa apenas o necessário para o caso de uso prioritário.',
        question: 'Sua empresa já tentou usar IA em algum processo e travou por causa da qualidade ou organização dos dados?',
        options: [
          { letter: 'A', text: 'Não chegamos nem a tentar — sabemos que os dados não estão prontos', points: 1 },
          { letter: 'B', text: 'Já tentamos e travamos exatamente por isso', points: 2 },
          { letter: 'C', text: 'Tivemos esse problema, mas encontramos uma forma de contornar com os dados disponíveis', points: 3 },
          { letter: 'D', text: 'Temos uma estratégia de dados estruturada que nos permite evoluir incrementalmente', points: 4 },
        ],
        feedback: 'Dados bons para um problema específico valem muito mais do que dados mediocres para tudo. O MVDS permite começar com qualidade em um escopo limitado e expandir gradualmente. Empresas que esperam ter o Data Lake perfeito para começar geralmente nunca começam — ou começam tarde demais para recuperar a vantagem competitiva.',
      },
      {
        id: 3,
        context: 'RAG — Retrieval-Augmented Generation — permite conectar um LLM existente à base de documentos internos da empresa sem retreinamento caro. É uma das tecnologias mais práticas e acessíveis para empresas hoje.',
        question: 'Você já ouviu falar em RAG — Retrieval-Augmented Generation?',
        options: [
          { letter: 'A', text: 'Nunca ouvi esse termo', points: 1 },
          { letter: 'B', text: 'Já ouvi, mas não sei o que significa', points: 2 },
          { letter: 'C', text: 'Sei que é uma forma de conectar IA aos documentos internos da empresa sem retreinar o modelo', points: 3 },
          { letter: 'D', text: 'Já implementei ou especifiquei uma solução com RAG', points: 4 },
        ],
        feedback: 'Em vez de treinar um modelo do zero com seus dados — processo caro e lento — o RAG conecta um LLM existente (como GPT ou Claude) à sua base de documentos. O modelo busca as informações relevantes antes de responder. Resultado: respostas precisas, baseadas nos seus dados, sem o custo de treinamento proprietário. É o ponto de entrada mais inteligente para empresas que querem IA com seus próprios dados.',
      },
      {
        id: 4,
        context: 'Human-in-the-Loop é o princípio de manter um humano no ciclo de decisão da IA em pontos críticos — especialmente em áreas como saúde, finanças, jurídico e atendimento ao cliente, onde um erro da IA tem impacto real.',
        question: 'Você sabe o que significa "Human-in-the-Loop" no contexto de IA corporativa?',
        options: [
          { letter: 'A', text: 'Não conheço o termo', points: 1 },
          { letter: 'B', text: 'Já ouvi, mas não sei aplicar', points: 2 },
          { letter: 'C', text: 'Sei que é quando um humano revisa ou aprova a ação da IA antes de ela chegar ao cliente ou sistema', points: 3 },
          { letter: 'D', text: 'Já desenhei ou opero processos com esse modelo de governança', points: 4 },
        ],
        feedback: 'Human-in-the-Loop não é fraqueza — é governança inteligente. A IA sugere, analisa ou gera; o humano valida antes de executar. Em processos críticos, esse modelo reduz drasticamente o risco de erros com impacto real. À medida que a confiança no modelo cresce e os casos de uso se consolidam, o nível de supervisão humana pode ser gradualmente ajustado.',
      },
      {
        id: 5,
        context: 'Modelos de IA não falham só por questões técnicas — falham porque as empresas não constroem ciclos de aprendizado com os erros. Um erro em produção que não gera melhoria é um custo recorrente, não um incidente isolado.',
        question: 'Quando um projeto de IA não dá o resultado esperado na sua empresa, o que costuma acontecer?',
        options: [
          { letter: 'A', text: 'O projeto é cancelado e o tema fica no ar por um tempo', points: 1 },
          { letter: 'B', text: 'Tenta-se uma segunda vez da mesma forma, esperando resultado diferente', points: 2 },
          { letter: 'C', text: 'Fazemos uma análise do que errou e ajustamos a abordagem', points: 3 },
          { letter: 'D', text: 'Temos um processo formal de retrospectiva e feedback loop que alimenta os próximos projetos', points: 4 },
        ],
        feedback: 'O feedback loop — o ciclo de aprender com o que a IA errou — é um dos pilares mais negligenciados em projetos corporativos. Quando um modelo erra em produção, esse erro precisa chegar ao time responsável, ser analisado e gerar uma melhoria. Empresas que tratam cada erro como aprendizado constroem modelos que ficam melhores ao longo do tempo. As que ignoram os erros apenas amplificam o problema.',
      },
    ],
  },
  {
    id: 3,
    name: 'A Corrida',
    emoji: '🪶',
    theme: 'Trends 2026: o mundo já mudou. Sua empresa percebeu?',
    questions: [
      {
        id: 1,
        context: 'Segundo o Google Cloud, 52% dos executivos em organizações maduras já têm agentes de IA em produção orquestrando fluxos complexos. Agentes não respondem perguntas — eles entendem objetivos, fazem planos e executam ações.',
        question: 'Você já ouviu falar em "agentes de IA" ou "agentic AI" no contexto corporativo?',
        options: [
          { letter: 'A', text: 'Nunca ouvi esse termo', points: 1 },
          { letter: 'B', text: 'Já ouvi, mas não sei como se diferencia de um chatbot comum', points: 2 },
          { letter: 'C', text: 'Entendo o conceito — sei que é IA que age de forma autônoma com objetivo definido', points: 3 },
          { letter: 'D', text: 'Já trabalhei com ou estou avaliando implementar agentes de IA na empresa', points: 4 },
        ],
        feedback: 'Diferente de um chatbot que responde perguntas, um agente entende um objetivo, cria um plano e executa ações em múltiplos sistemas — CRM, calendário, e-mail — sem intervenção humana em cada passo. Essa é a maior mudança corporativa de 2026: a transição de IA que responde para IA que executa. 88% dos early adopters já reportam ROI positivo.',
      },
      {
        id: 2,
        context: 'O Google Cloud aponta que a oportunidade de 2026 é fundamentalmente humana: libertar as equipes do trabalho repetitivo para que possam focar no que só humanos fazem — criatividade, empatia e pensamento estratégico.',
        question: 'Como você enxerga o papel do colaborador humano num ambiente onde agentes de IA executam tarefas repetitivas de forma autônoma?',
        options: [
          { letter: 'A', text: 'Ameaça — as pessoas vão perder espaço para as máquinas', points: 1 },
          { letter: 'B', text: 'Incerto — não tenho clareza sobre o que muda no papel humano', points: 2 },
          { letter: 'C', text: 'Oportunidade — o humano foca no estratégico enquanto a IA cuida do operacional', points: 3 },
          { letter: 'D', text: 'Já estamos redesenhando funções e processos com essa lógica na empresa', points: 4 },
        ],
        feedback: 'O novo papel do colaborador não é executor — é orquestrador de inteligência. Ele define o objetivo, supervisiona o processo e toma as decisões que exigem julgamento humano. Empresas que comunicam essa visão com clareza para suas equipes — antes de implementar — colhem muito mais engajamento do que as que apresentam a IA como uma imposição.',
      },
      {
        id: 3,
        context: 'Uma "linha de montagem digital" é um sistema onde múltiplos agentes de IA trabalham em sequência para executar um processo de negócio completo — sem intervenção humana em cada etapa. O protocolo A2A do Google torna isso possível mesmo entre agentes de diferentes fornecedores.',
        question: 'Sua empresa já discutiu como seria estruturada uma "linha de montagem digital" — processos de negócio rodando de ponta a ponta com agentes de IA orquestrados?',
        options: [
          { letter: 'A', text: 'Nunca discutimos isso formalmente', points: 1 },
          { letter: 'B', text: 'O tema apareceu, mas ainda é muito abstrato para avançar', points: 2 },
          { letter: 'C', text: 'Já temos conversas estruturadas sobre automação de processos end-to-end com IA', points: 3 },
          { letter: 'D', text: 'Temos iniciativas concretas de orquestração de agentes em desenvolvimento ou produção', points: 4 },
        ],
        feedback: 'Qualificar leads, gerar propostas e agendar reuniões pode ser um fluxo end-to-end sem intervenção humana em cada passo. O humano define a estratégia e supervisiona os resultados. Esse é o modelo que está redefinindo produtividade nas empresas mais avançadas do mundo neste momento.',
      },
      {
        id: 4,
        context: 'O Google Cloud aponta que o upskilling de talentos será o maior driver de valor de negócio em 2026 — acima da tecnologia em si. Treinar pessoas em "como usar IA para ser 2x mais eficiente no meu trabalho específico" tem muito mais impacto do que treinamentos genéricos.',
        question: 'Sua empresa tem uma estratégia de upskilling — capacitação contínua — focada em IA para os colaboradores?',
        options: [
          { letter: 'A', text: 'Não temos nenhum programa estruturado de capacitação em IA', points: 1 },
          { letter: 'B', text: 'Algumas pessoas se capacitam por conta própria, sem incentivo ou estrutura formal', points: 2 },
          { letter: 'C', text: 'Temos iniciativas pontuais, mas sem uma estratégia contínua e abrangente', points: 3 },
          { letter: 'D', text: 'Temos um programa formal de AI upskilling com trilhas por função e nível de senioridade', points: 4 },
        ],
        feedback: 'Trilhas por função — vendas, atendimento, operações, liderança — têm muito mais adesão do que treinamentos genéricos sobre "o que é IA". A pergunta certa não é "o que é um LLM?" — é "como usar IA para ser mais eficiente no meu trabalho hoje?". Empresas que investem em upskilling estruturado agora estão construindo uma vantagem competitiva que levará anos para os concorrentes replicarem.',
      },
      {
        id: 5,
        context: 'Empresas que experimentam hoje com IA agêntica não estão apenas construindo ferramentas — estão construindo o expertise interno para gerenciar, governar e escalar essa capacidade. A curva de aprendizado é íngreme para quem começa depois.',
        question: 'Olhando para as tendências de IA agêntica que você acabou de conhecer, qual frase melhor descreve onde sua empresa está?',
        options: [
          { letter: 'A', text: 'Ainda assistindo de fora — esse mundo de agentes parece distante da nossa realidade', points: 1 },
          { letter: 'B', text: 'Começando a entender — estamos mapeando como isso se aplica ao nosso contexto', points: 2 },
          { letter: 'C', text: 'Em movimento — já temos iniciativas concretas, mesmo que ainda em fase inicial', points: 3 },
          { letter: 'D', text: 'Na liderança — somos early adopters e já colhemos ROI de iniciativas agênticas', points: 4 },
        ],
        feedback: 'A vantagem competitiva de 2027 está sendo construída agora, em 2026, por quem tem coragem de experimentar antes de ter certeza. Não é sobre ser o maior — é sobre ser o mais rápido em aprender. Cada experimento, mesmo os que não funcionam, constrói o conhecimento interno que vai diferenciar sua empresa no médio prazo.',
      },
    ],
  },
  {
    id: 4,
    name: 'Vietnam',
    emoji: '🌿',
    theme: 'Estratégia e Casos de Uso: IA que resolve problemas reais',
    questions: [
      {
        id: 1,
        context: 'A abordagem McKinsey começa sempre pelo problema, nunca pela ferramenta. Para cada dor, avalie se IA é realmente a melhor solução — ou se um processo redesenhado resolve mais rápido e mais barato.',
        question: 'Como sua empresa identifica quais problemas de negócio são candidatos a uma solução com IA?',
        options: [
          { letter: 'A', text: 'Não temos um processo — as iniciativas surgem de forma reativa ou por pressão externa', points: 1 },
          { letter: 'B', text: 'Discutimos oportunidades, mas sem critério formal de avaliação e priorização', points: 2 },
          { letter: 'C', text: 'Usamos algum critério de impacto e viabilidade, mas ainda de forma informal', points: 3 },
          { letter: 'D', text: 'Temos uma matriz formal de priorização com critérios de impacto, viabilidade e velocidade', points: 4 },
        ],
        feedback: 'O processo ideal tem quatro passos: mapeie as top 5 dores operacionais ou de receita; avalie se IA é a melhor solução para cada uma; defina o KPI de sucesso antes de iniciar; priorize usando a matriz Impacto × Viabilidade × Velocidade. Sem essa disciplina, qualquer ferramenta parece boa na apresentação e nenhuma entrega resultado mensurável em produção.',
      },
      {
        id: 2,
        context: 'Sumarização automática de interações é um dos quick wins de maior ROI em contact centers. Uma IA que transcreve a chamada, gera o resumo e preenche o CRM economiza de 15 a 20 minutos por agente por dia — em uma operação com 100 agentes, isso é mais de 25 horas de produtividade recuperadas diariamente.',
        question: 'Qual dessas situações mais se parece com o que acontece na sua empresa após cada atendimento ao cliente?',
        options: [
          { letter: 'A', text: 'O agente preenche tudo manualmente no sistema — leva de 2 a 5 minutos por atendimento', points: 1 },
          { letter: 'B', text: 'Temos alguma automação, mas o preenchimento ainda é em grande parte manual', points: 2 },
          { letter: 'C', text: 'Parte do processo é automatizado, mas ainda há dependência humana significativa', points: 3 },
          { letter: 'D', text: 'A sumarização e o preenchimento no CRM são automáticos — o agente só valida', points: 4 },
        ],
        feedback: 'O After Call Work manual é um dos maiores desperdícios operacionais em contact centers — e um dos mais fáceis de resolver com IA. Além do ganho de produtividade, a sumarização automática cria um histórico estruturado de interações que alimenta análises de CX, treinamento de novos agentes e melhoria contínua de processos. É um quick win de 30 a 45 dias com ROI mensurável desde o primeiro mês.',
      },
      {
        id: 3,
        context: 'A fragmentação de dados do cliente entre Marketing, Vendas, CS e Produto é uma das dores com maior score em diagnósticos de empresas brasileiras. Decisões críticas são tomadas sem contexto integrado — porque cada área tem seu pedaço da história, mas ninguém tem a visão completa.',
        question: 'Na sua empresa, qual área tem a visão mais completa da jornada do cliente — desde o primeiro contato até o pós-venda?',
        options: [
          { letter: 'A', text: 'Nenhuma — cada área tem seu pedaço e raramente se integram', points: 1 },
          { letter: 'B', text: 'O CRM centraliza alguma coisa, mas está longe de ser a fonte única de verdade', points: 2 },
          { letter: 'C', text: 'Temos iniciativas de integração de dados, mas ainda há gaps importantes', points: 3 },
          { letter: 'D', text: 'Existe uma visão unificada do cliente acessível em tempo real para todas as áreas relevantes', points: 4 },
        ],
        feedback: 'A solução começa com um CRM tratado como fonte única de verdade — não como repositório de vendas. Com IA nativa, ele vira motor de inteligência do cliente: prevê churn, identifica oportunidades de upsell, detecta padrões de insatisfação antes que impactem o NPS. Mas tudo isso depende de dados unificados. Integrar as fontes é a fundação; a IA é o que transforma essa fundação em vantagem competitiva.',
      },
      {
        id: 4,
        context: 'ROI documentado e comunicado para o board é um dos sinais mais claros de que uma empresa avançou do Nível 1 para o Nível 2 de maturidade em IA. Sem isso, os projetos ficam vulneráveis ao próximo corte de budget.',
        question: 'Sua empresa sabe calcular e comunicar o ROI das iniciativas de IA para a liderança executiva?',
        options: [
          { letter: 'A', text: 'Não — os projetos existem, mas o ROI nunca foi calculado formalmente', points: 1 },
          { letter: 'B', text: 'Tentamos, mas sem metodologia clara — os números variam dependendo de quem calcula', points: 2 },
          { letter: 'C', text: 'Temos algumas métricas, mas ainda falta consistência na comunicação para o board', points: 3 },
          { letter: 'D', text: 'Temos uma metodologia de ROI documentada e comunicamos resultados regularmente à liderança', points: 4 },
        ],
        feedback: 'O modelo é simples: defina o KPI antes de começar, meça durante, comunique após. Exemplos reais de KPIs mensuráveis: redução de X% no tempo médio de atendimento, deflexão de Y% de tickets simples, N horas recuperadas por semana, aumento de Z% na taxa de resolução no primeiro contato. Números concretos mantêm o budget vivo — e criam o ciclo virtuoso de mais investimento gerando mais resultado.',
      },
      {
        id: 5,
        context: '"Sem dono, o projeto para." Iniciativas de IA que dependem de um entusiasta individual são as primeiras a parar quando essa pessoa muda de área ou sai da empresa. Institucionalizar é o que transforma um projeto em uma capacidade permanente.',
        question: 'O que acontece com as iniciativas de IA da sua empresa quando o principal defensor interno muda de área ou sai da empresa?',
        options: [
          { letter: 'A', text: 'O projeto para ou perde força rapidamente — depende demais de uma pessoa', points: 1 },
          { letter: 'B', text: 'Fica em modo de manutenção — ninguém toca, mas ninguém encerra formalmente', points: 2 },
          { letter: 'C', text: 'Existe alguma continuidade, mas sem o mesmo ritmo e prioridade', points: 3 },
          { letter: 'D', text: 'A iniciativa sobrevive porque está institucionalizada — tem dono formal, processo e budget', points: 4 },
        ],
        feedback: 'Institucionalização é o que separa projetos de IA de capacidades de IA. Um projeto depende de uma pessoa. Uma capacidade tem dono formal com autoridade, budget garantido, processo documentado e métricas acompanhadas pela liderança. Esse é o salto do Nível 1 para o Nível 2 de maturidade — e é onde a maioria das empresas brasileiras ainda está travada.',
      },
    ],
  },
  {
    id: 5,
    name: 'Bubba Gump',
    emoji: '🚢',
    theme: 'Implementação e Escala: do piloto à produção real',
    questions: [
      {
        id: 1,
        context: 'Sem um responsável formal pelos dados que alimentam um modelo de IA, os projetos são alimentados com dados inconsistentes, desatualizados ou fragmentados — e os modelos entregam resultados que refletem exatamente essa qualidade.',
        question: 'Sua empresa tem um responsável formal pelos dados que alimentam cada modelo de IA em produção — um "Data Owner"?',
        options: [
          { letter: 'A', text: 'Não — os dados são de todos, o que na prática significa que não são de ninguém', points: 1 },
          { letter: 'B', text: 'Informalmente sim, mas sem autoridade ou processo formal de qualidade', points: 2 },
          { letter: 'C', text: 'Estamos definindo Data Owners por domínio, mas o processo ainda está sendo implementado', points: 3 },
          { letter: 'D', text: 'Temos Data Owners formais por domínio com responsabilidades e métricas de qualidade definidas', points: 4 },
        ],
        feedback: 'Data Owner é um dos papéis mais negligenciados em estratégias de IA. Sem alguém formalmente responsável pela qualidade dos dados de um domínio — clientes, produtos, operação — os modelos são alimentados com dados inconsistentes. A boa notícia: não precisa de um Data Lake perfeito para começar. O MVDS permite iniciar com os dados estritamente necessários para o caso de uso prioritário e expandir com qualidade.',
      },
      {
        id: 2,
        context: 'Um chatbot que custa R$500/mês em piloto pode custar R$50.000/mês com volume real de usuários. O custo oculto de tokens em produção é uma das surpresas mais desagradáveis para empresas que escalam IA sem planejamento financeiro adequado.',
        question: 'Sua empresa já calculou o custo real de operar modelos de IA em escala — incluindo tokens, infraestrutura, manutenção e atualização contínua?',
        options: [
          { letter: 'A', text: 'Não — o custo de IA ainda é visto como investimento pontual, sem projeção de escala', points: 1 },
          { letter: 'B', text: 'Temos uma estimativa superficial, mas sem granularidade suficiente', points: 2 },
          { letter: 'C', text: 'Já fizemos um cálculo mais detalhado, mas com gaps em alguns componentes', points: 3 },
          { letter: 'D', text: 'Temos um modelo de custo total de propriedade (TCO) documentado e revisado periodicamente', points: 4 },
        ],
        feedback: 'Antes de escalar, calcule o custo por interação, projete o volume real e valide se o ROI ainda sustenta o investimento nessa escala. O custo de tokens cresce de forma não linear com o volume — e muitas empresas descobrem isso depois de aprovar o orçamento de expansão. Um TCO documentado transforma surpresas desagradáveis em decisões planejadas.',
      },
      {
        id: 3,
        context: 'Para cada modelo em produção, um Model Owner tem responsabilidade documentada: quem treinou, com quais dados, performance esperada, como monitorar e o que fazer quando algo der errado. Sem isso, um modelo degradado pode ficar meses em produção sem que ninguém perceba.',
        question: 'Quando um modelo de IA em produção começa a entregar resultados abaixo do esperado, quem na sua empresa é responsável por identificar, investigar e corrigir o problema?',
        options: [
          { letter: 'A', text: 'Ninguém formalmente — cada um aponta para o outro', points: 1 },
          { letter: 'B', text: 'TI cuida da parte técnica, mas o processo de negócio fica sem dono claro', points: 2 },
          { letter: 'C', text: 'Existe alguma definição, mas o processo de resposta ainda é lento e reativo', points: 3 },
          { letter: 'D', text: 'Temos um Model Owner por iniciativa com processo de resposta a incidentes documentado', points: 4 },
        ],
        feedback: 'Model Owner é um conceito simples e poderoso. Sem ele, um modelo degradado pode ficar meses em produção entregando resultado ruim — e quando alguém percebe, já é tarde para recuperar a confiança das equipes. O Model Card documenta tudo: quem é o responsável, quais dados foram usados, qual a performance esperada, como monitorar e qual o processo de escalação quando algo falha.',
      },
      {
        id: 4,
        context: 'Um modelo com 95% de precisão que ninguém usa entrega zero ROI. A taxa de adoção deve ser tratada como métrica de sucesso do projeto — não como consequência natural da implementação.',
        question: 'Como sua empresa mede se as ferramentas de IA que foram implementadas estão sendo realmente usadas pelas equipes no dia a dia?',
        options: [
          { letter: 'A', text: 'Não medimos — assumimos que se foi implementado, está sendo usado', points: 1 },
          { letter: 'B', text: 'Sabemos que há resistência, mas não temos métricas formais de adoção', points: 2 },
          { letter: 'C', text: 'Acompanhamos uso de forma informal, mas sem KPIs de adoção definidos', points: 3 },
          { letter: 'D', text: 'Adoção é KPI do projeto — medimos ativamente e agimos quando está abaixo da meta', points: 4 },
        ],
        feedback: 'Adoção é o KPI mais negligenciado em projetos de IA. O processo para garantir adoção real: comunique antes do lançamento, treine com foco em ganho prático por função, identifique champions internos que influenciam os colegas, e acompanhe ativamente nas primeiras semanas. O que não é medido não é gerenciado — e o que não é gerenciado não escala.',
      },
      {
        id: 5,
        context: 'Empresas no Nível 3 de maturidade em IA têm algo em comum: IA deixou de ser projeto de TI e virou capacidade estratégica de negócio. O CEO fala sobre IA nas reuniões de resultado. O cliente percebe a diferença na experiência.',
        question: 'Olhando para onde sua empresa quer chegar com IA nos próximos 12 meses, qual frase melhor descreve a ambição?',
        options: [
          { letter: 'A', text: 'Sobreviver — queremos pelo menos não ficar para trás da concorrência', points: 1 },
          { letter: 'B', text: 'Experimentar — queremos ter alguns casos de uso rodando e aprender com eles', points: 2 },
          { letter: 'C', text: 'Operar — queremos IA integrada aos processos principais com ROI mensurável', points: 3 },
          { letter: 'D', text: 'Liderar — queremos que IA seja um diferencial competitivo percebido pelo cliente e pelo mercado', points: 4 },
        ],
        feedback: 'Chegar ao Nível 3 não é questão de tecnologia — é questão de visão, consistência e vontade de construir as bases certas ao longo do caminho. O roteiro é claro: comece pelo problema de negócio, construa as bases de dados, envolva as pessoas desde o início, documente os processos antes de automatizá-los e estabeleça governança desde o primeiro modelo em produção.',
      },
    ],
  },
]
