/*
  # Fix contact submissions table issues

  1. Changes
    - Ensure preferred_date is text type (not timestamp)
    - Remove foreign key constraint that might be causing issues
    - Add proper indexes
    - Ensure all columns match frontend expectations

  2. Security
    - Keep existing RLS policies
*/

-- Ensure preferred_date is text type
ALTER TABLE contact_submissions ALTER COLUMN preferred_date TYPE text;

-- Remove foreign key constraint if it exists (it's causing issues)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'contact_submissions_created_by_fkey'
    AND table_name = 'contact_submissions'
  ) THEN
    ALTER TABLE contact_submissions DROP CONSTRAINT contact_submissions_created_by_fkey;
  END IF;
END $$;

-- Make created_by nullable and remove the foreign key reference
ALTER TABLE contact_submissions ALTER COLUMN created_by DROP NOT NULL;

-- Ensure all required columns have proper constraints
ALTER TABLE contact_submissions ALTER COLUMN name SET NOT NULL;
ALTER TABLE contact_submissions ALTER COLUMN email SET NOT NULL;
ALTER TABLE contact_submissions ALTER COLUMN certification_level SET NOT NULL;
ALTER TABLE contact_submissions ALTER COLUMN number_of_people SET NOT NULL;
ALTER TABLE contact_submissions ALTER COLUMN needs_gear SET NOT NULL;
ALTER TABLE contact_submissions ALTER COLUMN preferred_date SET NOT NULL;

-- Ensure indexes exist
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions (email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions (created_at);