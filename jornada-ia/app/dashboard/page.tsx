import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { getMaturityProfile } from '@/lib/scoring'
import Link from 'next/link'

type Completion = { user_id: string; phase_id: number; total_points: number; completed_at: string }
type Answer     = { user_id: string; phase_id: number; answered_at: string }

const PHASE_NAMES: Record<number, string> = {
  1: 'O Banco do Parque', 2: 'Alabama',    3: 'A Corrida',
  4: 'Vietnam',           5: 'Bubba Gump', 6: 'Tenente Dan', 7: 'A Caixa',
}
const PHASE_EMOJI: Record<number, string> = {
  1: '🪑', 2: '🏃', 3: '🪶', 4: '🌿', 5: '🚢', 6: '👨‍✈️', 7: '🍫',
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { period?: string }
}) {
  const period = (searchParams?.period ?? 'all') as 'all' | '7d' | '30d'

  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  if (user.email !== process.env.NEXT_PUBLIC_OWNER_EMAIL) redirect('/hub')

  const admin = createAdminClient()

  const cutoff =
    period === '7d'  ? new Date(Date.now() - 7  * 86400000).toISOString() :
    period === '30d' ? new Date(Date.now() - 30 * 86400000).toISOString() : null

  // ── Fetch ───────────────────────────────────────────────────────────────────
  const { data: { users: allUsers } } = await admin.auth.admin.listUsers()

  const { data: rawCompletions } = cutoff
    ? await admin.from('phase_completions').select('user_id, phase_id, total_points, completed_at').gte('completed_at', cutoff)
    : await admin.from('phase_completions').select('user_id, phase_id, total_points, completed_at')
  const completions = (rawCompletions ?? []) as Completion[]

  const { data: rawAnswers } = cutoff
    ? await admin.from('question_answers').select('user_id, phase_id, answered_at').gte('answered_at', cutoff)
    : await admin.from('question_answers').select('user_id, phase_id, answered_at')
  const answers = (rawAnswers ?? []) as Answer[]

  const totalUsers = allUsers?.length ?? 0

  // ── KPIs ────────────────────────────────────────────────────────────────────
  const uniqueStarted   = new Set(answers.map(a => a.user_id)).size
  const uniqueCompleted = new Set(completions.map(c => c.user_id)).size
  const completionRate  = uniqueStarted > 0 ? Math.round((uniqueCompleted / uniqueStarted) * 100) : 0
  const phase1Count     = completions.filter(c => c.phase_id === 1).length

  // ── Funnel ──────────────────────────────────────────────────────────────────
  const reachedPhase: Record<number, Set<string>> = {}
  for (const a of answers) {
    if (!reachedPhase[a.phase_id]) reachedPhase[a.phase_id] = new Set()
    reachedPhase[a.phase_id].add(a.user_id)
  }
  const completedPhase: Record<number, number> = {}
  for (const c of completions) completedPhase[c.phase_id] = (completedPhase[c.phase_id] ?? 0) + 1
  const maxReached = Math.max(...[1,2,3,4,5,6,7].map(i => reachedPhase[i]?.size ?? 0), 1)

  let biggestDropPhase = 0
  let biggestDropValue = 0
  for (let i = 2; i <= 7; i++) {
    const drop = (reachedPhase[i - 1]?.size ?? 0) - (reachedPhase[i]?.size ?? 0)
    if (drop > biggestDropValue) { biggestDropValue = drop; biggestDropPhase = i }
  }

  // ── Donut: completaram vs só iniciaram ─────────────────────────────────────
  const donutR    = 52
  const donutC    = 2 * Math.PI * donutR
  const doneFrac  = uniqueStarted > 0 ? uniqueCompleted / uniqueStarted : 0
  const doneArc   = doneFrac * donutC
  const restArc   = donutC - doneArc

  // ── Bar chart: últimos 7 dias ───────────────────────────────────────────────
  const sevenAgo = new Date(Date.now() - 7 * 86400000).toISOString()
  const answersFor7 = answers.filter(a => a.answered_at >= sevenAgo)
  const barData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000)
    const dateStr = d.toISOString().slice(0, 10)
    return {
      label: d.toLocaleDateString('pt-BR', { weekday: 'short' }),
      day:   d.getDate(),
      count: answersFor7.filter(a => a.answered_at.startsWith(dateStr)).length,
    }
  })
  const maxBar = Math.max(...barData.map(d => d.count), 1)

  // ── Profile distribution ────────────────────────────────────────────────────
  const profileDist: Record<string, number> = {}
  for (const c of completions.filter(c => c.phase_id === 1)) {
    const p = getMaturityProfile(c.total_points)
    profileDist[p.id] = (profileDist[p.id] ?? 0) + 1
  }
  const profiles = [
    { id: 'pena',     emoji: '🪶', label: 'Pena ao Vento'         },
    { id: 'correndo', emoji: '👟', label: 'Começando a Correr'     },
    { id: 'corrida',  emoji: '🏃', label: 'Na Corrida'             },
    { id: 'caixa',    emoji: '🍫', label: 'Sabe o que vai na Caixa' },
  ].map(p => ({ ...p, count: profileDist[p.id] ?? 0 }))
  const maxProfile = Math.max(...profiles.map(p => p.count), 1)

  // ── Média por fase ──────────────────────────────────────────────────────────
  const phaseStats: Record<number, { sum: number; count: number }> = {}
  for (const c of completions) {
    if (!phaseStats[c.phase_id]) phaseStats[c.phase_id] = { sum: 0, count: 0 }
    phaseStats[c.phase_id].sum   += c.total_points
    phaseStats[c.phase_id].count += 1
  }

  // ── Top 5 ───────────────────────────────────────────────────────────────────
  const userPoints: Record<string, number> = {}
  for (const c of completions) userPoints[c.user_id] = (userPoints[c.user_id] ?? 0) + c.total_points
  const top5 = Object.entries(userPoints)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([uid, pts], i) => ({ pos: i + 1, pts, isYou: uid === user.id }))

  // ── Render ──────────────────────────────────────────────────────────────────
  const periodLabel =
    period === '7d'  ? 'Últimos 7 dias'  :
    period === '30d' ? 'Últimos 30 dias' : 'Todo o período'

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

        {/* Period tabs */}
        <div style={{ display: 'flex', gap: 3, background: '#E8DCC8', borderRadius: 6, padding: 3 }}>
          {(['all', '7d', '30d'] as const).map(p => (
            <Link key={p} href={p === 'all' ? '/dashboard' : `/dashboard?period=${p}`} style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', padding: '5px 14px', borderRadius: 4, textDecoration: 'none', background: period === p ? '#fff9f0' : 'transparent', color: period === p ? '#8B6914' : '#8B7355', boxShadow: period === p ? '1px 1px 0px #C8B88A' : 'none' }}>
              {p === 'all' ? 'Tudo' : p === '7d' ? '7 dias' : '30 dias'}
            </Link>
          ))}
        </div>

        <div style={{ background: '#D4A853', borderRadius: 4, padding: '4px 12px', fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '0.1em' }}>
          ACESSO RESTRITO
        </div>
      </header>

      <div style={{ padding: '40px 48px 80px', maxWidth: 1200, margin: '0 auto' }}>

        {/* Título */}
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: '#3A3228', margin: '0 0 4px' }}>
            Painel do Organizador
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#8B7355', margin: 0 }}>
            {periodLabel} · Jornada IA
          </p>
        </div>

        {/* Block 1: KPIs — dark */}
        <div style={{ background: '#3A3228', borderRadius: 10, padding: '28px 0', marginBottom: 24, boxShadow: '4px 4px 0px #1E1A16' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {[
              { icon: '👤', label: 'Usuários cadastrados', value: totalUsers,     sub: 'via Google OAuth' },
              { icon: '🚀', label: 'Iniciaram a jornada',  value: uniqueStarted,  sub: `${totalUsers > 0 ? Math.round((uniqueStarted / totalUsers) * 100) : 0}% dos cadastrados` },
              { icon: '🏁', label: 'Completaram Fase 1',   value: phase1Count,    sub: `${uniqueStarted > 0 ? Math.round((phase1Count / uniqueStarted) * 100) : 0}% dos que iniciaram` },
              { icon: '📈', label: 'Taxa de conclusão',    value: `${completionRate}%`, sub: `${uniqueCompleted} users completaram ≥1 fase` },
            ].map((kpi, i) => (
              <div key={i} style={{ padding: '0 28px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.14em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>{kpi.icon}</span>{kpi.label.toUpperCase()}
                </div>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 44, fontWeight: 800, color: '#D4A853', lineHeight: 1, marginBottom: 8 }}>
                  {kpi.value}
                </div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                  {kpi.sub}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Block 2+3: Funnel + Donut */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, marginBottom: 20 }}>

          {/* Funil */}
          <div style={{ background: '#fff9f0', border: '1.5px solid #C8B88A', borderRadius: 10, boxShadow: '3px 3px 0px #C8B88A', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: '#8B6914' }}>FUNIL DE ENGAJAMENTO</span>
              {biggestDropValue > 0 && (
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, background: 'rgba(192,57,43,0.08)', color: '#C0392B', border: '1px solid rgba(192,57,43,0.22)', borderRadius: 4, padding: '3px 8px' }}>
                  maior queda: fase {biggestDropPhase} (−{biggestDropValue})
                </span>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1,2,3,4,5,6,7].map(phaseId => {
                const reached   = reachedPhase[phaseId]?.size ?? 0
                const completed = completedPhase[phaseId] ?? 0
                const pct       = Math.round((reached / maxReached) * 100)
                const isBigDrop = phaseId === biggestDropPhase && biggestDropValue > 0
                return (
                  <div key={phaseId} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: '#8B7355', width: 148, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {PHASE_EMOJI[phaseId]} {PHASE_NAMES[phaseId]}
                    </div>
                    <div style={{ flex: 1, background: '#F5EDD8', borderRadius: 3, height: 10, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: isBigDrop ? '#C0392B' : phaseId === 7 ? '#8B6914' : '#D4A853', borderRadius: 3 }} />
                    </div>
                    <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: '#3A3228', fontWeight: 600, width: 80, textAlign: 'right', flexShrink: 0 }}>
                      {reached} <span style={{ color: '#8B7355', fontWeight: 400 }}>({completed}✓)</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Donut */}
          <div style={{ background: '#fff9f0', border: '1.5px solid #C8B88A', borderRadius: 10, boxShadow: '3px 3px 0px #C8B88A', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: '#8B6914', marginBottom: 20, alignSelf: 'flex-start' }}>
              PROGRESSO GERAL
            </div>
            <svg width="120" height="120" viewBox="0 0 120 120" style={{ marginBottom: 20 }}>
              <circle cx="60" cy="60" r={donutR} fill="none" stroke="#E8DCC8" strokeWidth="16" />
              {uniqueStarted > 0 && (
                <circle
                  cx="60" cy="60" r={donutR} fill="none"
                  stroke="#D4A853" strokeWidth="16"
                  strokeDasharray={`${doneArc} ${restArc}`}
                  strokeDashoffset={donutC * 0.25}
                  strokeLinecap="butt"
                />
              )}
              <text x="60" y="55" textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontSize="22" fontWeight="800" fill="#3A3228">
                {uniqueStarted > 0 ? Math.round(doneFrac * 100) : 0}%
              </text>
              <text x="60" y="70" textAnchor="middle" fontFamily="Raleway, system-ui, sans-serif" fontSize="9" fill="#8B7355" letterSpacing="1">
                COMPLETARAM
              </text>
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
              {[
                { color: '#D4A853', label: 'Completaram ≥1 fase', value: uniqueCompleted },
                { color: '#E8DCC8', label: 'Só iniciaram',         value: Math.max(uniqueStarted - uniqueCompleted, 0) },
                { color: 'transparent', label: 'Nunca iniciaram',  value: Math.max(totalUsers - uniqueStarted, 0), border: '#C8B88A' },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: row.color, border: row.border ? `1.5px solid ${row.border}` : 'none', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: '#5C4D3C', flex: 1 }}>{row.label}</span>
                  <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 700, color: '#3A3228' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Block 4: Bar chart — últimos 7 dias */}
        <div style={{ background: '#fff9f0', border: '1.5px solid #C8B88A', borderRadius: 10, boxShadow: '3px 3px 0px #C8B88A', padding: '24px 28px', marginBottom: 20 }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: '#8B6914', marginBottom: 20 }}>
            RESPOSTAS — ÚLTIMOS 7 DIAS
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 140, paddingBottom: 32, position: 'relative' }}>
            {/* Y-axis guideline */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 32, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}>
              {[1, 0.5, 0].map((frac, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: 9, color: '#C8B88A', width: 24, textAlign: 'right', flexShrink: 0 }}>
                    {frac > 0 ? Math.round(maxBar * frac) : 0}
                  </span>
                  <div style={{ flex: 1, height: 1, background: 'rgba(200,184,138,0.25)' }} />
                </div>
              ))}
            </div>
            {/* Bars */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 10, height: '100%', paddingLeft: 32 }}>
              {barData.map((d, i) => {
                const barH = Math.round((d.count / maxBar) * 100)
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                    {d.count > 0 && (
                      <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 12, fontWeight: 700, color: '#3A3228' }}>{d.count}</span>
                    )}
                    <div style={{ width: '100%', maxWidth: 52, borderRadius: '3px 3px 0 0', background: '#D4A853', height: `${barH}%`, minHeight: d.count > 0 ? 4 : 0 }} />
                    <div style={{ width: '100%', height: 1, background: '#C8B88A' }} />
                    <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: '#8B7355', textAlign: 'center', lineHeight: 1.3 }}>
                      {d.label}<br /><strong>{d.day}</strong>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Block 5: Perfis + Média por fase + Top 5 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>

          {/* Perfis */}
          <div style={{ background: '#fff9f0', border: '1.5px solid #C8B88A', borderRadius: 10, boxShadow: '3px 3px 0px #C8B88A', padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: '#8B6914', marginBottom: 18 }}>
              DISTRIBUIÇÃO DE PERFIS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {profiles.map(p => (
                <div key={p.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: '#3A3228' }}>{p.emoji} {p.label}</span>
                    <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 13, fontWeight: 700, color: '#3A3228' }}>{p.count}</span>
                  </div>
                  <div style={{ background: '#F5EDD8', borderRadius: 3, height: 6 }}>
                    <div style={{ height: '100%', width: `${Math.round((p.count / maxProfile) * 100)}%`, background: '#D4A853', borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Média por fase */}
          <div style={{ background: '#fff9f0', border: '1.5px solid #C8B88A', borderRadius: 10, boxShadow: '3px 3px 0px #C8B88A', padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: '#8B6914', marginBottom: 18 }}>
              MÉDIA POR FASE
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {[1,2,3,4,5,6,7].map(phaseId => {
                const stats = phaseStats[phaseId]
                const max   = phaseId === 7 ? 25 : 20
                const avg   = stats ? stats.sum / stats.count : null
                const pct   = avg !== null ? (avg / max) * 100 : 0
                const barColor = pct >= 75 ? '#2D7A4F' : pct >= 50 ? '#D4A853' : pct > 0 ? '#C8886A' : '#E8DCC8'
                return (
                  <div key={phaseId} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: '#8B7355', width: 16, textAlign: 'center', flexShrink: 0 }}>
                      {phaseId === 7 ? '★' : `F${phaseId}`}
                    </span>
                    <div style={{ flex: 1, background: '#F5EDD8', borderRadius: 3, height: 8 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 3 }} />
                    </div>
                    <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 12, fontWeight: 700, color: '#3A3228', width: 30, textAlign: 'right', flexShrink: 0 }}>
                      {avg !== null ? avg.toFixed(1) : '—'}
                    </span>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: '#A89070', width: 26, flexShrink: 0 }}>/{max}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Top 5 */}
          <div style={{ background: '#fff9f0', border: '1.5px solid #C8B88A', borderRadius: 10, boxShadow: '3px 3px 0px #C8B88A', padding: '24px' }}>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: '#8B6914', marginBottom: 18 }}>
              TOP 5 PARTICIPANTES
            </div>
            {top5.length === 0 ? (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#A89070', margin: 0, fontStyle: 'italic' }}>
                Sem dados no período.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {top5.map(entry => (
                  <div key={entry.pos} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 6, background: entry.isYou ? 'rgba(74,107,138,0.10)' : 'transparent', border: `1px solid ${entry.isYou ? 'rgba(74,107,138,0.25)' : 'transparent'}` }}>
                    <span style={{ fontSize: 14, width: 24, flexShrink: 0 }}>
                      {entry.pos === 1 ? '🥇' : entry.pos === 2 ? '🥈' : entry.pos === 3 ? '🥉' : `#${entry.pos}`}
                    </span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: entry.isYou ? '#4A6B8A' : '#3A3228', flex: 1, fontWeight: entry.isYou ? 600 : 400 }}>
                      {entry.isYou ? 'Você (owner)' : `Jogador ${entry.pos}`}
                    </span>
                    <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 700, color: entry.isYou ? '#4A6B8A' : '#8B6914' }}>
                      {entry.pts} pts
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
