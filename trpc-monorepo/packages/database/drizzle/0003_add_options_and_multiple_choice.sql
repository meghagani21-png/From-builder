-- Add MULTIPLE_CHOICE value to the field_type_enum
ALTER TYPE "public"."field_type_enum" ADD VALUE IF NOT EXISTS 'MULTIPLE_CHOICE';--> statement-breakpoint

-- Add options column to form_fields (stores array of {label, value} objects as JSON)
ALTER TABLE "form_fields" ADD COLUMN IF NOT EXISTS "options" json;
