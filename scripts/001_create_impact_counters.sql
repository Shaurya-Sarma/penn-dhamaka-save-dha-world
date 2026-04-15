-- Create impact_counters table to store global counters
-- This table stores a single row with all impact counters that persist across all users

CREATE TABLE IF NOT EXISTS public.impact_counters (
  id INTEGER PRIMARY KEY DEFAULT 1,
  trees INTEGER NOT NULL DEFAULT 0,
  messages INTEGER NOT NULL DEFAULT 0,
  shares INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert the initial row
INSERT INTO public.impact_counters (id, trees, messages, shares)
VALUES (1, 0, 0, 0)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS but allow public read/write for this global counter
ALTER TABLE public.impact_counters ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the counters
CREATE POLICY "Allow public read" ON public.impact_counters
  FOR SELECT USING (true);

-- Allow anyone to update the counters (for incrementing)
CREATE POLICY "Allow public update" ON public.impact_counters
  FOR UPDATE USING (true);
