ALTER TABLE "forms" ADD COLUMN IF NOT EXISTS "allow_multiple_submissions" boolean NOT NULL DEFAULT true;
