/*
  # Create contact submissions table

  1. New Tables
    - `contact_submissions`
      - `id` (bigint, primary key, auto-increment)
      - `name` (text, required)
      - `email` (text, required)
      - `phone_number` (text, optional)
      - `certification_level` (text, required)
      - `number_of_people` (integer, required)
      - `needs_gear` (boolean, required)
      - `preferred_date` (timestamptz, required)
      - `promo_code` (text, optional)
      - `message` (text, optional)
      - `created_at` (timestamptz, default now())
      - `created_by` (uuid, optional, references auth.users)

  2. Security
    - Enable RLS on `contact_submissions` table
    - Add policy for anonymous and authenticated users to insert submissions
    - Add policy for authenticated users to read submissions
    - Add policy for authenticated users to update their own submissions

  3. Indexes
    - Add index on email for faster lookups
*/

CREATE SEQUENCE IF NOT EXISTS contact_submissions_id_seq;

CREATE TABLE IF NOT EXISTS contact_submissions (
  id bigint PRIMARY KEY DEFAULT nextval('contact_submissions_id_seq'),
  name text NOT NULL,
  email text NOT NULL,
  phone_number text,
  certification_level text NOT NULL,
  number_of_people integer NOT NULL,
  needs_gear boolean NOT NULL,
  preferred_date timestamptz NOT NULL,
  promo_code text,
  message text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can insert submissions"
  ON contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update their own submissions"
  ON contact_submissions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions USING btree (email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions USING btree (created_at);