import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { getPhase } from '@/data/questions'
import { getMaturityProfile, MAX_POINTS_PER_PHASE, MAX_POINTS_SURPRISE } from '@/lib/scoring'
import Link from 'next/link'

// ── Conteúdo dos perfis ──────────────────────────────────────────────────────

const PROFILE_DESCRIPTIONS: Record<string, string> = {
  pena: 'Você está nos primeiros passos. A IA parece distante ou abstrata — e isso é completamente normal. O diferencial de quem evolui rápido é começar pelo problema, não pela ferramenta. Identifique um processo repetitivo na sua área e pergunte: tenho dados para automatizar isso?',
  correndo: 'Você já entendeu que IA não é só hype. Tem consciência dos casos de uso, mas ainda falta um framework para decidir onde investir energia. Mapeie os processos da sua empresa por volume × repetição × dados disponíveis — é aí que a oportunidade real se esconde.',
  corrida: 'Você pensa estrategicamente. Já conecta tecnologia com negócio e entende os trade-offs. O próximo nível exige rigor em dados e governança. Audite a qualidade dos dados do seu principal caso de uso — esse costuma ser o gargalo invisível.',
  caixa: 'Você sabe o que vai na caixa — e escolhe com critério. Tem visão estratégica, entende os trade-offs e consegue guiar equipes. Sua próxima missão: construir um business case sólido para o board e criar um loop de aprendizado contínuo com os projetos em andamento.',
}

