/*
  # Create maledivesdreamers table for contact form submissions

  1. New Tables
    - `maledivesdreamers`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `phone` (text, required)
      - `experience` (text, required)
      - `number_of_people` (text, required)
      - `need_gear_rental` (text, required)
      - `gear_rental_quantity` (text, optional)
      - `promo_code` (text, optional)
      - `preferred_date` (text, optional)
      - `message` (text, required)
      - `created_at` (timestamp with timezone, default now())

  2. Security
    - Enable RLS on `maledivesdreamers` table
    - Add policy for public to insert contact submissions
    - Add policy for authenticated users to read submissions (admin access)
*/

CREATE TABLE IF NOT EXISTS maledivesdreamers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  experience text NOT NULL,
  number_of_people text NOT NULL,
  need_gear_rental text NOT NULL,
  gear_rental_quantity text,
  promo_code text,
  preferred_date text,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE maledivesdreamers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact forms"
  ON maledivesdreamers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read submissions"
  ON maledivesdreamers
  FOR SELECT
  TO authenticated
  USING (true);