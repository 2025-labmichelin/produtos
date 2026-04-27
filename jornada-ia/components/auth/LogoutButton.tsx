'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { createClient } from '@/lib/supabase'

export default function LogoutButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleLogout() {
    startTransition(async () => {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/')
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      title="Sair"
      style={{
        background: 'transparent',
        border: '1.5px solid rgba(139,105,20,0.3)',
        borderRadius: 4,
        padding: '5px 10px',
        fontFamily: 'var(--font-ui)',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.08em',
        color: '#8B7355',
        cursor: isPending ? 'wait' : 'pointer',
        opacity: isPending ? 0.5 : 1,
        transition: 'border-color 0.15s, color 0.15s',
        display: 'flex',
        alignItems: 'center',
        gap: 5,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(139,105,20,0.6)'
        e.currentTarget.style.color = '#3A3228'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(139,105,20,0.3)'
        e.currentTarget.style.color = '#8B7355'
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M4.5 2H2.5C2.22 2 2 2.22 2 2.5v7c0 .28.22.5.5.5H4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M7.5 4L10 6l-2.5 2M10 6H4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {isPending ? '...' : 'Sair'}
    </button>
  )
}
