import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import LogoutButton from '@/components/auth/LogoutButton'
import { getMaturityProfile } from '@/lib/scoring'
import { phases } from '@/data/questions'

type Completion = { phase_id: number; total_points: number; maturity_profile: string | null; completed_at: string }
type RankingEntry = { pos: number; name: string; points: number; isYou?: boolean }

const PHASE_DESCRIPTIONS: Record<number, string> = {
  1: 'Descubra seu perfil de maturidade em IA',
  2: 'Teste sua alfabetização em IA',
  3: 'Os trends de 2026 que vão mudar tudo',
  4: 'Estratégia e casos de uso reais',
  5: 'Do piloto à produção com escala',
  6: 'Governança, ROI e maturidade',
  7: 'Fase surpresa — você chegou até aqui',
}

export default async function HubPage() {
  const supabase = await createServerSupabaseClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  // Buscar completions do usuário
  const { data: completions } = await supabase
    .from('phase_completions')
    .select('phase_id, total_points, maturity_profile, completed_at')
    .eq('user_id', user.id)
    .order('phase_id')

  const rows = (completions ?? []) as Completion[]
  const completedPhaseIds = new Set(rows.map(c => c.phase_id))
  const totalPoints = rows.reduce((sum, c) => sum + (c.total_points ?? 0), 0)
  const phase1Completion = rows.find(c => c.phase_id === 1)
  const maturityProfile = phase1Completion ? getMaturityProfile(phase1Completion.total_points) : null

  // Fase atual: primeira não concluída (excluindo surpresa se 1-6 não concluídas)
  const mainPhases = phases.filter(p => !p.isSurprise)
  const surprisePhase = phases.find(p => p.isSurprise)
  const allMainDone = mainPhases.every(p => completedPhaseIds.has(p.id))
  const currentPhaseId = mainPhases.find(p => !completedPhaseIds.has(p.id))?.id
    ?? (allMainDone && surprisePhase && !completedPhaseIds.has(surprisePhase.id) ? surprisePhase.id : null)

  // Ranking mock (em produção viria do Supabase)
  const mockRanking: RankingEntry[] = [
    { pos: 1, name: 'Jogador anônimo', points: 138 },
    { pos: 2, name: 'Jogador anônimo', points: 131 },
    { pos: 3, name: user.user_metadata?.name ?? 'Você', points: totalPoints, isYou: true },
    { pos: 4, name: 'Jogador anônimo', points: totalPoints > 0 ? totalPoints - 8 : 0 },
    { pos: 5, name: 'Jogador anônimo', points: totalPoints > 0 ? totalPoints - 15 : 0 },
  ]

  const avatarUrl = user.user_metadata?.avatar_url ?? null
  const userName = user.user_metadata?.name ?? user.email ?? 'Usuário'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>

      {/* Header */}
      <header style={{ background: 'var(--color-bg-card)', borderBottom: '1.5px solid rgba(212,168,83,0.3)', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>🪶</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--color-text)' }}>
            Jornada <span style={{ color: 'var(--color-primary)' }}>IA</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {maturityProfile && (
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--color-primary-dark)', background: 'rgba(212,168,83,0.12)', border: '1px solid rgba(212,168,83,0.3)', borderRadius: 99, padding: '4px 12px', fontWeight: 600 }}>
              {maturityProfile.emoji} {maturityProfile.label}
            </span>
          )}
          {avatarUrl
            ? <Image src={avatarUrl} alt={userName} width={36} height={36} style={{ borderRadius: '50%', border: '2px solid var(--color-primary)', objectFit: 'cover' }} />
            : <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-ui)', fontWeight: 700, color: '#fff', fontSize: 14 }}>{userName[0]?.toUpperCase()}</div>
          }
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>{userName}</span>
          <LogoutButton />
        </div>
      </header>

      {/* Layout principal */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, alignItems: 'start' }}>

        {/* Coluna esquerda */}
        <div>
          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 36 }}>
            {[
              { label: 'Pontuação total', value: totalPoints, suffix: 'pts', color: 'var(--color-primary-dark)' },
              { label: 'Fase atual', value: currentPhaseId ? `Fase ${currentPhaseId}` : '—', suffix: '', color: 'var(--color-secondary)' },
              { label: 'Ranking geral', value: '#3', suffix: '', color: '#C0392B' },
              { label: 'Perfil', value: maturityProfile ? maturityProfile.emoji : '?', suffix: '', color: 'var(--color-primary)' },
            ].map((stat, i) => (
              <div key={i} style={{ background: 'var(--color-bg-card)', border: 'var(--border-card)', borderRadius: 12, padding: '18px 16px', boxShadow: '2px 2px 0px #8B6914' }}>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--color-text)', opacity: 0.55, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, fontWeight: 600 }}>{stat.label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: stat.color, lineHeight: 1 }}>
                  {stat.value}<span style={{ fontSize: 14, fontFamily: 'var(--font-ui)', fontWeight: 600, marginLeft: 3 }}>{stat.suffix}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Trilha de fases */}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--color-text)', marginBottom: 24, marginTop: 0 }}>Sua trilha</h2>

          <div style={{ position: 'relative' }}>
            {/* Linha tracejada vertical */}
            <div style={{ position: 'absolute', left: 27, top: 28, bottom: 28, width: 2, backgroundImage: 'repeating-linear-gradient(to bottom, #D4A853 0px, #D4A853 6px, transparent 6px, transparent 12px)', zIndex: 0 }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', zIndex: 1 }}>
              {phases.map(phase => {
                const isDone = completedPhaseIds.has(phase.id)
                const isCurrent = phase.id === currentPhaseId
                const isLocked = !isDone && !isCurrent
                const isSurprise = !!phase.isSurprise
                const phaseCompletion = rows.find(c => c.phase_id === phase.id)

                return (
                  <div
                    key={phase.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      background: 'var(--color-bg-card)',
                      border: isSurprise
                        ? '2px dashed #C0392B'
                        : isCurrent
                          ? '1.5px solid rgba(212,168,83,0.6)'
                          : 'var(--border-card)',
                      borderRadius: 14,
                      padding: '16px 20px',
                      opacity: isLocked ? 0.55 : 1,
                      boxShadow: isCurrent ? '3px 3px 0px #D4A853' : '2px 2px 0px #8B6914',
                      transition: 'opacity 0.2s',
                    }}
                  >
                    {/* Círculo de status */}
                    <div style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      background: isDone
                        ? 'linear-gradient(135deg, #D4A853, #8B6914)'
                        : isCurrent
                          ? 'rgba(212,168,83,0.12)'
                          : '#E8DCC8',
                      border: isDone
                        ? '2px solid #8B6914'
                        : isCurrent
                          ? '2px solid #D4A853'
                          : '2px solid #C4B49A',
                      boxShadow: isCurrent ? '0 0 0 4px rgba(212,168,83,0.2)' : 'none',
                      position: 'relative',
                    }}>
                      {isLocked ? '🔒' : phase.emoji}
                      {isDone && (
                        <div style={{ position: 'absolute', bottom: -2, right: -2, width: 18, height: 18, borderRadius: '50%', background: '#00A443', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                      )}
                    </div>

                    {/* Info da fase */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--color-text)' }}>{phase.name}</span>
                        {isDone && <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, color: '#00A443', background: 'rgba(0,164,67,0.1)', border: '1px solid rgba(0,164,67,0.3)', borderRadius: 99, padding: '2px 8px' }}>Concluída</span>}
                        {isCurrent && <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, color: '#8B6914', background: 'rgba(212,168,83,0.15)', border: '1px solid rgba(212,168,83,0.4)', borderRadius: 99, padding: '2px 8px' }}>Em andamento</span>}
                        {isLocked && <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, color: '#888', background: 'rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 99, padding: '2px 8px' }}>Bloqueada</span>}
                      </div>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text)', opacity: 0.65, margin: '0 0 6px' }}>{PHASE_DESCRIPTIONS[phase.id]}</p>
                      {isCurrent && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 4, background: 'rgba(212,168,83,0.2)', borderRadius: 99, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: '20%', background: 'linear-gradient(90deg, #8B6914, #D4A853)', borderRadius: 99 }} />
                          </div>
                          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: '#8B6914', fontWeight: 600 }}>Em progresso</span>
                        </div>
                      )}
                      {isDone && phaseCompletion && (
                        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: '#8B6914', fontWeight: 600 }}>{phaseCompletion.total_points} pts conquistados</span>
                      )}
                    </div>

                    {/* Botão entrar (se disponível) */}
                    {(isDone || isCurrent) && !isLocked && (
                      <Link
                        href={`/fase/${phase.id}`}
                        style={{
                          fontFamily: 'var(--font-ui)',
                          fontSize: 12,
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: isDone ? '#8B6914' : '#fff9f0',
                          background: isDone ? 'transparent' : '#3A3228',
                          border: isDone ? '1.5px solid rgba(139,105,20,0.4)' : 'none',
                          outline: isDone ? 'none' : '2px solid #3A3228',
                          outlineOffset: 2,
                          borderRadius: 4,
                          padding: '8px 16px',
                          textDecoration: 'none',
                          flexShrink: 0,
                          boxShadow: isDone ? 'none' : '2px 2px 0px #8B6914',
                        }}
                      >
                        {isDone ? 'Rever' : 'Entrar →'}
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sidebar direita */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 80 }}>

          {/* CTA continuar */}
          {currentPhaseId && (
            <div style={{ background: 'var(--color-bg-card)', border: '1.5px solid rgba(212,168,83,0.5)', borderRadius: 14, padding: '22px', boxShadow: '3px 3px 0px #8B6914' }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8B6914', marginBottom: 8, marginTop: 0 }}>Continue de onde parou</p>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--color-text)', marginBottom: 16, marginTop: 0 }}>
                {phases.find(p => p.id === currentPhaseId)?.emoji} {phases.find(p => p.id === currentPhaseId)?.name}
              </p>
              <Link href={`/fase/${currentPhaseId}`} className="btn-primary" style={{ width: '100%', justifyContent: 'center', boxSizing: 'border-box' }}>
                Continuar →
              </Link>
            </div>
          )}

          {/* Card perfil de maturidade (só após Fase 1) */}
          {maturityProfile && (
            <div style={{ background: 'var(--color-bg-card)', border: 'var(--border-card)', borderRadius: 14, padding: '22px', boxShadow: '2px 2px 0px #8B6914' }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8B6914', marginBottom: 12, marginTop: 0 }}>Seu perfil</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <span style={{ fontSize: 32 }}>{maturityProfile.emoji}</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--color-text)' }}>{maturityProfile.label}</div>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: '#8B6914', fontWeight: 600 }}>{maturityProfile.level}</div>
                </div>
              </div>
              {/* Barra de evolução */}
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--color-text)', opacity: 0.6 }}>Evolução</span>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, color: '#8B6914' }}>{totalPoints} / 145 pts</span>
                </div>
                <div style={{ height: 6, background: 'rgba(212,168,83,0.2)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min((totalPoints / 145) * 100, 100)}%`, background: 'linear-gradient(90deg, #8B6914, #D4A853)', borderRadius: 99, transition: 'width 0.4s ease' }} />
                </div>
              </div>
            </div>
          )}

          {/* Card ranking */}
          <div style={{ background: 'var(--color-bg-card)', border: 'var(--border-card)', borderRadius: 14, padding: '22px', boxShadow: '2px 2px 0px #8B6914' }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8B6914', marginBottom: 14, marginTop: 0 }}>Ranking geral</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {mockRanking.map(entry => (
                <div
                  key={entry.pos}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 10px',
                    borderRadius: 8,
                    background: entry.isYou ? 'rgba(74,107,138,0.12)' : 'transparent',
                    border: entry.isYou ? '1.5px solid rgba(74,107,138,0.3)' : '1.5px solid transparent',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 700, color: entry.isYou ? '#4A6B8A' : '#8B7355', minWidth: 20 }}>#{entry.pos}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: entry.isYou ? '#4A6B8A' : 'var(--color-text)', flex: 1, fontWeight: entry.isYou ? 700 : 400 }}>{entry.name}</span>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700, color: entry.isYou ? '#4A6B8A' : '#8B7355' }}>{entry.points} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
