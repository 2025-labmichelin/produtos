import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: '#F5EDD8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center' }}>

      {/* Canto decorativo */}
      <svg style={{ position: 'fixed', top: 24, left: 24, opacity: 0.35 }} width="56" height="56" viewBox="0 0 56 56" fill="none">
        <path d="M2 54 L2 2 L54 2" stroke="#8B6914" strokeWidth="1.5" strokeLinecap="round" fill="none" strokeDasharray="4 3"/>
        <circle cx="2" cy="2" r="3" fill="#D4A853" opacity="0.7"/>
      </svg>
      <svg style={{ position: 'fixed', bottom: 80, right: 24, opacity: 0.35, transform: 'rotate(180deg)' }} width="56" height="56" viewBox="0 0 56 56" fill="none">
        <path d="M2 54 L2 2 L54 2" stroke="#8B6914" strokeWidth="1.5" strokeLinecap="round" fill="none" strokeDasharray="4 3"/>
        <circle cx="2" cy="2" r="3" fill="#D4A853" opacity="0.7"/>
      </svg>

      {/* Número 404 */}
      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 120, fontWeight: 800, color: 'rgba(212,168,83,0.18)', lineHeight: 1, marginBottom: -16, userSelect: 'none' }}>
        404
      </div>

      {/* Pena */}
      <div style={{ fontSize: 56, marginBottom: 24, lineHeight: 1 }}>🪶</div>

      {/* Mensagem */}
      <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 800, color: '#3A3228', margin: '0 0 12px', lineHeight: 1.2 }}>
        Página não encontrada
      </h1>
      <p style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: 'italic', fontSize: 15, color: '#8B7355', margin: '0 0 40px', maxWidth: 360, lineHeight: 1.7 }}>
        &ldquo;Às vezes você se perde no caminho. Mas o importante é saber voltar.&rdquo;
      </p>

      {/* Divisor */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: 280, marginBottom: 40 }}>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #D4A853, transparent)' }} />
        <div style={{ width: 6, height: 6, background: '#D4A853', transform: 'rotate(45deg)' }} />
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #D4A853, transparent)' }} />
      </div>

      {/* Botão */}
      <Link
        href="/hub"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '13px 28px',
          background: '#3A3228',
          color: '#F5EDD8',
          textDecoration: 'none',
          borderRadius: 4,
          outline: '3px solid #3A3228',
          outlineOffset: '3px',
          fontFamily: 'Raleway, system-ui, sans-serif',
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.1em',
        }}
      >
        Voltar ao hub
      </Link>
    </div>
  )
}
