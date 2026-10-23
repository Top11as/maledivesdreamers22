/*
  # Fix preferred_date column type mismatch

  1. Changes
    - Change preferred_date from timestamptz to text to match frontend expectations
    - Remove problematic foreign key constraint
    - Ensure all required fields are properly set

  2. Security
    - Maintain existing RLS policies
*/

-- Change preferred_date to text type to match frontend
ALTER TABLE contact_submissions ALTER COLUMN preferred_date TYPE text;

-- Remove foreign key constraint that might be causing issues
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

-- Make created_by nullable since we're not using auth for anonymous submissions
ALTER TABLE contact_submissions ALTER COLUMN created_by DROP NOT NULL;

-- Ensure all required columns are properly set
ALTER TABLE contact_submissions ALTER COLUMN name SET NOT NULL;
ALTER TABLE contact_submissions ALTER COLUMN email SET NOT NULL;
ALTER TABLE contact_submissions ALTER COLUMN certification_level SET NOT NULL;
ALTER TABLE contact_submissions ALTER COLUMN number_of_people SET NOT NULL;
ALTER TABLE contact_submissions ALTER COLUMN needs_gear SET NOT NULL;
ALTER TABLE contact_submissions ALTER COLUMN preferred_date SET NOT NULL;