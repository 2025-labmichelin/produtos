'use server'

import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase-server'

export async function resetUserProgress(userId: string) {
  // Verifica que o chamador só pode resetar o próprio progresso
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.id !== userId) return { error: 'Unauthorized' }

  const admin = createAdminClient()

  await admin.from('question_answers').delete().eq('user_id', userId)
  await admin.from('phase_completions').delete().eq('user_id', userId)

  return { success: true }
}
