import { createAdminClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { MATURITY_PROFILES, MAX_POINTS_TOTAL } from '@/lib/scoring'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Certificado — Jornada IA',
    description: 'Certificado de conclusão da Jornada IA para executivos.',
  }
}

export default async function CertificadoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const admin = createAdminClient()

  // Busca a phase_completion pelo certificate_id
  const { data: completion } = await admin
    .from('phase_completions')
    .select('user_id, phase_id, total_points, completed_at, maturity_profile')
    .eq('certificate_id', id)
    .single()

  if (!completion) {
    return (
      <div style={{
        minHeight: '100vh', background: '#F5EDD8',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '40px 24px', textAlign: 'center',
      }}>
        <div style={{ fontSize: 56, marginBottom: 24 }}>🔍</div>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 28, fontWeight: 800, color: '#3A3228', margin: '0 0 12px',
        }}>
          Certificado não encontrado
        </h1>
        <p style={{
          fontFamily: "'Lora', Georgia, serif", fontStyle: 'italic',
          fontSize: 15, color: '#8B7355', maxWidth: 360, lineHeight: 1.7, margin: 0,
        }}>
          Este link não corresponde a nenhum certificado válido na Jornada IA.
        </p>
      </div>
    )
  }

  // Busca dados do usuário via admin API
  const { data: { user } } = await admin.auth.admin.getUserById(completion.user_id)

  // Busca todas as conclusões do usuário para totais
  const { data: allCompletions } = await admin
    .from('phase_completions')
    .select('phase_id, total_points')
    .eq('user_id', completion.user_id)
    .order('phase_id')

  const userName: string =
    (user?.user_metadata?.full_name as string | undefined) ||
    (user?.user_metadata?.name as string | undefined) ||
    user?.email?.split('@')[0] ||
    'Participante'

  const totalPoints = allCompletions?.reduce((s, c) => s + c.total_points, 0) ?? 0
  const phasesCompleted = allCompletions?.length ?? 0

  // Perfil de maturidade (guardado na completion ou procura na fase 1)
  const profileId =
    (completion.maturity_profile as string | null) ??
    (allCompletions?.find(c => c.phase_id === 1) ? null : null)
  const maturityProfile = MATURITY_PROFILES.find(p => p.id === profileId) ?? null

  const completedAt = new Date(completion.completed_at).toLocaleDateString('pt-BR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const scorePercent = Math.round((totalPoints / MAX_POINTS_TOTAL) * 100)

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #F5EDD8 0%, #EFE5C8 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '48px 24px 80px',
      fontFamily: 'Raleway, system-ui, sans-serif',
    }}>

      {/* ── Badge verificado ── */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: 'rgba(212,168,83,0.15)',
        border: '1.5px solid rgba(212,168,83,0.5)',
        borderRadius: 100, padding: '6px 18px',
        marginBottom: 40,
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1L8.5 3.5H11.5L9.5 5.5L10.5 8.5L7 7L3.5 8.5L4.5 5.5L2.5 3.5H5.5L7 1Z"
            fill="#D4A853" stroke="#8B6914" strokeWidth="0.8" strokeLinejoin="round"/>
        </svg>
        <span style={{
          fontFamily: 'Raleway, system-ui, sans-serif',
          fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: '#8B6914',
        }}>
          CERTIFICADO VÁLIDO E VERIFICADO ✅
        </span>
      </div>

      {/* ── Certificado ── */}
      <div style={{
        width: '100%', maxWidth: 760,
        background: '#FFFDF6',
        border: '2px solid #C8B88A',
        borderRadius: 12,
        boxShadow: '8px 8px 0px #C8B88A',
        overflow: 'hidden',
        position: 'relative',
      }}>

        {/* Barra topo */}
        <div style={{ height: 6, background: 'linear-gradient(90deg, #D4A853, #8B6914, #3A3228, #8B6914, #D4A853)' }} />

        {/* Cantos decorativos */}
        {[
          { top: 16, left: 16 },
          { top: 16, right: 16, transform: 'scaleX(-1)' },
          { bottom: 16, left: 16, transform: 'scaleY(-1)' },
          { bottom: 16, right: 16, transform: 'scale(-1)' },
        ].map((pos, i) => (
          <svg key={i} style={{ position: 'absolute', opacity: 0.4, ...pos }} width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M2 38 L2 2 L38 2" stroke="#8B6914" strokeWidth="1.5" strokeLinecap="round" fill="none" strokeDasharray="4 3"/>
            <circle cx="2" cy="2" r="2.5" fill="#D4A853"/>
          </svg>
        ))}

        <div style={{ padding: '48px 56px 52px' }}>

          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="22" height="30" viewBox="0 0 48 64" fill="none">
                <path d="M24 62C24 62 8 44 6 28C4 12 16 2 24 2C32 2 44 12 42 28C40 44 24 62 24 62Z"
                  fill="white" stroke="#D4A853" strokeWidth="2.5"/>
                <path d="M24 62L24 8" stroke="#8B6914" strokeWidth="1.5" strokeDasharray="3 2"/>
              </svg>
              <span style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 20, fontWeight: 800, color: '#3A3228', letterSpacing: '-0.01em',
              }}>
                Jornada <span style={{ color: '#D4A853' }}>IA</span>
              </span>
            </div>
          </div>

          {/* Divisor */}
          <Divisor />

          {/* Título do certificado */}
          <div style={{ textAlign: 'center', margin: '28px 0' }}>
            <div style={{
              fontFamily: 'Raleway, system-ui, sans-serif',
              fontSize: 10, fontWeight: 700, letterSpacing: '0.28em',
              color: '#8B6914', marginBottom: 16,
            }}>
              CERTIFICADO DE CONCLUSÃO
            </div>
            <p style={{
              fontFamily: "'Lora', Georgia, serif", fontStyle: 'italic',
              fontSize: 15, color: '#8B7355', margin: '0 0 24px', lineHeight: 1.6,
            }}>
              Certificamos que
            </p>
            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 40, fontWeight: 800, color: '#3A3228',
              margin: '0 0 8px', lineHeight: 1.15,
            }}>
              {userName}
            </h1>
            <p style={{
              fontFamily: "'Lora', Georgia, serif", fontStyle: 'italic',
              fontSize: 15, color: '#8B7355', margin: 0, lineHeight: 1.6,
            }}>
              concluiu com êxito a <strong style={{ fontStyle: 'normal', color: '#3A3228' }}>Jornada IA para Executivos</strong>,
              uma experiência gamificada de diagnóstico e desenvolvimento em Inteligência Artificial.
            </p>
          </div>

          {/* Divisor */}
          <Divisor />

          {/* Stats grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            gap: 16, margin: '28px 0',
          }}>
            <StatCard
              label="PONTUAÇÃO TOTAL"
              value={`${totalPoints}`}
              sub={`de ${MAX_POINTS_TOTAL} possíveis (${scorePercent}%)`}
            />
            <StatCard
              label="FASES CONCLUÍDAS"
              value={`${phasesCompleted}/7`}
              sub="fases da jornada"
            />
            <StatCard
              label="DATA DE CONCLUSÃO"
              value={completedAt}
              sub="certificado emitido"
              small
            />
          </div>

          {/* Perfil de maturidade */}
          {maturityProfile && (
            <div style={{
              background: '#3A3228', borderRadius: 8,
              padding: '20px 28px',
              display: 'flex', alignItems: 'center', gap: 20,
              margin: '0 0 28px',
            }}>
              <span style={{ fontSize: 44, lineHeight: 1, flexShrink: 0 }}>{maturityProfile.emoji}</span>
              <div>
                <div style={{
                  fontFamily: 'Raleway, system-ui, sans-serif',
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.22em',
                  color: 'rgba(212,168,83,0.7)', marginBottom: 4,
                }}>
                  PERFIL DE MATURIDADE EM IA
                </div>
                <div style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 22, fontWeight: 800, color: '#D4A853', marginBottom: 4,
                }}>
                  {maturityProfile.label}
                </div>
                <div style={{
                  display: 'inline-block',
                  background: 'rgba(212,168,83,0.15)',
                  borderRadius: 3, padding: '2px 10px',
                  fontFamily: 'Raleway, system-ui, sans-serif',
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#D4A853',
                }}>
                  {maturityProfile.level.toUpperCase()}
                </div>
              </div>
            </div>
          )}

          {/* Divisor */}
          <Divisor />

          {/* Rodapé do certificado */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            marginTop: 28, gap: 24,
          }}>
            <div>
              <div style={{
                fontFamily: 'Raleway, system-ui, sans-serif',
                fontSize: 9, fontWeight: 700, letterSpacing: '0.18em',
                color: '#8B7355', marginBottom: 4,
              }}>
                ID DE VERIFICAÇÃO
              </div>
              <div style={{
                fontFamily: 'monospace', fontSize: 11,
                color: '#A89070', letterSpacing: '0.04em',
              }}>
                {id}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 18, fontWeight: 800, color: '#3A3228', marginBottom: 4,
              }}>
                Jornada IA
              </div>
              <div style={{
                fontFamily: "'Lora', Georgia, serif", fontStyle: 'italic',
                fontSize: 12, color: '#8B7355',
              }}>
                Diagnóstico em Inteligência Artificial
              </div>
            </div>
          </div>

        </div>

        {/* Barra base */}
        <div style={{ height: 4, background: 'linear-gradient(90deg, #3A3228, #8B6914, #D4A853, #8B6914, #3A3228)' }} />
      </div>

      {/* Nota de verificação */}
      <p style={{
        fontFamily: "'Lora', Georgia, serif", fontStyle: 'italic',
        fontSize: 12, color: '#A89070', marginTop: 28, textAlign: 'center', maxWidth: 480,
      }}>
        Este certificado é público e pode ser verificado por qualquer pessoa através deste link.
        O ID de verificação garante a autenticidade do documento.
      </p>

    </div>
  )
}

// ── Subcomponentes ────────────────────────────────────────────────────────────

function Divisor() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #D4A853, transparent)' }} />
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <rect x="5" y="0" width="7" height="7" transform="rotate(45 5 5)" fill="#D4A853"/>
      </svg>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #D4A853, transparent)' }} />
    </div>
  )
}

function StatCard({
  label, value, sub, small = false,
}: {
  label: string
  value: string
  sub: string
  small?: boolean
}) {
  return (
    <div style={{
      background: '#F5EDD8',
      border: '1.5px solid #C8B88A',
      borderRadius: 6,
      padding: '16px 18px',
    }}>
      <div style={{
        fontFamily: 'Raleway, system-ui, sans-serif',
        fontSize: 9, fontWeight: 700, letterSpacing: '0.18em',
        color: '#8B6914', marginBottom: 8,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: small ? 18 : 30, fontWeight: 800,
        color: '#3A3228', lineHeight: 1.15, marginBottom: 4,
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: 'Raleway, system-ui, sans-serif',
        fontSize: 10, color: '#A89070',
      }}>
        {sub}
      </div>
    </div>
  )
}
