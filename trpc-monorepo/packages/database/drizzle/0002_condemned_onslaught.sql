ALTER TABLE "forms"
  ALTER COLUMN "description" TYPE varchar(300),
  ALTER COLUMN "created_by" TYPE uuid USING "created_by"::uuid;