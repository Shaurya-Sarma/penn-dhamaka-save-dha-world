-- Create impact_counters table to store global counters
-- This table stores a single row with all impact counters that persist across all users

CREATE TABLE IF NOT EXISTS public.impact_counters (
  id TEXT PRIMARY KEY DEFAULT 'global',
  trees_planted INTEGER NOT NULL DEFAULT 0,
  messages_sent INTEGER NOT NULL DEFAULT 0,
  shares INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the initial row
INSERT INTO public.impact_counters (id, trees_planted, messages_sent, shares)
VALUES ('global', 0, 0, 0)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS but allow public read/write for this global counter
ALTER TABLE public.impact_counters ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the counters
CREATE POLICY "Allow public read" ON public.impact_counters
  FOR SELECT USING (true);

-- Allow anyone to update the counters (for incrementing)
CREATE POLICY "Allow public update" ON public.impact_counters
  FOR UPDATE USING (true);

-- Allow inserts for upsert operations  
CREATE POLICY "Allow public insert" ON public.impact_counters
  FOR INSERT WITH CHECK (true);
