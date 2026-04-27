'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{ minHeight: '100vh', background: '#F5EDD8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center' }}>

      {/* Ícone */}
      <div style={{ fontSize: 56, marginBottom: 24, lineHeight: 1 }}>🍫</div>

      {/* Título */}
      <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 800, color: '#3A3228', margin: '0 0 12px', lineHeight: 1.2 }}>
        Algo deu errado
      </h1>
      <p style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: 'italic', fontSize: 15, color: '#8B7355', margin: '0 0 40px', maxWidth: 380, lineHeight: 1.7 }}>
        &ldquo;Às vezes a vida é como uma caixa de chocolates — você pega um que não esperava.&rdquo;
      </p>

      {/* Divisor */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: 280, marginBottom: 40 }}>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #D4A853, transparent)' }} />
        <div style={{ width: 6, height: 6, background: '#D4A853', transform: 'rotate(45deg)' }} />
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #D4A853, transparent)' }} />
      </div>

      {/* Botões */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={reset}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '13px 28px',
            background: '#3A3228',
            color: '#F5EDD8',
            border: 'none',
            borderRadius: 4,
            outline: '3px solid #3A3228',
            outlineOffset: '3px',
            fontFamily: 'Raleway, system-ui, sans-serif',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.1em',
            cursor: 'pointer',
          }}
        >
          Tentar novamente
        </button>
        <a
          href="/hub"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '13px 22px',
            background: 'transparent',
            color: '#5C4D3C',
            textDecoration: 'none',
            borderRadius: 4,
            border: '1.5px solid #C8B88A',
            fontFamily: 'Raleway, system-ui, sans-serif',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.06em',
          }}
        >
          Ir ao hub
        </a>
      </div>

      {/* Digest para debug */}
      {error.digest && (
        <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#C8B88A', marginTop: 32 }}>
          {error.digest}
        </p>
      )}
    </div>
  )
}
