ALTER TABLE phase_completions
ADD COLUMN certificate_id uuid DEFAULT gen_random_uuid();

CREATE INDEX idx_certificate_id
ON phase_completions(certificate_id);
