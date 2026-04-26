import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { getMaturityProfile } from '@/lib/scoring'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const ownerEmail = process.env.NEXT_PUBLIC_OWNER_EMAIL
  if (user.email !== ownerEmail) redirect('/hub')

  const admin = createAdminClient()

  type Completion = { user_id: string; phase_id: number; total_points: number; completed_at: string }
  type Answer = { user_id: string; phase_id: number; question_id: number; option_letter: string; points_earned: number; answered_at: string }

  // Todos os usuários
  const { data: { users: allUsers } } = await admin.auth.admin.listUsers()
  const totalUsers = allUsers?.length ?? 0

  // Todas as completions
  const { data: completions } = await admin
    .from('phase_completions')
    .select('user_id, phase_id, total_points, completed_at') as { data: Completion[] | null }

  // Todas as respostas
  const { data: answers } = await admin
    .from('question_answers')
    .select('user_id, phase_id, question_id, option_letter, points_earned, answered_at') as { data: Answer[] | null }

  const totalCompletions = completions?.length ?? 0

  // Usuários que completaram fase 1
  const phase1Completions = completions?.filter((c: Completion) => c.phase_id === 1) ?? []
  const usersStarted = new Set(answers?.map((a: Answer) => a.user_id) ?? []).size

  // Distribuição de perfis de maturidade
  const profileDist = { pena: 0, correndo: 0, corrida: 0, caixa: 0 }
  for (const c of phase1Completions) {
    const profile = getMaturityProfile(c.total_points)
    profileDist[profile.id]++
  }

  // Média de pontos por fase
  const avgByPhase: Record<number, { sum: number; count: number }> = {}
  for (const c of completions ?? []) {
    if (!avgByPhase[c.phase_id]) avgByPhase[c.phase_id] = { sum: 0, count: 0 }
    avgByPhase[c.phase_id].sum += c.total_points
    avgByPhase[c.phase_id].count++
  }

  // Opção mais escolhida por pergunta (fase 1)
  const optionCount: Record<string, Record<string, number>> = {}
  for (const a of answers?.filter((a: Answer) => a.phase_id === 1) ?? []) {
    const key = `${a.phase_id}-${a.question_id}`
    if (!optionCount[key]) optionCount[key] = {}
    optionCount[key][a.option_letter] = (optionCount[key][a.option_letter] ?? 0) + 1
  }

  // Drop-off: quantos usuários pararam em cada fase
  const reachedPhase: Record<number, Set<string>> = {}
  for (const a of answers ?? []) {
    if (!reachedPhase[a.phase_id]) reachedPhase[a.phase_id] = new Set()
    reachedPhase[a.phase_id].add(a.user_id)
  }

  const phaseNames: Record<number, string> = {
    1: '🪑 O Banco do Parque', 2: '🏃 Alabama', 3: '🪶 A Corrida',
    4: '🌿 Vietnam', 5: '🚢 Bubba Gump', 6: '👨‍✈️ Tenente Dan', 7: '🍫 A Caixa',
  }

  const profiles = [
    { id: 'pena', emoji: '🪶', label: 'Pena ao Vento', count: profileDist.pena },
    { id: 'correndo', emoji: '👟', label: 'Começando a Correr', count: profileDist.correndo },
    { id: 'corrida', emoji: '🏃', label: 'Na Corrida', count: profileDist.corrida },
    { id: 'caixa', emoji: '🍫', label: 'Sabe o que vai na Caixa', count: profileDist.caixa },
  ]
  const maxProfileCount = Math.max(...profiles.map(p => p.count), 1)

  return (
    <div style={{ minHeight: '100vh', background: '#F5EDD8' }}>

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(245,237,216,0.97)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(212,168,83,0.25)', padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/hub" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: '#8B6914', fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="#8B6914" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            HUB
          </Link>
          <div style={{ width: 1, height: 20, background: '#D4A853', opacity: 0.4 }} />
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', color: '#3A3228' }}>DASHBOARD KPI</span>
        </div>
        <div style={{ background: '#D4A853', borderRadius: 4, padding: '4px 12px', fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '0.1em' }}>
          ACESSO RESTRITO
        </div>
      </header>

      <div style={{ padding: '40px 48px 80px', maxWidth: 1200, margin: '0 auto' }}>

        {/* Título */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: '#3A3228', margin: '0 0 6px' }}>
            Jornada IA · Painel do Organizador
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#8B7355', margin: 0 }}>
            Métricas de engajamento e desempenho dos participantes
          </p>
        </div>

        {/* KPIs principais */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Usuários cadastrados', value: totalUsers, sub: 'via Google OAuth' },
            { label: 'Iniciaram a Jornada', value: usersStarted, sub: `${totalUsers > 0 ? Math.round((usersStarted / totalUsers) * 100) : 0}% de conversão` },
            { label: 'Completaram Fase 1', value: phase1Completions.length, sub: 'com perfil definido' },
            { label: 'Total de respostas', value: answers?.length ?? 0, sub: `${totalCompletions} conclusões de fase` },
          ].map((kpi, i) => (
            <div key={i} style={{ background: '#fff', border: '1.5px solid #C8B88A', borderRadius: 8, boxShadow: '3px 3px 0px #C8B88A', padding: '20px 24px' }}>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: '#8B7355', letterSpacing: '0.12em', marginBottom: 8 }}>{kpi.label.toUpperCase()}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 800, color: '#3A3228', lineHeight: 1, marginBottom: 6 }}>{kpi.value}</div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: '#A89070' }}>{kpi.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>

          {/* Perfis de maturidade */}
          <div style={{ background: '#fff', border: '1.5px solid #C8B88A', borderRadius: 8, boxShadow: '3px 3px 0px #C8B88A', padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: '#8B6914', marginBottom: 20 }}>
              DISTRIBUIÇÃO DE PERFIS (FASE 1)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {profiles.map(p => (
                <div key={p.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: '#3A3228' }}>{p.emoji} {p.label}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: '#3A3228' }}>{p.count}</span>
                  </div>
                  <div style={{ background: '#F5EDD8', borderRadius: 3, height: 8 }}>
                    <div style={{ height: '100%', width: `${(p.count / maxProfileCount) * 100}%`, background: '#D4A853', borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Funil por fase */}
          <div style={{ background: '#fff', border: '1.5px solid #C8B88A', borderRadius: 8, boxShadow: '3px 3px 0px #C8B88A', padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: '#8B6914', marginBottom: 20 }}>
              FUNIL DE ENGAJAMENTO POR FASE
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1, 2, 3, 4, 5, 6, 7].map(phaseId => {
                const reached = reachedPhase[phaseId]?.size ?? 0
                const completed = completions?.filter((c: Completion) => c.phase_id === phaseId).length ?? 0
                const pct = usersStarted > 0 ? Math.round((reached / usersStarted) * 100) : 0
                return (
                  <div key={phaseId} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: '#8B7355', width: 140, flexShrink: 0 }}>
                      {phaseNames[phaseId]}
                    </div>
                    <div style={{ flex: 1, background: '#F5EDD8', borderRadius: 3, height: 8 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: phaseId === 7 ? '#8B6914' : '#D4A853', borderRadius: 3 }} />
                    </div>
                    <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: '#3A3228', fontWeight: 600, width: 60, textAlign: 'right', flexShrink: 0 }}>
                      {reached} ({completed}✓)
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Média por fase */}
        <div style={{ background: '#fff', border: '1.5px solid #C8B88A', borderRadius: 8, boxShadow: '3px 3px 0px #C8B88A', padding: '24px' }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: '#8B6914', marginBottom: 20 }}>
            MÉDIA DE PONTOS POR FASE
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 12 }}>
            {[1, 2, 3, 4, 5, 6, 7].map(phaseId => {
              const stats = avgByPhase[phaseId]
              const avg = stats ? Math.round(stats.sum / stats.count) : null
              const max = phaseId === 7 ? 25 : 20
              const pct = avg !== null ? Math.round((avg / max) * 100) : 0
              return (
                <div key={phaseId} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: '#8B7355', marginBottom: 8, letterSpacing: '0.1em' }}>
                    {phaseId === 7 ? 'BÔNUS' : `FASE ${phaseId}`}
                  </div>
                  <div style={{ position: 'relative', height: 80, background: '#F5EDD8', borderRadius: 4, overflow: 'hidden', marginBottom: 6 }}>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${pct}%`, background: pct >= 75 ? '#2D7A4F' : pct >= 50 ? '#D4A853' : '#C8886A', transition: 'height 0.5s ease' }} />
                    {avg !== null && (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: '#3A3228' }}>
                        {avg}
                      </div>
                    )}
                  </div>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: '#A89070' }}>/{max} pts</div>
                  {stats && (
                    <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: '#8B7355', marginTop: 2 }}>
                      {stats.count} resp.
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
