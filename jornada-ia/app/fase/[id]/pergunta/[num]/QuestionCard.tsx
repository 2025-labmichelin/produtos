'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { saveAnswer, completePhase } from '@/app/actions/quiz'
import type { Question, Option } from '@/data/questions'
import { soundClick, soundComplete } from '@/components/game/SoundManager'

interface QuestionCardProps {
  phase: { id: number; name: string; emoji: string; isSurprise?: boolean }
  question: Question
  questionNum: number
  totalQuestions: number
  phaseId: number
  existingAnswer: string | null
  currentPhasePoints: number
}

export default function QuestionCard({
  phase,
  question,
  questionNum,
  totalQuestions,
  phaseId,
  existingAnswer,
  currentPhasePoints,
}: QuestionCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selected, setSelected] = useState<string | null>(existingAnswer)
  const [isRevealed, setIsRevealed] = useState(existingAnswer !== null)
  const [phasePoints, setPhasePoints] = useState(currentPhasePoints)
  const feedbackRef = useRef<HTMLDivElement>(null)

  const isLastQuestion = questionNum === totalQuestions
  const maxPoints = phase.isSurprise ? 25 : 20

  // Progresso: qts perguntas já respondidas (incluindo a atual se revealed)
  const answeredCount = isRevealed ? questionNum : questionNum - 1
  const progressPct = (answeredCount / totalQuestions) * 100

  function handleSelect(option: Option) {
    if (isRevealed) return
    soundClick()
    setSelected(option.letter)
    setPhasePoints(prev => prev + option.points)
    setIsRevealed(true)
    startTransition(async () => {
      await saveAnswer(phaseId, question.id, option.letter, option.points)
    })
  }

  // Scroll suave para o feedback ao revelar
  useEffect(() => {
    if (isRevealed && existingAnswer === null && feedbackRef.current) {
      const timer = setTimeout(() => {
        feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 120)
      return () => clearTimeout(timer)
    }
  }, [isRevealed, existingAnswer])

  function handleNext() {
    startTransition(async () => {
      if (isLastQuestion) {
        soundComplete()
        await completePhase(phaseId)
        router.push(`/fase/${phaseId}/resultado`)
      } else {
        router.push(`/fase/${phaseId}/pergunta/${questionNum + 1}`)
      }
    })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5EDD8', display: 'flex', flexDirection: 'column' }}>

      {/* ── Topbar ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(245,237,216,0.96)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(212,168,83,0.2)',
        height: 60,
        display: 'grid', gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center', padding: '0 40px', gap: 16,
      }}>

        {/* Logo — esquerda */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="22" viewBox="0 0 48 64" fill="none">
            <path d="M24 62C24 62 8 44 6 28C4 12 16 2 24 2C32 2 44 12 42 28C40 44 24 62 24 62Z"
              fill="white" stroke="#D4A853" strokeWidth="2"/>
            <path d="M24 62L24 8" stroke="#8B6914" strokeWidth="1.2" strokeDasharray="3 2"/>
          </svg>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, color: '#3A3228', letterSpacing: '-0.01em' }}>
            Jornada <span style={{ color: '#D4A853' }}>IA</span>
          </span>
        </div>

        {/* Pill da fase — centro */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: '#3A3228', borderRadius: 100,
          padding: '5px 16px 5px 12px',
        }}>
          <span style={{ fontSize: 15, lineHeight: 1 }}>{phase.emoji}</span>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#D4A853' }}>
            {phase.isSurprise ? 'BÔNUS' : `FASE ${phaseId}`}
          </span>
          <span style={{ width: 1, height: 12, background: 'rgba(245,237,216,0.18)', flexShrink: 0 }} />
          <span style={{
            fontFamily: 'var(--font-ui)', fontSize: 11, color: 'rgba(245,237,216,0.65)',
            maxWidth: 160, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
          }}>
            {phase.name}
          </span>
        </div>

        {/* Pontuação — direita */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'baseline', gap: 4,
            background: '#fff9f0', border: '1.5px solid #D4A853',
            borderRadius: 6, padding: '5px 14px',
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: '#3A3228', lineHeight: 1 }}>
              {phasePoints}
            </span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: '#A89070' }}>
              / {maxPoints} pts
            </span>
          </div>
        </div>
      </header>

      {/* ── Barra de progresso ── */}
      <div style={{ background: 'rgba(245,237,216,0.6)', borderBottom: '1px solid rgba(212,168,83,0.1)', padding: '14px 40px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          {/* Texto + dots */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: '#8B6914' }}>
              PERGUNTA {questionNum} DE {totalQuestions}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              {Array.from({ length: totalQuestions }, (_, i) => {
                const n = i + 1
                const isDone = n < questionNum || (n === questionNum && isRevealed)
                const isActive = n === questionNum && !isRevealed
                return (
                  <div
                    key={i}
                    style={{
                      width: isDone ? 10 : isActive ? 12 : 8,
                      height: isDone ? 10 : isActive ? 12 : 8,
                      borderRadius: '50%',
                      background: isDone ? '#D4A853' : 'transparent',
                      border: `${isActive ? 2 : 1.5}px solid ${isDone || isActive ? '#D4A853' : '#C8B88A'}`,
                      boxShadow: isActive ? '0 0 0 3px rgba(212,168,83,0.25)' : 'none',
                      transition: 'all 0.25s ease',
                    }}
                  />
                )
              })}
            </div>
          </div>
          {/* Barra linear */}
          <div style={{ height: 3, background: 'rgba(200,184,138,0.3)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${progressPct}%`,
              background: 'linear-gradient(90deg, #D4A853, #8B6914)',
              borderRadius: 2,
              transition: 'width 0.45s ease',
            }} />
          </div>
        </div>
      </div>

      {/* ── Conteúdo ── */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '36px 40px 80px' }}>
        <div style={{ maxWidth: 680, width: '100%' }}>

          {/* Card da pergunta */}
          <div style={{
            background: '#fff',
            border: '1.5px solid #C8B88A',
            borderRadius: 8,
            boxShadow: '4px 4px 0px #C8B88A',
            overflow: 'hidden',
            marginBottom: 20,
          }}>
            {/* Barra gradiente no topo */}
            <div style={{ height: 5, background: 'linear-gradient(90deg, #D4A853 0%, #8B6914 55%, #3A3228 100%)' }} />

            <div style={{ padding: '28px 32px 32px' }}>

              {/* Badge Q[num] + nome da fase */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
                <div style={{
                  background: '#3A3228', borderRadius: 4,
                  padding: '3px 10px',
                  fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.14em', color: '#D4A853',
                }}>
                  Q{questionNum}
                </div>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: '#8B7355', letterSpacing: '0.07em' }}>
                  {phase.name}
                </span>
              </div>

              {/* Caixa de contexto azul */}
              <div style={{
                background: 'rgba(74,107,138,0.07)',
                borderLeft: '3px solid #4A6B8A',
                borderRadius: '0 4px 4px 0',
                padding: '12px 16px',
                marginBottom: 24,
              }}>
                <p style={{
                  fontFamily: 'var(--font-body)', fontStyle: 'italic',
                  fontSize: 13, color: '#4A6B8A', lineHeight: 1.65, margin: 0,
                }}>
                  {question.context}
                </p>
              </div>

              {/* Pergunta — Playfair Display Bold */}
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700,
                color: '#3A3228', lineHeight: 1.4, margin: '0 0 26px',
              }}>
                {question.question}
              </h2>

              {/* Opções */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {question.options.map((option) => {
                  const isSelected = selected === option.letter
                  const isOther = isRevealed && !isSelected

                  return (
                    <button
                      key={option.letter}
                      onClick={() => handleSelect(option)}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 12,
                        padding: '14px 16px',
                        background: isSelected ? '#FFFBF2' : '#FAFAF7',
                        border: `${isSelected ? 2 : 1.5}px solid ${isSelected ? '#D4A853' : '#D8CDB8'}`,
                        borderRadius: 6,
                        boxShadow: isSelected ? '3px 3px 0px #8B6914' : 'none',
                        cursor: isOther ? 'default' : 'pointer',
                        textAlign: 'left',
                        width: '100%',
                        opacity: isOther ? 0.45 : 1,
                        pointerEvents: isOther ? 'none' : 'auto',
                        transform: isSelected ? 'translate(-1px, -1px)' : 'translate(0, 0)',
                        transition: 'opacity 0.2s ease, border-color 0.12s ease, box-shadow 0.12s ease, transform 0.1s ease',
                      }}
                      onMouseEnter={e => {
                        if (isRevealed) return
                        e.currentTarget.style.borderColor = '#D4A853'
                        e.currentTarget.style.boxShadow = '2px 2px 0px #C8B88A'
                        e.currentTarget.style.transform = 'translate(-1px, -1px)'
                      }}
                      onMouseLeave={e => {
                        if (isRevealed) return
                        e.currentTarget.style.borderColor = '#D8CDB8'
                        e.currentTarget.style.boxShadow = 'none'
                        e.currentTarget.style.transform = 'translate(0, 0)'
                      }}
                    >
                      {/* Badge da letra */}
                      <div style={{
                        width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                        background: isSelected ? '#D4A853' : 'transparent',
                        border: `1.5px solid ${isSelected ? '#D4A853' : '#C8B88A'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700,
                        color: isSelected ? '#fff' : '#8B7355',
                        marginTop: 2, transition: 'all 0.15s ease',
                      }}>
                        {option.letter}
                      </div>

                      {/* Texto da opção */}
                      <span style={{
                        fontFamily: 'var(--font-body)', fontSize: 14,
                        color: '#3A3228', lineHeight: 1.55, flex: 1, paddingTop: 3,
                      }}>
                        {option.text}
                      </span>

                      {/* +N pts (só na selecionada após reveal) */}
                      {isRevealed && isSelected && (
                        <div style={{
                          flexShrink: 0, alignSelf: 'center',
                          background: '#D4A853', borderRadius: 4,
                          padding: '2px 8px',
                          fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700,
                          color: '#fff', letterSpacing: '0.06em',
                        }}>
                          +{option.points}pts
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── Feedback + botão próxima ── */}
          {isRevealed && (
            <div ref={feedbackRef} style={{ animation: 'fadeSlideIn 0.35s ease both' }}>

              {/* Caixa de feedback */}
              <div style={{
                background: '#FFFDF6',
                borderLeft: '4px solid #D4A853',
                border: '1.5px solid rgba(212,168,83,0.45)',
                borderRadius: '0 6px 6px 0',
                padding: '16px 20px',
                marginBottom: 22,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6.25" stroke="#8B6914" strokeWidth="1.25"/>
                    <path d="M7 4.5v3.5M7 9.5h.01" stroke="#8B6914" strokeWidth="1.25" strokeLinecap="round"/>
                  </svg>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: '#8B6914' }}>
                    SABIA DISSO?
                  </span>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#5C4D3C', lineHeight: 1.7, margin: 0 }}>
                  {question.feedback}
                </p>
              </div>

              {/* Botão próxima / ver resultado */}
              <button
                onClick={handleNext}
                disabled={isPending}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '13px 26px',
                  background: '#3A3228',
                  color: '#F5EDD8',
                  border: 'none',
                  borderRadius: 4,
                  outline: '3px solid #3A3228',
                  outlineOffset: '3px',
                  cursor: isPending ? 'wait' : 'pointer',
                  fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 700,
                  letterSpacing: '0.07em',
                  opacity: isPending ? 0.7 : 1,
                  transition: 'background 0.15s ease, outline-offset 0.1s ease, opacity 0.15s ease',
                }}
                onMouseEnter={e => {
                  if (isPending) return
                  e.currentTarget.style.background = '#5C4D3C'
                  e.currentTarget.style.outlineOffset = '5px'
                }}
                onMouseLeave={e => {
                  if (isPending) return
                  e.currentTarget.style.background = '#3A3228'
                  e.currentTarget.style.outlineOffset = '3px'
                }}
                onMouseDown={e => { e.currentTarget.style.outlineOffset = '1px' }}
                onMouseUp={e => { e.currentTarget.style.outlineOffset = '3px' }}
              >
                {isPending
                  ? 'Salvando...'
                  : isLastQuestion
                    ? 'Ver resultado →'
                    : 'Próxima pergunta →'}
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
