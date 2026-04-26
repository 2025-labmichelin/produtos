import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { getPhase } from '@/data/questions'
import QuestionCard from './QuestionCard'

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ id: string; num: string }>
}) {
  const { id, num } = await params
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const phaseId = parseInt(id)
  const questionNum = parseInt(num)

  const phase = getPhase(phaseId)
  if (!phase || questionNum < 1 || questionNum > phase.questions.length) {
    redirect('/hub')
  }

  // Verificar se fase está desbloqueada
  if (phaseId > 1) {
    const { data: prev } = await supabase
      .from('phase_completions')
      .select('id')
      .eq('user_id', user.id)
      .eq('phase_id', phaseId - 1)
      .single()
    if (!prev) redirect('/hub')
  }

  // Verificar se fase já foi concluída (não reiniciar)
  const { data: completion } = await supabase
    .from('phase_completions')
    .select('total_points')
    .eq('user_id', user.id)
    .eq('phase_id', phaseId)
    .single()

  if (completion) redirect(`/fase/${phaseId}/resultado`)

  // Verificar resposta existente para esta pergunta
  const { data: existingAnswer } = await supabase
    .from('question_answers')
    .select('option_letter')
    .eq('user_id', user.id)
    .eq('phase_id', phaseId)
    .eq('question_id', questionNum)
    .single()

  // Pontos acumulados nesta fase até aqui
  const { data: phaseAnswers } = await supabase
    .from('question_answers')
    .select('points_earned')
    .eq('user_id', user.id)
    .eq('phase_id', phaseId)

  const currentPhasePoints = phaseAnswers?.reduce((sum, a) => sum + a.points_earned, 0) ?? 0

  const question = phase.questions[questionNum - 1]

  return (
    <QuestionCard
      phase={{ id: phase.id, name: phase.name, emoji: phase.emoji, isSurprise: phase.isSurprise }}
      question={question}
      questionNum={questionNum}
      totalQuestions={phase.questions.length}
      phaseId={phaseId}
      existingAnswer={existingAnswer?.option_letter ?? null}
      currentPhasePoints={currentPhasePoints}
    />
  )
}
