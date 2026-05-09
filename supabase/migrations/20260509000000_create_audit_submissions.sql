
-- Create audit_submissions table
CREATE TABLE IF NOT EXISTS public.audit_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  industry TEXT NOT NULL,
  company_size TEXT NOT NULL,
  rating_outreach INTEGER,
  rating_leadgen INTEGER,
  rating_pipeline INTEGER,
  rating_content INTEGER,
  rating_reporting INTEGER,
  total_hrs_saved NUMERIC,
  annual_value INTEGER,
  score INTEGER,
  urgency TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.audit_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public audit form)
CREATE POLICY "Anyone can submit audit"
  ON public.audit_submissions
  FOR INSERT
  WITH CHECK (true);

-- No public read access
CREATE POLICY "No public read access on audits"
  ON public.audit_submissions
  FOR SELECT
  USING (false);
