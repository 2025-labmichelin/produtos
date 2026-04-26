import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { getPhase } from '@/data/questions'
import { getMaturityProfile, MAX_POINTS_PER_PHASE, MAX_POINTS_SURPRISE } from '@/lib/scoring'
import Link from 'next/link'

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const phaseId = parseInt(id)
  const phase = getPhase(phaseId)
  if (!phase) redirect('/hub')

  // Buscar conclusão desta fase
  const { data: completion } = await supabase
    .from('phase_completions')
    .select('total_points, completed_at')
    .eq('user_id', user.id)
    .eq('phase_id', phaseId)
    .single()

  if (!completion) redirect(`/fase/${phaseId}`)

  const phasePoints = completion.total_points
  const maxPoints = phase.isSurprise ? MAX_POINTS_SURPRISE : MAX_POINTS_PER_PHASE
  const pct = Math.round((phasePoints / maxPoints) * 100)

  // Perfil de maturidade (apenas fase 1)
  const maturityProfile = phaseId === 1 ? getMaturityProfile(phasePoints) : null

  // Pontuação total acumulada
  const { data: allCompletions } = await supabase
    .from('phase_completions')
    .select('total_points')
    .eq('user_id', user.id)

  const totalPoints = allCompletions?.reduce((sum, c) => sum + c.total_points, 0) ?? 0

  // Ranking anônimo: posição do usuário
  const { data: rankingData } = await supabase
    .from('phase_completions')
    .select('user_id, total_points')

  const userTotalByUser: Record<string, number> = {}
  for (const row of rankingData ?? []) {
    userTotalByUser[row.user_id] = (userTotalByUser[row.user_id] ?? 0) + row.total_points
  }
  const allTotals = Object.values(userTotalByUser).sort((a, b) => b - a)
  const rankingPos = allTotals.findIndex(t => t <= totalPoints) + 1

  // Próxima fase
  const nextPhaseId = phaseId < 7 ? phaseId + 1 : null
  const nextPhase = nextPhaseId ? getPhase(nextPhaseId) : null

  // Respostas desta fase para review
  const { data: answers } = await supabase
    .from('question_answers')
    .select('question_id, option_letter, points_earned')
    .eq('user_id', user.id)
    .eq('phase_id', phaseId)
    .order('question_id')

  const getScoreLabel = (pct: number) => {
    if (pct >= 90) return { label: 'Excelente', color: '#2D7A4F' }
    if (pct >= 70) return { label: 'Muito bom', color: '#4A6B8A' }
    if (pct >= 50) return { label: 'Em desenvolvimento', color: '#8B6914' }
    return { label: 'Ponto de partida', color: '#8B6355' }
  }
  const scoreLabel = getScoreLabel(pct)

  return (
    <div style={{ minHeight: '100vh', background: '#F5EDD8', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(245,237,216,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(212,168,83,0.2)', padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/hub" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#8B6914', fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="#8B6914" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          HUB CENTRAL
        </Link>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: '#A89070', letterSpacing: '0.08em' }}>JORNADA IA</span>
      </header>

      <div style={{ flex: 1, padding: '48px 40px 80px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: 700, width: '100%' }}>

          {/* Badge fase concluída */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#D4A853', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10l4 4 8-8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: '#8B6914' }}>
                {phase.isSurprise ? 'BÔNUS SURPRESA' : `FASE ${phaseId}`} CONCLUÍDA
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: '#3A3228' }}>
                {phase.name}
              </div>
            </div>
          </div>

          {/* Score card principal */}
          <div style={{ background: '#fff', border: '1.5px solid #D4A853', borderRadius: 8, boxShadow: '4px 4px 0px #8B6914', padding: '32px', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: '#8B7355', letterSpacing: '0.1em', marginBottom: 4 }}>PONTUAÇÃO DESTA FASE</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 56, fontWeight: 800, color: '#3A3228', lineHeight: 1 }}>{phasePoints}</span>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: 18, color: '#A89070' }}>/ {maxPoints} pts</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: scoreLabel.color }}>
                  {pct}%
                </div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: scoreLabel.color, letterSpacing: '0.08em', fontWeight: 600 }}>
                  {scoreLabel.label}
                </div>
              </div>
            </div>

            {/* Barra de progresso */}
            <div style={{ background: '#F5EDD8', borderRadius: 4, height: 10, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #D4A853, #8B6914)', borderRadius: 4, transition: 'width 1s ease' }} />
            </div>

            {/* Respostas rápidas */}
            {answers && answers.length > 0 && (
              <div style={{ marginTop: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {answers.map(a => (
                  <div key={a.question_id} style={{ background: '#FFF9F0', border: '1.5px solid #D4A853', borderRadius: 4, padding: '4px 10px', fontFamily: 'var(--font-ui)', fontSize: 12, color: '#8B6914' }}>
                    Q{a.question_id}: {a.option_letter} · +{a.points_earned}pts
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Perfil de maturidade (apenas fase 1) */}
          {maturityProfile && (
            <div style={{ background: '#fff', border: '1.5px solid #C8B88A', borderRadius: 8, boxShadow: '3px 3px 0px #C8B88A', padding: '28px 32px', marginBottom: 24 }}>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: '#8B6914', marginBottom: 16 }}>
                SEU PERFIL DE MATURIDADE EM IA
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ fontSize: 48 }}>{maturityProfile.emoji}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: '#3A3228', marginBottom: 4 }}>
                    {maturityProfile.label}
                  </div>
                  <div style={{ background: '#D4A853', borderRadius: 3, padding: '3px 10px', display: 'inline-block', fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '0.1em' }}>
                    {maturityProfile.level.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Escala de perfis */}
              <div style={{ display: 'flex', gap: 4 }}>
                {[
                  { id: 'pena', label: '🪶 Iniciante' },
                  { id: 'correndo', label: '👟 Explorador' },
                  { id: 'corrida', label: '🏃 Estrategista' },
                  { id: 'caixa', label: '🍫 Avançado' },
                ].map(p => (
                  <div key={p.id} style={{ flex: 1, background: p.id === maturityProfile.id ? '#D4A853' : '#F5EDD8', border: `1.5px solid ${p.id === maturityProfile.id ? '#8B6914' : '#C8B88A'}`, borderRadius: 4, padding: '8px 4px', textAlign: 'center', fontFamily: 'var(--font-ui)', fontSize: 10, color: p.id === maturityProfile.id ? '#fff' : '#8B7355', fontWeight: p.id === maturityProfile.id ? 700 : 400 }}>
                    {p.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats totais */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
            <div style={{ background: '#fff', border: '1.5px solid #C8B88A', borderRadius: 6, boxShadow: '2px 2px 0px #C8B88A', padding: '20px 24px' }}>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: '#8B7355', letterSpacing: '0.12em', marginBottom: 6 }}>PONTUAÇÃO TOTAL</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: '#3A3228' }}>{totalPoints}</div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: '#A89070' }}>de 145 pts possíveis</div>
            </div>
            <div style={{ background: '#fff', border: '1.5px solid #C8B88A', borderRadius: 6, boxShadow: '2px 2px 0px #C8B88A', padding: '20px 24px' }}>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: '#8B7355', letterSpacing: '0.12em', marginBottom: 6 }}>RANKING</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: '#3A3228' }}>#{rankingPos}</div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: '#A89070' }}>entre {allTotals.length} participante{allTotals.length !== 1 ? 's' : ''}</div>
            </div>
          </div>

          {/* CTA próxima fase */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {nextPhase ? (
              <Link
                href={`/fase/${nextPhaseId}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '14px 28px',
                  background: '#D4A853',
                  border: '2px solid #8B6914',
                  borderRadius: 6,
                  boxShadow: '3px 3px 0px #8B6914',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-ui)',
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: '#fff',
                }}
              >
                {nextPhase.emoji} PRÓXIMA: {nextPhase.name}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4l4 4-4 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            ) : (
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: '#3A3228' }}>
                🎉 Parabéns! Você completou a Jornada IA!
              </div>
            )}
            <Link
              href="/hub"
              style={{
                padding: '14px 24px',
                background: 'transparent',
                border: '1.5px solid #C8B88A',
                borderRadius: 6,
                textDecoration: 'none',
                fontFamily: 'var(--font-ui)',
                fontSize: 13,
                color: '#8B7355',
                letterSpacing: '0.06em',
              }}
            >
              Ver Hub
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
