'use client'

import CertificateQR from './CertificateQR'

interface CertificateSectionProps {
  certUrl: string
}

export default function CertificateSection({ certUrl }: CertificateSectionProps) {
  return (
    <div style={{
      background: '#3A3228',
      border: '1.5px solid #8B6914',
      borderRadius: 8,
      boxShadow: '4px 4px 0px #8B6914',
      overflow: 'hidden',
    }}>
      {/* Barra gradiente topo */}
      <div style={{ height: 4, background: 'linear-gradient(90deg, #D4A853, #8B6914, #D4A853)' }} />

      <div style={{ padding: '28px 32px 32px' }}>

        {/* Título */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: '#D4A853',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L8.5 3.5H11.5L9.5 5.5L10.5 8.5L7 7L3.5 8.5L4.5 5.5L2.5 3.5H5.5L7 1Z"
                fill="#3A3228" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.2em', color: 'rgba(212,168,83,0.7)', marginBottom: 2,
            }}>
              CONQUISTA DESBLOQUEADA
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: '#D4A853',
            }}>
              Sua jornada está completa! 🍫
            </div>
          </div>
        </div>

        {/* Conteúdo: QR + texto */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 28 }}>

          {/* QR code */}
          <div style={{ flexShrink: 0 }}>
            <CertificateQR url={certUrl} size={108} />
          </div>

          {/* Descrição + botões */}
          <div style={{ flex: 1 }}>
            <p style={{
              fontFamily: 'var(--font-body)', fontStyle: 'italic',
              fontSize: 13, color: 'rgba(245,237,216,0.75)', lineHeight: 1.7,
              margin: '0 0 20px',
            }}>
              Você chegou longe. Este certificado comprova sua jornada e pode
              ser compartilhado, impresso ou verificado por qualquer pessoa.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {/* Ver certificado */}
              <a
                href={certUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '10px 20px',
                  background: '#D4A853', color: '#3A3228',
                  textDecoration: 'none', borderRadius: 4,
                  fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 700,
                  letterSpacing: '0.06em',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#E8BC5A' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#D4A853' }}
              >
                Ver certificado completo →
              </a>

              {/* Imprimir */}
              <button
                onClick={() => window.print()}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '10px 20px',
                  background: 'transparent', color: '#D4A853',
                  border: '1.5px solid rgba(212,168,83,0.45)',
                  borderRadius: 4, cursor: 'pointer',
                  fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600,
                  letterSpacing: '0.06em',
                  transition: 'border-color 0.15s ease, color 0.15s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(212,168,83,0.8)'
                  e.currentTarget.style.color = '#F5EDD8'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(212,168,83,0.45)'
                  e.currentTarget.style.color = '#D4A853'
                }}
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <rect x="2" y="4" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M4 4V2.5C4 2.22 4.22 2 4.5 2h5c.28 0 .5.22.5.5V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  <path d="M4 9.5h6M4 11.5h4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                  <circle cx="11" cy="6.5" r="0.7" fill="currentColor"/>
                </svg>
                Imprimir certificado
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
