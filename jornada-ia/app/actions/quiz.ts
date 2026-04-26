'use server'

import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function saveAnswer(
  phaseId: number,
  questionId: number,
  optionLetter: string,
  pointsEarned: number,
) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase.from('question_answers').upsert(
    { user_id: user.id, phase_id: phaseId, question_id: questionId, option_letter: optionLetter, points_earned: pointsEarned },
    { onConflict: 'user_id,phase_id,question_id' }
  )

  if (error) return { error: error.message }
  return { success: true }
}

export async function completePhase(phaseId: number) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: answers } = await supabase
    .from('question_answers')
    .select('points_earned')
    .eq('user_id', user.id)
    .eq('phase_id', phaseId)

  const totalPoints = answers?.reduce((sum, a) => sum + a.points_earned, 0) ?? 0

  const { error } = await supabase.from('phase_completions').upsert(
    { user_id: user.id, phase_id: phaseId, total_points: totalPoints },
    { onConflict: 'user_id,phase_id' }
  )

  if (error) return { error: error.message }
  return { success: true, totalPoints }
}
