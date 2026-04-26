import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { getPhase } from '@/data/questions'
import Link from 'next/link'

export default async function PhaseIntroPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const phaseId = parseInt(id)
  const phase = getPhase(phaseId)
  if (!phase) redirect('/hub')

  // Verificar se fase está desbloqueada
  if (phaseId > 1) {
    const { data: prev } = await supabase
      .from('phase_completions')
      .select('id')
      .eq('user_id', user.id)
      .eq('phase_id', phaseId - 1)
      .single()
    if (!prev) redirect('/hub')
  }

  // Verificar se já concluiu esta fase
  const { data: completion } = await supabase
    .from('phase_completions')
    .select('total_points')
    .eq('user_id', user.id)
    .eq('phase_id', phaseId)
    .single()

  const alreadyCompleted = !!completion
  const maxPoints = phase.isSurprise ? 25 : 20

  const phaseDescriptions: Record<number, string> = {
    1: 'Hora da verdade. 5 perguntas que revelam onde você realmente está no mapa da IA — sem filtro, sem julgamento. Seu perfil de maturidade sai daqui.',
    2: 'A IA não para. Nesta fase, você analisa como sua empresa responde à velocidade do mercado e onde estão os gargalos de adoção.',
    3: 'Estratégia em ação. Caso de uso, ROI, critérios de escolha — é aqui que a maioria erra ao tentar escalar IA.',
    4: 'O campo de batalha real: dados, privacidade, LGPD e os riscos que ninguém fala em podcast.',
    5: 'Implementação e escala. O que diferencia empresas que entregam de empresas que ficam em piloto eterno.',
    6: 'Governança, métricas, pessoas e o futuro. A visão do executivo que realmente entende o jogo.',
    7: 'A surpresa que todos merecem. 5 perguntas com pontuação especial — cada resposta vale mais. Boa sorte.',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5EDD8', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(245,237,216,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(212,168,83,0.2)', padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/hub" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#8B6914', fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="#8B6914" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          VOLTAR AO HUB
        </Link>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: '#A89070', letterSpacing: '0.08em' }}>
          JORNADA IA
        </span>
      </header>

      {/* Conteúdo */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 40px' }}>
        <div style={{ maxWidth: 560, width: '100%', textAlign: 'center' }}>

          {/* Fase badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff9f0', border: '1.5px solid #D4A853', borderRadius: 4, padding: '6px 16px', marginBottom: 32 }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: '#8B6914' }}>
              {phase.isSurprise ? 'BÔNUS SURPRESA' : `FASE ${phaseId}`}
            </span>
          </div>

          {/* Emoji */}
          <div style={{ fontSize: 72, marginBottom: 24, lineHeight: 1 }}>
            {phase.emoji}
          </div>

          {/* Nome */}
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 800, color: '#3A3228', marginBottom: 8, marginTop: 0, lineHeight: 1.1 }}>
            {phase.name}
          </h1>

          {/* Tema */}
          <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 16, color: '#8B6914', marginBottom: 24, marginTop: 0 }}>
            {phase.theme}
          </p>

          {/* Divisor */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #D4A853, transparent)' }} />
            <div style={{ width: 6, height: 6, background: '#D4A853', transform: 'rotate(45deg)', flexShrink: 0 }} />
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #D4A853, transparent)' }} />
          </div>

          {/* Descrição */}
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: '#5C4D3C', lineHeight: 1.7, marginBottom: 40, marginTop: 0 }}>
            {phaseDescriptions[phaseId]}
          </p>

          {/* Info row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 40 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: '#3A3228' }}>5</div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: '#8B7355', letterSpacing: '0.1em' }}>PERGUNTAS</div>
            </div>
            <div style={{ width: 1, background: '#D4A853', opacity: 0.4 }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: '#3A3228' }}>{maxPoints}</div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: '#8B7355', letterSpacing: '0.1em' }}>PTS MÁXIMOS</div>
            </div>
            <div style={{ width: 1, background: '#D4A853', opacity: 0.4 }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: '#3A3228' }}>~5</div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: '#8B7355', letterSpacing: '0.1em' }}>MINUTOS</div>
            </div>
          </div>

          {/* CTA */}
          {alreadyCompleted ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ background: '#fff9f0', border: '1.5px solid #D4A853', borderRadius: 6, padding: '10px 20px', fontFamily: 'var(--font-ui)', fontSize: 13, color: '#8B6914' }}>
                Fase concluída · {completion.total_points}/{maxPoints} pts
              </div>
              <Link href={`/fase/${phaseId}/resultado`} style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: '#8B6914', textDecoration: 'underline', letterSpacing: '0.05em' }}>
                Ver resultado novamente
              </Link>
            </div>
          ) : (
            <Link
              href={`/fase/${phaseId}/pergunta/1`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 32px',
                background: '#D4A853',
                border: '2px solid #8B6914',
                borderRadius: 6,
                boxShadow: '3px 3px 0px #8B6914',
                textDecoration: 'none',
                fontFamily: 'var(--font-ui)',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: '#fff',
                transition: 'transform 0.1s ease, box-shadow 0.1s ease',
              }}
            >
              COMEÇAR FASE {phase.isSurprise ? 'SURPRESA' : phaseId}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4l4 4-4 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
