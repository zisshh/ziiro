-- Route public form submissions through Edge Functions only.
-- The service role used by the functions bypasses RLS; anon clients should not insert directly.

DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
DROP POLICY IF EXISTS "Anyone can submit audit" ON public.audit_submissions;

ALTER TABLE public.audit_submissions
  ADD CONSTRAINT audit_submissions_company_size_check
    CHECK (company_size IN ('1-5', '6-20', '21-50', '51-200', '200+')),
  ADD CONSTRAINT audit_submissions_industry_check
    CHECK (industry IN (
      'SaaS / Software',
      'Startup',
      'Solo Founder',
      'Founder-led Agency',
      'Consulting / Professional Services',
      'Creator-led Business',
      'Community / Education',
      'AI-first Service Business',
      'Other'
    )) NOT VALID,
  ADD CONSTRAINT audit_submissions_rating_outreach_check
    CHECK (rating_outreach IS NULL OR rating_outreach BETWEEN 1 AND 5),
  ADD CONSTRAINT audit_submissions_rating_leadgen_check
    CHECK (rating_leadgen IS NULL OR rating_leadgen BETWEEN 1 AND 5),
  ADD CONSTRAINT audit_submissions_rating_pipeline_check
    CHECK (rating_pipeline IS NULL OR rating_pipeline BETWEEN 1 AND 5),
  ADD CONSTRAINT audit_submissions_rating_content_check
    CHECK (rating_content IS NULL OR rating_content BETWEEN 1 AND 5),
  ADD CONSTRAINT audit_submissions_rating_reporting_check
    CHECK (rating_reporting IS NULL OR rating_reporting BETWEEN 1 AND 5),
  ADD CONSTRAINT audit_submissions_score_check
    CHECK (score IS NULL OR score BETWEEN 0 AND 100);
