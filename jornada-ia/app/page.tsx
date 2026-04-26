'use client'

import { createClient } from '@/lib/supabase'

export default function SplashScreen() {
  async function handleGoogleLogin() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#F5EDD8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>

      {/* Gradiente golden hour nos cantos */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '40%', height: '40%', background: 'radial-gradient(ellipse at top left, rgba(212,168,83,0.18) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '40%', height: '40%', background: 'radial-gradient(ellipse at bottom right, rgba(212,168,83,0.18) 0%, transparent 70%)' }} />
      </div>

      {/* Canto decorativo SVG — top-left */}
      <svg style={{ position: 'absolute', top: 24, left: 24, zIndex: 1, opacity: 0.5 }} width="56" height="56" viewBox="0 0 56 56" fill="none">
        <path d="M2 54 L2 2 L54 2" stroke="#8B6914" strokeWidth="1.5" strokeLinecap="round" fill="none" strokeDasharray="4 3"/>
        <circle cx="2" cy="2" r="3" fill="#D4A853" opacity="0.7"/>
      </svg>

      {/* Canto decorativo SVG — bottom-right */}
      <svg style={{ position: 'absolute', bottom: 80, right: 24, zIndex: 1, opacity: 0.5, transform: 'rotate(180deg)' }} width="56" height="56" viewBox="0 0 56 56" fill="none">
        <path d="M2 54 L2 2 L54 2" stroke="#8B6914" strokeWidth="1.5" strokeLinecap="round" fill="none" strokeDasharray="4 3"/>
        <circle cx="2" cy="2" r="3" fill="#D4A853" opacity="0.7"/>
      </svg>

      {/* Conteúdo central */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: 560, padding: '0 32px 100px' }}>

        {/* Pena animada */}
        <div className="feather-float" style={{ marginBottom: 32 }}>
          <svg width="48" height="64" viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 62 C24 62 8 44 6 28 C4 12 16 2 24 2 C32 2 44 12 42 28 C40 44 24 62 24 62Z" fill="white" stroke="#D4A853" strokeWidth="1.2"/>
            <path d="M24 62 L24 8" stroke="#8B6914" strokeWidth="0.8" strokeDasharray="3 2"/>
            <path d="M24 20 C20 18 14 20 10 24" stroke="#D4A853" strokeWidth="0.7" strokeLinecap="round"/>
            <path d="M24 28 C20 26 13 28 8 33" stroke="#D4A853" strokeWidth="0.7" strokeLinecap="round"/>
            <path d="M24 36 C21 34 16 36 12 40" stroke="#D4A853" strokeWidth="0.7" strokeLinecap="round"/>
            <path d="M24 20 C28 18 34 20 38 24" stroke="#D4A853" strokeWidth="0.7" strokeLinecap="round"/>
            <path d="M24 28 C28 26 35 28 40 33" stroke="#D4A853" strokeWidth="0.7" strokeLinecap="round"/>
            <path d="M24 36 C27 34 32 36 36 40" stroke="#D4A853" strokeWidth="0.7" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Eyebrow */}
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8B6914', marginBottom: 14, marginTop: 0 }}>
          Uma jornada sobre inteligência artificial
        </p>

        {/* Título */}
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 64, fontWeight: 800, lineHeight: 1.05, color: '#3A3228', margin: '0 0 14px' }}>
          Jornada <span style={{ color: '#D4A853' }}>IA</span>
        </h1>

        {/* Subtítulo */}
        <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 18, color: '#6B5C4E', marginBottom: 28, marginTop: 0 }}>
          para executivos que querem mais do que hype
        </p>

        {/* Divisor dourado */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', marginBottom: 28 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #D4A853, transparent)' }} />
          <div style={{ width: 8, height: 8, background: '#D4A853', transform: 'rotate(45deg)', flexShrink: 0 }} />
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #D4A853, transparent)' }} />
        </div>

        {/* Frase com aspas decorativas */}
        <div style={{ marginBottom: 36, padding: '0 8px' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 16, color: '#5C4D3C', lineHeight: 1.75, marginBottom: 10, marginTop: 0 }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 40, color: '#D4A853', lineHeight: 0, verticalAlign: '-14px', marginRight: 2 }}>&ldquo;</span>
            A IA é como uma caixa de chocolates — você nunca sabe o que vai encontrar. Mas quem entende o jogo, escolhe melhor.
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 40, color: '#D4A853', lineHeight: 0, verticalAlign: '-14px', marginLeft: 2 }}>&rdquo;</span>
          </p>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: '#8B7355', letterSpacing: '0.05em', margin: 0 }}>
            — Inspirado em Forrest Gump, 1994
          </p>
        </div>

        {/* Botão Entrar com Google */}
        <button
          onClick={handleGoogleLogin}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 28px',
            background: '#fff9f0',
            border: '2px solid #D4A853',
            borderRadius: 6,
            boxShadow: '3px 3px 0px #8B6914',
            cursor: 'pointer',
            fontFamily: 'var(--font-ui)',
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: '#3A3228',
            transition: 'transform 0.1s ease, box-shadow 0.1s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translate(-1px,-1px)'
            e.currentTarget.style.boxShadow = '4px 4px 0px #8B6914'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translate(0,0)'
            e.currentTarget.style.boxShadow = '3px 3px 0px #8B6914'
          }}
          onMouseDown={e => {
            e.currentTarget.style.transform = 'translate(2px,2px)'
            e.currentTarget.style.boxShadow = '1px 1px 0px #8B6914'
          }}
          onMouseUp={e => {
            e.currentTarget.style.transform = 'translate(-1px,-1px)'
            e.currentTarget.style.boxShadow = '4px 4px 0px #8B6914'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.79h5.39a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.89-1.74 2.98-4.3 2.98-7.31Z" fill="#4285F4"/>
            <path d="M10 20c2.7 0 4.96-.89 6.62-2.41l-3.23-2.5c-.9.6-2.04.96-3.39.96-2.6 0-4.81-1.76-5.6-4.12H1.07v2.58A10 10 0 0 0 10 20Z" fill="#34A853"/>
            <path d="M4.4 11.93A5.95 5.95 0 0 1 4.09 10c0-.67.12-1.32.31-1.93V5.49H1.07A10 10 0 0 0 0 10c0 1.61.39 3.14 1.07 4.51l3.33-2.58Z" fill="#FBBC05"/>
            <path d="M10 3.98c1.47 0 2.79.5 3.83 1.5l2.86-2.86C14.95.99 12.69 0 10 0A10 10 0 0 0 1.07 5.49L4.4 8.07C5.19 5.74 7.4 3.98 10 3.98Z" fill="#EA4335"/>
          </svg>
          Entrar com Google
        </button>
      </div>

      {/* Rodapé fixo */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '16px 24px 22px', background: 'linear-gradient(to top, rgba(245,237,216,0.98) 70%, transparent)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {[0,1,2,3,4,5].map(i => (
              <div
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: i === 0 ? '#D4A853' : 'transparent',
                  border: `1.5px solid ${i === 0 ? '#D4A853' : '#8B6914'}`,
                  opacity: i === 0 ? 1 : 0.4,
                }}
              />
            ))}
          </div>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: '#8B7355', letterSpacing: '0.08em' }}>
            6 fases · 30 desafios
          </span>
        </div>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: '#A89070', letterSpacing: '0.06em', margin: 0 }}>
          Desktop · Gratuito · Sem coleta de dados sensíveis
        </p>
      </div>
    </div>
  )
}
