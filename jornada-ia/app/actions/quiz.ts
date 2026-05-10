'use server'

import { createServerSupabaseClient } from '@/lib/supabase-server'
import { getQuestion, phases } from '@/data/questions'

const VALID_PHASE_IDS = new Set(phases.map(p => p.id))
const VALID_LETTERS   = new Set(['A', 'B', 'C', 'D'])
const SURPRISE_ID     = phases.find(p => p.isSurprise)?.id ?? 7
const MAIN_PHASE_IDS  = phases.filter(p => !p.isSurprise).map(p => p.id)

async function assertPhaseAccess(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  userId: string,
  phaseId: number,
): Promise<string | null> {
  if (phaseId === 1) return null

  if (phaseId === SURPRISE_ID) {
    const { data } = await supabase
      .from('phase_completions')
      .select('phase_id')
      .eq('user_id', userId)
      .in('phase_id', MAIN_PHASE_IDS)

    const completed = new Set(data?.map(c => c.phase_id) ?? [])
    if (!MAIN_PHASE_IDS.every(id => completed.has(id)))
      return 'Complete todas as fases principais antes da fase bônus'
    return null
  }

  const prevId = phaseId - 1
  const { data } = await supabase
    .from('phase_completions')
    .select('phase_id')
    .eq('user_id', userId)
    .eq('phase_id', prevId)
    .maybeSingle()

  if (!data) return `Complete a fase ${prevId} antes de continuar`
  return null
}

export async function saveAnswer(
  phaseId: number,
  questionId: number,
  optionLetter: string,
) {
  if (!VALID_PHASE_IDS.has(phaseId))     return { error: 'Fase inválida' }
  if (!VALID_LETTERS.has(optionLetter))  return { error: 'Opção inválida' }

  const question = getQuestion(phaseId, questionId)
  if (!question) return { error: 'Pergunta inválida' }

  const option = question.options.find(o => o.letter === optionLetter)
  if (!option) return { error: 'Opção inválida' }

  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const accessError = await assertPhaseAccess(supabase, user.id, phaseId)
  if (accessError) return { error: accessError }

  const { error } = await supabase.from('question_answers').upsert(
    {
      user_id:       user.id,
      phase_id:      phaseId,
      question_id:   questionId,
      option_letter: optionLetter,
      points_earned: option.points,
    },
    { onConflict: 'user_id,phase_id,question_id' },
  )

  if (error) return { error: error.message }
  return { success: true }
}

export async function completePhase(phaseId: number) {
  if (!VALID_PHASE_IDS.has(phaseId)) return { error: 'Fase inválida' }

  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const accessError = await assertPhaseAccess(supabase, user.id, phaseId)
  if (accessError) return { error: accessError }

  const { data: answers } = await supabase
    .from('question_answers')
    .select('points_earned')
    .eq('user_id', user.id)
    .eq('phase_id', phaseId)

  const totalPoints = answers?.reduce((sum, a) => sum + (a.points_earned ?? 0), 0) ?? 0

  const { error } = await supabase.from('phase_completions').upsert(
    { user_id: user.id, phase_id: phaseId, total_points: totalPoints },
    { onConflict: 'user_id,phase_id' },
  )

  if (error) return { error: error.message }
  return { success: true, totalPoints }
}
