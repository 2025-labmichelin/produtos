'use client'

import { useEffect, useRef } from 'react'

// Lerp factor — valor menor = delay maior (movimento mais suave e lento)
const LERP = 0.10

// Tags que restauram o cursor nativo
const NATIVE_CURSOR_TAGS = new Set(['input', 'textarea', 'select', 'button', 'a'])

function isNativeCursorTarget(el: Element | null): boolean {
  if (!el) return false
  const tag = el.tagName.toLowerCase()
  if (NATIVE_CURSOR_TAGS.has(tag)) return true
  // Sobe a árvore para pegar botões/links que contêm outros elementos
  if (
    el.closest('button') ||
    el.closest('a') ||
    el.closest('[role="button"]') ||
    el.closest('label')
  ) return true
  return false
}

export default function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null)
  const cur  = useRef({ x: -200, y: -200 })
  const tgt  = useRef({ x: -200, y: -200 })
  const raf  = useRef<number>(0)

  useEffect(() => {
    // Não ativa em touch screens
    if (window.matchMedia('(pointer: coarse)').matches) return

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t
    }

    // Offset para que a ponta do tênis fique no cursor
    // SVG 48×30: toe tip ≈ x=45, y=24
    const HOT_X = 45
    const HOT_Y = 24

    function tick() {
      cur.current.x = lerp(cur.current.x, tgt.current.x, LERP)
      cur.current.y = lerp(cur.current.y, tgt.current.y, LERP)

      if (ref.current) {
        ref.current.style.transform =
          `translate(${cur.current.x - HOT_X}px, ${cur.current.y - HOT_Y}px)`
      }

      raf.current = requestAnimationFrame(tick)
    }

    function onMove(e: MouseEvent) {
      tgt.current = { x: e.clientX, y: e.clientY }

      const native = isNativeCursorTarget(e.target as Element)

      if (native) {
        // Mostra cursor nativo, esconde o custom
        document.body.classList.remove('custom-cursor-active')
        if (ref.current) ref.current.style.opacity = '0'
      } else {
        document.body.classList.add('custom-cursor-active')
        if (ref.current) ref.current.style.opacity = '1'
      }
    }

    function onLeave() {
      if (ref.current) ref.current.style.opacity = '0'
    }

    function onEnter() {
      document.body.classList.add('custom-cursor-active')
    }

    document.body.classList.add('custom-cursor-active')
    window.addEventListener('mousemove', onMove)
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)
    raf.current = requestAnimationFrame(tick)

    return () => {
      document.body.classList.remove('custom-cursor-active')
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseenter', onEnter)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 99999,
        opacity: 0,
        transition: 'opacity 0.15s ease',
        willChange: 'transform',
        userSelect: 'none',
      }}
    >
      {/* Tênis esboço — SVG 48×30, toe tip em x≈45, y≈24 */}
      <svg
        width="48"
        height="30"
        viewBox="0 0 48 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── Sola ── */}
        <path
          d="M4 23 L43 23 Q47 23 47 27 L3 27 Q1 27 1 25 Q1 23 4 23 Z"
          fill="#F5EDD8"
          stroke="#3A3228"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />

        {/* ── Corpo do tênis (upper) ── */}
        <path
          d="M4 23 Q5 18 8 14 Q12 9 18 7 L27 7 Q33 7 37 12 Q41 16 43 23"
          fill="white"
          stroke="#3A3228"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* ── Calcanhar (heel counter) ── */}
        <path
          d="M8 14 Q5 10 6 6 Q8 5 9 7 Q9 11 11 14"
          fill="#F0E8D6"
          stroke="#3A3228"
          strokeWidth="0.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* ── Língua (tongue) ── */}
        <path
          d="M18 7 Q19 2 21 1 Q23 2 23 7"
          stroke="#3A3228"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* ── Cadarços (laces) — 3 linhas ── */}
        <line x1="18.5" y1="9.5"  x2="23.5" y2="9.5"  stroke="#3A3228" strokeWidth="0.75" strokeLinecap="round"/>
        <line x1="18.5" y1="11.5" x2="23.5" y2="11.5" stroke="#3A3228" strokeWidth="0.75" strokeLinecap="round"/>
        <line x1="18.5" y1="13.5" x2="23.5" y2="13.5" stroke="#3A3228" strokeWidth="0.75" strokeLinecap="round"/>

        {/* ── Faixa lateral dourada (brand stripe) ── */}
        <path
          d="M13 19 Q23 15 36 18"
          stroke="#D4A853"
          strokeWidth="1.4"
          strokeLinecap="round"
        />

        {/* ── Ponta do bico (toe box detail) ── */}
        <path
          d="M35 13 Q40 16 43 22"
          stroke="#3A3228"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeDasharray="2 1.5"
        />

        {/* ── Costura da sola ── */}
        <line x1="4" y1="25" x2="43" y2="25" stroke="#C8B88A" strokeWidth="0.6" strokeLinecap="round"/>
      </svg>
    </div>
  )
}
