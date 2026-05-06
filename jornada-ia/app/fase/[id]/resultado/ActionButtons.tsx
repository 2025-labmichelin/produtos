'use client'

import Link from 'next/link'

interface ActionButtonsProps {
  nextPhaseId?: number
  nextPhaseName?: string
}

export default function ActionButtons({ nextPhaseId, nextPhaseName }: ActionButtonsProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      {nextPhaseId && nextPhaseName && (
        <Link
          href={`/fase/${nextPhaseId}`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '13px 26px',
            background: '#3A3228', color: '#F5EDD8',
            textDecoration: 'none',
            borderRadius: 4,
            outline: '3px solid #3A3228',
            outlineOffset: '3px',
            fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 700,
            letterSpacing: '0.07em',
            transition: 'background 0.15s ease, outline-offset 0.12s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = '#5C4D3C'
            ;(e.currentTarget as HTMLAnchorElement).style.outlineOffset = '5px'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = '#3A3228'
            ;(e.currentTarget as HTMLAnchorElement).style.outlineOffset = '3px'
          }}
        >
          Avançar para {nextPhaseName} →
        </Link>
      )}

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
          (e.currentTarget as HTMLAnchorElement).style.borderColor = '#8B6914'
          ;(e.currentTarget as HTMLAnchorElement).style.color = '#3A3228'
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.borderColor = '#C8B88A'
          ;(e.currentTarget as HTMLAnchorElement).style.color = '#5C4D3C'
        }}
      >
        Voltar ao hub
      </Link>
    </div>
  )
}
