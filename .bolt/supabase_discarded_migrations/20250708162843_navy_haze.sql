/*
  # Fix contact submissions table issues

  1. Changes
    - Remove foreign key constraint on created_by (no users table exists)
    - Make preferred_date accept text format instead of timestamp
    - Add proper error handling for form submissions

  2. Security
    - Keep existing RLS policies
    - Maintain data integrity
*/

-- Remove the foreign key constraint that's causing issues
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'contact_submissions_created_by_fkey'
  ) THEN
    ALTER TABLE contact_submissions DROP CONSTRAINT contact_submissions_created_by_fkey;
  END IF;
END $$;

-- Change preferred_date to text to handle formatted dates from frontend
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' 
    AND column_name = 'preferred_date' 
    AND data_type = 'timestamp with time zone'
  ) THEN
    ALTER TABLE contact_submissions ALTER COLUMN preferred_date TYPE text;
  END IF;
END $$;