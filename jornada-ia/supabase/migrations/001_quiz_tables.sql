-- Respostas individuais por pergunta
create table if not exists question_answers (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  phase_id      int  not null,
  question_id   int  not null,
  option_letter text not null,
  points_earned int  not null,
  answered_at   timestamptz not null default now(),
  unique (user_id, phase_id, question_id)
);

alter table question_answers enable row level security;

create policy "Users can read own answers"
  on question_answers for select
  using (auth.uid() = user_id);

create policy "Users can insert own answers"
  on question_answers for insert
  with check (auth.uid() = user_id);

create policy "Users can update own answers"
  on question_answers for update
  using (auth.uid() = user_id);

-- Conclusão de fase (uma linha por fase concluída)
create table if not exists phase_completions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  phase_id     int  not null,
  total_points int  not null default 0,
  completed_at timestamptz not null default now(),
  unique (user_id, phase_id)
);

alter table phase_completions enable row level security;

create policy "Users can read own completions"
  on phase_completions for select
  using (auth.uid() = user_id);

create policy "Users can insert own completions"
  on phase_completions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own completions"
  on phase_completions for update
  using (auth.uid() = user_id);

-- Ranking anônimo: leitura pública dos pontos totais
create policy "Anyone can read completions for ranking"
  on phase_completions for select
  using (true);
