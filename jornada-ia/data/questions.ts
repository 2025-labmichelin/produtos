export interface Option {
  letter: 'A' | 'B' | 'C' | 'D'
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
]
