'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Helpers públicos — chamados em qualquer Client Component
// ─────────────────────────────────────────────────────────────────────────────

type SoundType = 'click' | 'complete' | 'unlock'

function emit(type: SoundType) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('jornada:sound', { detail: type }))
  }
}

export const soundClick    = () => emit('click')
export const soundComplete = () => emit('complete')
export const soundUnlock   = () => emit('unlock')

// ─────────────────────────────────────────────────────────────────────────────
// SoundOnMount — dropa em Server Component pages para disparar som ao carregar
// ─────────────────────────────────────────────────────────────────────────────

export function SoundOnMount({ type }: { type: SoundType }) {
  useEffect(() => { emit(type) }, [type])
  return null
}

// ─────────────────────────────────────────────────────────────────────────────
// Sintetizadores Web Audio API
// ─────────────────────────────────────────────────────────────────────────────

function synthClick(ac: AudioContext) {
  // Pop suave: sine curto com pitch descendo
  const osc  = ac.createOscillator()
  const gain = ac.createGain()
  osc.connect(gain)
  gain.connect(ac.destination)
  osc.type = 'sine'
  osc.frequency.setValueAtTime(720, ac.currentTime)
  osc.frequency.exponentialRampToValueAtTime(360, ac.currentTime + 0.055)
  gain.gain.setValueAtTime(0.16, ac.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.075)
  osc.start(ac.currentTime)
  osc.stop(ac.currentTime + 0.085)
}

function synthComplete(ac: AudioContext) {
  // Fanfarra: C5→E5→G5→C6 com sustain final
  const notes  = [523.25, 659.25, 783.99, 1046.50]
  const shapes = ['triangle', 'triangle', 'triangle', 'sine'] as const
  const vols   = [0.18, 0.18, 0.20, 0.25]
  const lens   = [0.13, 0.13, 0.13, 0.42]
  notes.forEach((freq, i) => {
    const osc  = ac.createOscillator()
    const gain = ac.createGain()
    osc.connect(gain)
    gain.connect(ac.destination)
    osc.type = shapes[i]
    osc.frequency.value = freq
    const t = ac.currentTime + i * 0.105
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(vols[i], t + 0.022)
    gain.gain.exponentialRampToValueAtTime(0.001, t + lens[i])
    osc.start(t)
    osc.stop(t + lens[i] + 0.02)
  })
}

function synthUnlock(ac: AudioContext) {
  // Cintilado ascendente: pentatônica C5→C6 rápida
  const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]
  notes.forEach((freq, i) => {
    const osc  = ac.createOscillator()
    const gain = ac.createGain()
    osc.connect(gain)
    gain.connect(ac.destination)
    osc.type = 'sine'
    osc.frequency.value = freq
    const t = ac.currentTime + i * 0.072
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(0.13, t + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24)
    osc.start(t)
    osc.stop(t + 0.26)
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Botão de mute flutuante
// ─────────────────────────────────────────────────────────────────────────────

function MuteButton({ muted, onToggle }: { muted: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label={muted ? 'Ativar sons' : 'Silenciar sons'}
      title={muted ? 'Ativar sons' : 'Silenciar sons'}
      style={{
        position: 'fixed',
        bottom: 28,
        right: 28,
        zIndex: 9998,
        width: 42,
        height: 42,
        borderRadius: '50%',
        background: 'rgba(58,50,40,0.88)',
        border: '1.5px solid #D4A853',
        boxShadow: '2px 2px 0px #8B6914',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(6px)',
        outline: 'none',
        transition: 'transform 0.1s ease, box-shadow 0.1s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translate(-1px,-1px)'
        e.currentTarget.style.boxShadow = '3px 3px 0px #8B6914'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translate(0,0)'
        e.currentTarget.style.boxShadow = '2px 2px 0px #8B6914'
      }}
      onMouseDown={e => {
        e.currentTarget.style.transform = 'translate(1px,1px)'
        e.currentTarget.style.boxShadow = '1px 1px 0px #8B6914'
      }}
      onMouseUp={e => {
        e.currentTarget.style.transform = 'translate(-1px,-1px)'
        e.currentTarget.style.boxShadow = '3px 3px 0px #8B6914'
      }}
    >
      {muted ? <IconMuted /> : <IconSound />}
    </button>
  )
}

function IconSound() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M11 5 6 9H2v6h4l5 4V5Z" fill="#D4A853"/>
      <path
        d="M15.54 8.46a5 5 0 0 1 0 7.07"
        stroke="#D4A853" strokeWidth="1.6" strokeLinecap="round"
      />
      <path
        d="M19.07 4.93a10 10 0 0 1 0 14.14"
        stroke="#D4A853" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.4"
      />
    </svg>
  )
}

function IconMuted() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M11 5 6 9H2v6h4l5 4V5Z" fill="rgba(212,168,83,0.35)"/>
      <path d="M23 9l-6 6M17 9l6 6" stroke="#D4A853" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SoundManager — componente global adicionado ao layout
// ─────────────────────────────────────────────────────────────────────────────

export default function SoundManager() {
  const [muted, setMuted] = useState(false)
  const mutedRef = useRef(false)
  const acRef    = useRef<AudioContext | null>(null)

  // Restaurar preferência de mute
  useEffect(() => {
    if (localStorage.getItem('jornada-muted') === 'true') {
      mutedRef.current = true
      setMuted(true)
    }
  }, [])

  const getAC = useCallback((): AudioContext | null => {
    try {
      if (!acRef.current) {
        acRef.current = new (
          window.AudioContext ??
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        )()
      }
      if (acRef.current.state === 'suspended') void acRef.current.resume()
      return acRef.current
    } catch {
      return null
    }
  }, [])

  // Ouvir eventos de som
  useEffect(() => {
    function onSound(e: Event) {
      if (mutedRef.current) return
      const type = (e as CustomEvent<SoundType>).detail
      const ac = getAC()
      if (!ac) return
      try {
        if (type === 'click')    synthClick(ac)
        if (type === 'complete') synthComplete(ac)
        if (type === 'unlock')   synthUnlock(ac)
      } catch { /* Web Audio não suportado */ }
    }
    window.addEventListener('jornada:sound', onSound)
    return () => window.removeEventListener('jornada:sound', onSound)
  }, [getAC])

  function toggle() {
    const next = !mutedRef.current
    mutedRef.current = next
    setMuted(next)
    localStorage.setItem('jornada-muted', String(next))
  }

  return <MuteButton muted={muted} onToggle={toggle} />
}
