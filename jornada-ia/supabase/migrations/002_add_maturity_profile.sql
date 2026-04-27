alter table phase_completions
  add column if not exists maturity_profile text;
