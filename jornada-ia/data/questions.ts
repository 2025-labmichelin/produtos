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
]
