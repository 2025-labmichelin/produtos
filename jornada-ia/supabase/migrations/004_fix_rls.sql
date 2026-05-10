-- Remove a policy que permitia leitura pública de phase_completions sem autenticação.
-- A policy "Users can read own completions" (auth.uid() = user_id) já garante
-- acesso correto para o usuário autenticado. O dashboard e a página de certificado
-- usam createAdminClient() (service role), que bypassa RLS — não dependem desta policy.

DROP POLICY IF EXISTS "Anyone can read completions for ranking" ON phase_completions;

-- Garantia: caso alguma policy pública tenha sido criada manualmente em question_answers
DROP POLICY IF EXISTS "Anyone can read answers for ranking" ON question_answers;
DROP POLICY IF EXISTS "Public read" ON phase_completions;
DROP POLICY IF EXISTS "Public read" ON question_answers;