const PROFILE_INSIGHTS: Record<string, string> = {
  pena: '"70% dos projetos de IA falham por falta de problema bem definido — não por falta de tecnologia." Comece pelo problema. A ferramenta vem depois.',
  correndo: '"Empresas que escalam IA definem o critério de sucesso antes de começar." O que seria sucesso mensurável para o seu contexto?',
  corrida: '"Dados são o combustível da IA — e a maioria usa combustível adulterado." Antes de escalar: valide seus dados.',
  caixa: '"A vantagem competitiva real não está no modelo que você usa, mas em quão rápido você aprende e itera." Você está iterando ou só pilotando?',
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function barPosition(pts: number) {
  // Escala 5–20 pts → 0–100%
  return `${Math.min(100, Math.max(0, ((pts - 5) / 15) * 100))}%`
}

export default async function ResultadoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const phaseId = parseInt(id)
  const phase = getPhase(phaseId)
  if (!phase) redirect('/hub')

  // ── 1. Somar respostas da fase ───────────────────────────────────────────
  const { data: answers } = await supabase
    .from('question_answers')
    .select('question_id, option_letter, points_earned')
    .eq('user_id', user.id)
    .eq('phase_id', phaseId)
    .order('question_id')

  const answeredCount = answers?.length ?? 0
  const totalPhasePoints = answers?.reduce((s, a) => s + a.points_earned, 0) ?? 0
  const maxPoints = phase.isSurprise ? MAX_POINTS_SURPRISE : MAX_POINTS_PER_PHASE

  // Se não respondeu nenhuma pergunta, redireciona para o início da fase
  if (answeredCount === 0) redirect(`/fase/${phaseId}`)

  // ── 2. Perfil de maturidade (fase 1) ────────────────────────────────────
  const maturityProfile = phaseId === 1 ? getMaturityProfile(totalPhasePoints) : null

  // ── 3. Upsert em phase_completions (com maturity_profile) ───────────────
  await supabase.from('phase_completions').upsert(
    {
      user_id: user.id,
      phase_id: phaseId,
      total_points: totalPhasePoints,
      ...(phaseId === 1 && maturityProfile ? { maturity_profile: maturityProfile.id } : {}),
    },
    { onConflict: 'user_id,phase_id' }
  )

  // ── 4. Pontuação total acumulada do usuário ──────────────────────────────
  const { data: allCompletions } = await supabase
    .from('phase_completions')
    .select('total_points')
    .eq('user_id', user.id)

  const totalAccumulated = allCompletions?.reduce((s, c) => s + c.total_points, 0) ?? 0

  // ── 5. Ranking geral ─────────────────────────────────────────────────────
  const { data: rankingRows } = await supabase
    .from('phase_completions')
    .select('user_id, total_points')

  const sumByUser: Record<string, number> = {}
  for (const r of rankingRows ?? []) {
    sumByUser[r.user_id] = (sumByUser[r.user_id] ?? 0) + r.total_points
  }
  const sortedTotals = Object.values(sumByUser).sort((a, b) => b - a)
  const rankingPos = sortedTotals.findIndex(t => t <= totalAccumulated) + 1
  const totalParticipants = sortedTotals.length

  // ── 6. Próxima fase ──────────────────────────────────────────────────────
  const nextPhaseId = phaseId < 7 ? phaseId + 1 : null
  const nextPhase = nextPhaseId ? getPhase(nextPhaseId) : null

  // ── UI ───────────────────────────────────────────────────────────────────
  const barPos = maturityProfile ? barPosition(totalPhasePoints) : '0%'

  return (
    <div style={{ minHeight: '100vh', background: '#F5EDD8', display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(245,237,216,0.96)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(212,168,83,0.2)',
        height: 60, padding: '0 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="22" viewBox="0 0 48 64" fill="none">
            <path d="M24 62C24 62 8 44 6 28C4 12 16 2 24 2C32 2 44 12 42 28C40 44 24 62 24 62Z"
              fill="white" stroke="#D4A853" strokeWidth="2"/>
            <path d="M24 62L24 8" stroke="#8B6914" strokeWidth="1.2" strokeDasharray="3 2"/>
          </svg>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, color: '#3A3228' }}>
            Jornada <span style={{ color: '#D4A853' }}>IA</span>
          </span>
        </div>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: '#A89070', letterSpacing: '0.1em' }}>
          RESULTADO
        </span>
      </header>

      {/* ── Banner escuro ── */}
      <div style={{ background: '#3A3228', padding: '40px 40px 44px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>

          {/* Fase concluída badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: '#D4A853', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: '#D4A853' }}>
              {phase.isSurprise ? 'BÔNUS' : `FASE ${phaseId}`} CONCLUÍDA
            </span>
          </div>

          {/* Nome da fase */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
            <span style={{ fontSize: 40, lineHeight: 1 }}>{phase.emoji}</span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: '#F5EDD8', margin: 0, lineHeight: 1.15 }}>
              {phase.name}
            </h1>
          </div>

          {/* Pontuação grande */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 72, fontWeight: 800, color: '#F5EDD8', lineHeight: 1 }}>
              {totalPhasePoints}
            </span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 22, color: 'rgba(245,237,216,0.45)', paddingBottom: 10 }}>
              / {maxPoints} pts
            </span>
          </div>
        </div>
      </div>

      {/* ── Conteúdo ── */}
      <div style={{ flex: 1, padding: '40px 40px 80px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: 680, width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* ── Card de perfil de maturidade (fase 1) ── */}
          {maturityProfile && (
            <div style={{
              background: '#fff',
              border: '1.5px solid #C8B88A',
              borderRadius: 8,
              boxShadow: '4px 4px 0px #C8B88A',
              overflow: 'hidden',
              animation: 'fadeUp 0.5s ease both',
            }}>
              {/* Top gradient */}
              <div style={{ height: 4, background: 'linear-gradient(90deg, #D4A853, #8B6914, #3A3228)' }} />

              <div style={{ padding: '28px 32px 32px' }}>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: '#8B6914', marginBottom: 24 }}>
                  SEU PERFIL DE MATURIDADE EM IA
                </div>

                {/* Ícone animado + nome */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
                  <div style={{ fontSize: 56, lineHeight: 1, animation: 'popIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both', animationDelay: '0.15s' }}>
                    {maturityProfile.emoji}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: '#D4A853', lineHeight: 1.2, marginBottom: 8 }}>
                      {maturityProfile.label}
                    </div>
                    <div style={{ display: 'inline-block', background: '#3A3228', borderRadius: 3, padding: '3px 10px', fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#D4A853' }}>
                      {maturityProfile.level.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Descrição */}
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#5C4D3C', lineHeight: 1.7, margin: '0 0 28px' }}>
                  {PROFILE_DESCRIPTIONS[maturityProfile.id]}
                </p>

                {/* ── Barra de maturidade animada ── */}
                <div>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: '#8B7355', letterSpacing: '0.12em', marginBottom: 14 }}>
                    POSIÇÃO NA ESCALA
                  </div>

                  {/* Trilho + marcador */}
                  <div style={{ position: 'relative', marginBottom: 10 }}>
                    {/* Trilho de fundo */}
                    <div style={{ height: 8, background: '#EEE5D3', borderRadius: 4, overflow: 'visible', position: 'relative' }}>
                      {/* Barra preenchida animada */}
                      <div style={{
                        position: 'absolute', left: 0, top: 0, bottom: 0,
                        width: barPos,
                        background: 'linear-gradient(90deg, #D4A853, #8B6914)',
                        borderRadius: 4,
                        animation: 'barGrow 1.2s cubic-bezier(0.4,0,0.2,1) both',
                        animationDelay: '0.4s',
                        ['--bar-target' as string]: barPos,
                      }} />
                    </div>

                    {/* Marcador da posição atual */}
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: barPos,
                      transform: 'translate(-50%, -50%)',
                      width: 18, height: 18, borderRadius: '50%',
                      background: '#8B6914',
                      border: '3px solid #fff',
                      boxShadow: '0 0 0 2px #8B6914',
                      animation: 'markerSlide 1.2s cubic-bezier(0.4,0,0.2,1) both',
                      animationDelay: '0.4s',
                      ['--marker-pos' as string]: barPos,
                    }} />
                  </div>

                  {/* Labels da escala */}
                  <div style={{ position: 'relative', height: 32 }}>
                    {[
                      { emoji: '🪶', pts: 5,  left: '0%',      anchor: 'left' as const },
                      { emoji: '👟', pts: 9,  left: '26.67%',  anchor: 'center' as const },
                      { emoji: '🏃', pts: 13, left: '53.33%',  anchor: 'center' as const },
                      { emoji: '🍫', pts: 17, left: '80%',     anchor: 'center' as const },
                    ].map(({ emoji, pts, left, anchor }) => (
                      <div
                        key={pts}
                        style={{
                          position: 'absolute',
                          left,
                          top: 0,
                          transform: anchor === 'center' ? 'translateX(-50%)' : undefined,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: anchor === 'center' ? 'center' : 'flex-start',
                          gap: 2,
                        }}
                      >
                        <span style={{ fontSize: 14, lineHeight: 1 }}>{emoji}</span>
                        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 9, color: '#A89070', letterSpacing: '0.06em' }}>
                          {pts}pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── 3 Stats ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, animation: 'fadeUp 0.5s ease both', animationDelay: maturityProfile ? '0.1s' : '0s' }}>
            {[
              {
                label: 'PONTOS DA FASE',
                value: `${totalPhasePoints}`,
                sub: `de ${maxPoints} possíveis`,
              },
              {
                label: 'PERGUNTAS',
                value: `${answeredCount}/5`,
                sub: 'respondidas',
              },
              {
                label: 'RANKING GERAL',
                value: `#${rankingPos}`,
                sub: `entre ${totalParticipants} participante${totalParticipants !== 1 ? 's' : ''}`,
              },
            ].map((stat, i) => (
              <div key={i} style={{
                background: '#fff',
                border: '1.5px solid #C8B88A',
                borderRadius: 6,
                boxShadow: '3px 3px 0px #C8B88A',
                padding: '18px 20px',
              }}>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', color: '#8B7355', marginBottom: 8 }}>
                  {stat.label}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: '#3A3228', lineHeight: 1, marginBottom: 4 }}>
                  {stat.value}
                </div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: '#A89070' }}>
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>

          {/* ── Insight personalizado (fase 1) ── */}
          {maturityProfile && (
            <div style={{
              background: '#FFFDF6',
              borderLeft: '4px solid #D4A853',
              border: '1.5px solid rgba(212,168,83,0.4)',
              borderRadius: '0 6px 6px 0',
              padding: '18px 22px',
              animation: 'fadeUp 0.5s ease both',
              animationDelay: '0.2s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1C3.69 1 1 3.69 1 7s2.69 6 6 6 6-2.69 6-6S10.31 1 7 1zm.75 9H6.25V6.25h1.5V10zm0-5H6.25V3.5h1.5V5z" fill="#8B6914"/>
                </svg>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: '#8B6914' }}>
                  INSIGHT PARA VOCÊ
                </span>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 14, color: '#5C4D3C', lineHeight: 1.7, margin: 0 }}>
                {PROFILE_INSIGHTS[maturityProfile.id]}
              </p>
            </div>
          )}

          {/* ── Preview da próxima fase ── */}
          {nextPhase ? (
            <div style={{
              background: '#fff',
              border: '1.5px solid #C8B88A',
              borderRadius: 8,
              boxShadow: '3px 3px 0px #C8B88A',
              padding: '24px 28px',
              animation: 'fadeUp 0.5s ease both',
              animationDelay: '0.25s',
            }}>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: '#8B6914', marginBottom: 14 }}>
                PRÓXIMA FASE DESBLOQUEADA
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ fontSize: 36, lineHeight: 1, flexShrink: 0 }}>{nextPhase.emoji}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: '#3A3228', marginBottom: 4 }}>
                    {nextPhase.name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 13, color: '#8B7355', lineHeight: 1.5 }}>
                    {nextPhase.theme}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              background: '#3A3228', borderRadius: 8,
              padding: '28px 32px', textAlign: 'center',
              animation: 'fadeUp 0.5s ease both', animationDelay: '0.25s',
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: '#D4A853', marginBottom: 8 }}>
                Jornada completa!
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(245,237,216,0.75)', margin: 0 }}>
                Você concluiu todas as 7 fases. Parabéns — agora você sabe o que vai na caixa.
              </p>
            </div>
          )}

          {/* ── Botões de ação ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, animation: 'fadeUp 0.5s ease both', animationDelay: '0.3s' }}>

            {/* Botão primário — Estilo A */}
            {nextPhase && nextPhaseId && (
              <Link
                href={`/fase/${nextPhaseId}`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '13px 26px',
                  background: '#3A3228', color: '#F5EDD8',
                  textDecoration: 'none',
                  borderRadius: 4,
                  border: 'none',
                  outline: '3px solid #3A3228',
                  outlineOffset: '3px',
                  fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 700,
                  letterSpacing: '0.07em',
                  transition: 'background 0.15s ease, outline-offset 0.12s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = '#5C4D3C';
                  (e.currentTarget as HTMLAnchorElement).style.outlineOffset = '5px'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = '#3A3228';
                  (e.currentTarget as HTMLAnchorElement).style.outlineOffset = '3px'
                }}
              >
                Avançar para {nextPhase.name} →
              </Link>
            )}

            {/* Botão secundário */}
            <Link
              href="/hub"
              style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '13px 22px',
                background: 'transparent',
                color: '#5C4D3C',
                textDecoration: 'none',
                borderRadius: 4,
                border: '1.5px solid #C8B88A',
                fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600,
                letterSpacing: '0.06em',
                transition: 'border-color 0.15s ease, color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = '#8B6914';
                (e.currentTarget as HTMLAnchorElement).style.color = '#3A3228'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = '#C8B88A';
                (e.currentTarget as HTMLAnchorElement).style.color = '#5C4D3C'
              }}
            >
              Voltar ao hub
            </Link>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0%   { transform: scale(0.2); opacity: 0; }
          60%  { transform: scale(1.25); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes barGrow {
          from { width: 0; }
          to   { width: var(--bar-target, 0%); }
        }
        @keyframes markerSlide {
          from { left: 0; }
          to   { left: var(--marker-pos, 0%); }
        }
      `}</style>
    </div>
  )
}
