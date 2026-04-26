'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveAnswer, completePhase } from '@/app/actions/quiz'
import type { Question, Option } from '@/data/questions'

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

  const isLastQuestion = questionNum === totalQuestions

  function getSelectedOption(): Option | null {
    return question.options.find(o => o.letter === selected) ?? null
  }

  function handleSelect(option: Option) {
    if (isRevealed) return
    setSelected(option.letter)
    setPhasePoints(prev => prev + option.points)
    setIsRevealed(true)

    startTransition(async () => {
      await saveAnswer(phaseId, question.id, option.letter, option.points)
    })
  }

  function handleNext() {
    startTransition(async () => {
      if (isLastQuestion) {
        await completePhase(phaseId)
        router.push(`/fase/${phaseId}/resultado`)
      } else {
        router.push(`/fase/${phaseId}/pergunta/${questionNum + 1}`)
      }
    })
  }

  const selectedOption = getSelectedOption()

  return (
    <div style={{ minHeight: '100vh', background: '#F5EDD8', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(245,237,216,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(212,168,83,0.2)', padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>{phase.emoji}</span>
          <div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: '#8B6914' }}>
              {phase.isSurprise ? 'BÔNUS SURPRESA' : `FASE ${phaseId}`}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: '#3A3228' }}>
              {phase.name}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff9f0', border: '1.5px solid #D4A853', borderRadius: 4, padding: '6px 14px' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: '#8B6914', letterSpacing: '0.08em' }}>PONTOS</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: '#3A3228' }}>{phasePoints}</span>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: '#A89070' }}>/ {phase.isSurprise ? 25 : 20}</span>
        </div>
      </header>

      {/* Progress bar */}
      <div style={{ background: 'rgba(245,237,216,0.8)', borderBottom: '1px solid rgba(212,168,83,0.15)', padding: '16px 40px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {Array.from({ length: totalQuestions }, (_, i) => {
            const num = i + 1
            const isCompleted = num < questionNum || (num === questionNum && isRevealed)
            const isCurrent = num === questionNum
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  border: `2px solid ${isCompleted || isCurrent ? '#D4A853' : '#C8B88A'}`,
                  background: isCompleted ? '#D4A853' : isCurrent ? '#fff9f0' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-ui)',
                  fontSize: 12,
                  fontWeight: 700,
                  color: isCompleted ? '#fff' : isCurrent ? '#8B6914' : '#A89070',
                  boxShadow: isCurrent ? '0 0 0 3px rgba(212,168,83,0.25)' : 'none',
                  transition: 'all 0.3s ease',
                }}>
                  {isCompleted ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 7l3 3 6-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : num}
                </div>
                {i < totalQuestions - 1 && (
                  <div style={{ width: 24, height: 2, background: num < questionNum ? '#D4A853' : 'rgba(200,184,138,0.4)' }} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '40px 40px 60px' }}>
        <div style={{ maxWidth: 680, width: '100%' }}>

          {/* Pergunta número */}
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: '#8B6914', marginBottom: 20, marginTop: 0 }}>
            PERGUNTA {questionNum} DE {totalQuestions}
          </p>

          {/* Contexto */}
          <div style={{ background: '#F0F5F7', borderLeft: '3px solid #7B9EA6', borderRadius: '0 4px 4px 0', padding: '14px 18px', marginBottom: 28 }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#4A6B7A', lineHeight: 1.65, margin: 0, fontStyle: 'italic' }}>
              {question.context}
            </p>
          </div>

          {/* Pergunta */}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: '#3A3228', lineHeight: 1.35, marginBottom: 28, marginTop: 0 }}>
            {question.question}
          </h2>

          {/* Opções */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
            {question.options.map((option) => {
              const isSelected = selected === option.letter
              const isDisabled = isRevealed

              return (
                <button
                  key={option.letter}
                  onClick={() => handleSelect(option)}
                  disabled={isDisabled}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 14,
                    padding: '16px 18px',
                    background: isSelected ? '#FFF9F0' : '#FEFCF8',
                    border: `${isSelected ? '2px' : '1.5px'} solid ${isSelected ? '#D4A853' : '#C8B88A'}`,
                    borderRadius: 6,
                    boxShadow: isSelected ? '3px 3px 0px #8B6914' : '2px 2px 0px #C8B88A',
                    cursor: isDisabled ? 'default' : 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'transform 0.1s ease, box-shadow 0.1s ease, border-color 0.15s ease',
                    transform: isSelected ? 'translate(-1px,-1px)' : 'translate(0,0)',
                    opacity: isDisabled && !isSelected ? 0.55 : 1,
                  }}
                  onMouseEnter={e => {
                    if (isDisabled) return
                    e.currentTarget.style.transform = 'translate(-1px,-1px)'
                    e.currentTarget.style.boxShadow = '3px 3px 0px #8B6914'
                    e.currentTarget.style.borderColor = '#D4A853'
                  }}
                  onMouseLeave={e => {
                    if (isDisabled || isSelected) return
                    e.currentTarget.style.transform = 'translate(0,0)'
                    e.currentTarget.style.boxShadow = '2px 2px 0px #C8B88A'
                    e.currentTarget.style.borderColor = '#C8B88A'
                  }}
                >
                  {/* Letter badge */}
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: isSelected ? '#D4A853' : 'transparent',
                    border: `1.5px solid ${isSelected ? '#D4A853' : '#C8B88A'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-ui)',
                    fontSize: 12,
                    fontWeight: 700,
                    color: isSelected ? '#fff' : '#8B7355',
                    flexShrink: 0,
                    marginTop: 1,
                  }}>
                    {option.letter}
                  </div>

                  {/* Text */}
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#3A3228', lineHeight: 1.55, flex: 1 }}>
                    {option.text}
                  </span>

                  {/* Points badge (visible after reveal) */}
                  {isRevealed && isSelected && (
                    <div style={{ flexShrink: 0, background: '#D4A853', borderRadius: 4, padding: '2px 8px', fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '0.06em', marginTop: 4 }}>
                      +{option.points} pts
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Feedback + próxima */}
          {isRevealed && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ background: '#FFFDF5', border: '1.5px solid #D4A853', borderRadius: 6, borderLeft: '4px solid #D4A853', padding: '18px 20px', marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="#D4A853" strokeWidth="1.5"/>
                    <path d="M8 5v4M8 11h.01" stroke="#D4A853" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: '#8B6914' }}>CONTEXTO</span>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#5C4D3C', lineHeight: 1.7, margin: 0 }}>
                  {question.feedback}
                </p>
              </div>

              <button
                onClick={handleNext}
                disabled={isPending}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '14px 28px',
                  background: '#D4A853',
                  border: '2px solid #8B6914',
                  borderRadius: 6,
                  boxShadow: isPending ? '1px 1px 0px #8B6914' : '3px 3px 0px #8B6914',
                  cursor: isPending ? 'wait' : 'pointer',
                  fontFamily: 'var(--font-ui)',
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: '#fff',
                  transform: isPending ? 'translate(2px,2px)' : 'translate(0,0)',
                  transition: 'transform 0.1s ease, box-shadow 0.1s ease',
                }}
                onMouseEnter={e => {
                  if (isPending) return
                  e.currentTarget.style.transform = 'translate(-1px,-1px)'
                  e.currentTarget.style.boxShadow = '4px 4px 0px #8B6914'
                }}
                onMouseLeave={e => {
                  if (isPending) return
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
                {isPending ? 'Salvando...' : isLastQuestion ? 'Ver resultado' : 'Próxima pergunta'}
                {!isPending && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4l4 4-4 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
