'use client'

import { useState, useTransition } from 'react'
import { resetUserProgress } from '@/app/actions/reset'

export default function ResetProgressButton({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleConfirm() {
    startTransition(async () => {
      await resetUserProgress(userId)
      window.location.href = '/hub'
    })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
          fontFamily: 'Raleway, system-ui, sans-serif',
          fontSize: 12, color: 'rgba(58,50,40,0.4)',
          textDecoration: 'underline', textUnderlineOffset: 3,
          letterSpacing: '0.04em',
        }}
      >
        Recomeçar do zero
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(58,50,40,0.5)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#FFFDF6',
              border: '1.5px solid #C8B88A',
              borderRadius: 8,
              boxShadow: '6px 6px 0px #C8B88A',
              padding: '36px 40px',
              maxWidth: 420, width: '100%',
            }}
          >
            {/* Título */}
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 22, fontWeight: 800, color: '#3A3228',
              margin: '0 0 14px',
            }}>
              Tem certeza?
            </h2>

            {/* Texto */}
            <p style={{
              fontFamily: "'Lora', Georgia, serif", fontStyle: 'italic',
              fontSize: 14, color: '#8B7355', lineHeight: 1.7,
              margin: '0 0 32px',
            }}>
              Todo o seu progresso, pontuação e certificado serão apagados.
              Essa ação não pode ser desfeita.
            </p>

            {/* Botões */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={handleConfirm}
                disabled={isPending}
                style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '12px 24px',
                  background: '#C0392B', color: '#fff',
                  border: 'none', borderRadius: 4,
                  outline: '3px solid #C0392B', outlineOffset: 3,
                  fontFamily: 'Raleway, system-ui, sans-serif',
                  fontSize: 13, fontWeight: 700, letterSpacing: '0.08em',
                  cursor: isPending ? 'wait' : 'pointer',
                  opacity: isPending ? 0.7 : 1,
                  transition: 'background 0.15s ease, outline-offset 0.1s ease',
                }}
                onMouseEnter={e => {
                  if (isPending) return
                  e.currentTarget.style.background = '#A93226'
                  e.currentTarget.style.outlineOffset = '5px'
                }}
                onMouseLeave={e => {
                  if (isPending) return
                  e.currentTarget.style.background = '#C0392B'
                  e.currentTarget.style.outlineOffset = '3px'
                }}
              >
                {isPending ? 'Apagando...' : 'Sim, apagar tudo'}
              </button>

              <button
                onClick={() => setOpen(false)}
                disabled={isPending}
                style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '12px 22px',
                  background: 'transparent', color: '#5C4D3C',
                  border: '1.5px solid #C8B88A', borderRadius: 4,
                  fontFamily: 'Raleway, system-ui, sans-serif',
                  fontSize: 13, fontWeight: 600, letterSpacing: '0.06em',
                  cursor: isPending ? 'default' : 'pointer',
                  transition: 'border-color 0.15s ease, color 0.15s ease',
                }}
                onMouseEnter={e => {
                  if (isPending) return
                  e.currentTarget.style.borderColor = '#8B6914'
                  e.currentTarget.style.color = '#3A3228'
                }}
                onMouseLeave={e => {
                  if (isPending) return
                  e.currentTarget.style.borderColor = '#C8B88A'
                  e.currentTarget.style.color = '#5C4D3C'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
