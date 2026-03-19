-- Create waitlist table for storing form submissions
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  local_bab TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  instagram TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public waitlist form)
CREATE POLICY "Allow public insert" ON waitlist
  FOR INSERT
  WITH CHECK (true);

-- Only service role can read (for admin access via Supabase dashboard)
CREATE POLICY "Allow service role to read" ON waitlist
  FOR SELECT
  USING (auth.role() = 'service_role');
