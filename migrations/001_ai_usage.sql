-- Per-user daily AI usage. The route increments call_count and token totals
-- with INSERT ... ON CONFLICT (user_id, usage_date) DO UPDATE ... RETURNING,
-- so the rate limit holds across Fly machine restarts.
CREATE TABLE IF NOT EXISTS ai_usage (
  user_id       INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  usage_date    DATE    NOT NULL DEFAULT CURRENT_DATE,
  call_count    INTEGER NOT NULL DEFAULT 0,
  input_tokens  INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, usage_date)
);
