import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY is not configured');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { name, email, industry, size, ratings, score, urgency, savings, roi, topAreas } = await req.json();

    // Save to database (best-effort)
    try {
      await supabase.from('audit_submissions').insert({
        name, email, industry,
        company_size: size,
        rating_outreach: ratings.outreach || null,
        rating_leadgen: ratings.leadgen || null,
        rating_pipeline: ratings.pipeline || null,
        rating_content: ratings.content || null,
        rating_reporting: ratings.reporting || null,
        score,
        urgency,
      });
    } catch (dbErr) {
      console.error('DB insert error:', dbErr);
    }

    const fromAddress = 'Ziiro AI <onboarding@resend.dev>';

    const ratingsRows = Object.entries(ratings)
      .map(([key, val], i) => `
        <tr style="${i % 2 === 0 ? 'background:#f4f4f4;' : ''}">
          <td style="padding:10px;border:1px solid #ddd;font-weight:bold;text-transform:capitalize;">${key}</td>
          <td style="padding:10px;border:1px solid #ddd;">${val} / 5</td>
        </tr>`)
      .join('');

    const teamHtml = `
      <div style="font-family:sans-serif;max-width:640px;margin:0 auto;color:#333;">
        <h2 style="color:#111;border-bottom:2px solid #eee;padding-bottom:12px;">
          🧠 New AI Readiness Audit Submission
        </h2>

        <h3 style="color:#555;margin-top:24px;">Submitter Details</h3>
        <table style="border-collapse:collapse;width:100%;margin-bottom:20px;">
          <tr style="background:#f4f4f4;"><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Name</td><td style="padding:10px;border:1px solid #ddd;">${name}</td></tr>
          <tr><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Email</td><td style="padding:10px;border:1px solid #ddd;">${email}</td></tr>
          <tr style="background:#f4f4f4;"><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Industry</td><td style="padding:10px;border:1px solid #ddd;">${industry}</td></tr>
          <tr><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Team Size</td><td style="padding:10px;border:1px solid #ddd;">${size} employees</td></tr>
        </table>

        <h3 style="color:#555;margin-top:24px;">Audit Results</h3>
        <table style="border-collapse:collapse;width:100%;margin-bottom:20px;">
          <tr style="background:#f4f4f4;"><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Automation Gap Score</td><td style="padding:10px;border:1px solid #ddd;font-size:1.2em;font-weight:bold;">${score} / 100</td></tr>
          <tr><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Priority Level</td><td style="padding:10px;border:1px solid #ddd;">${urgency}</td></tr>
          <tr style="background:#f4f4f4;"><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Est. Weekly Time Saved</td><td style="padding:10px;border:1px solid #ddd;">${savings}</td></tr>
          <tr><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Projected 90-day ROI</td><td style="padding:10px;border:1px solid #ddd;">${roi}</td></tr>
          <tr style="background:#f4f4f4;"><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Top Pain Areas</td><td style="padding:10px;border:1px solid #ddd;">${topAreas.join(', ')}</td></tr>
        </table>

        <h3 style="color:#555;margin-top:24px;">Individual Pain Ratings (1–5)</h3>
        <table style="border-collapse:collapse;width:100%;margin-bottom:20px;">
          ${ratingsRows}
        </table>

        <p style="color:#888;font-size:0.85em;border-top:1px solid #eee;padding-top:12px;">
          This lead has completed the AI Readiness Audit on ziiro.work and been shown the Calendly booking widget.
        </p>
      </div>
    `;

    const confirmHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#333;">
        <h2 style="color:#111;">Your AI Readiness Audit Results, ${name}!</h2>
        <p>Thanks for completing the audit. Here's a summary of your results:</p>

        <table style="border-collapse:collapse;width:100%;margin:16px 0;">
          <tr style="background:#f4f4f4;"><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Automation Gap Score</td><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">${score} / 100</td></tr>
          <tr><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Priority</td><td style="padding:10px;border:1px solid #ddd;">${urgency}</td></tr>
          <tr style="background:#f4f4f4;"><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Weekly Time Savings</td><td style="padding:10px;border:1px solid #ddd;">${savings}</td></tr>
          <tr><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Projected ROI</td><td style="padding:10px;border:1px solid #ddd;">${roi}</td></tr>
        </table>

        <p>Your biggest opportunities are in: <strong>${topAreas.slice(0, 2).join(' and ')}</strong>.</p>
        <p>Book a free 30-minute strategy call to see exactly how we automate this for you:</p>
        <p><a href="https://calendly.com/ziiro-work/30min" style="background:#111;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">Book Your Free Call →</a></p>

        <p style="margin-top:24px;color:#888;">Have questions? Reply to this email or reach us at <a href="mailto:govind@ziiro.work">govind@ziiro.work</a></p>
        <p><strong>The Ziiro Team</strong></p>
      </div>
    `;

    await Promise.all([
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: fromAddress,
          to: ['ziiro.work@gmail.com'],
          subject: `New Audit: ${name} — Score ${score}/100 (${urgency})`,
          html: teamHtml,
        }),
      }),
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: fromAddress,
          to: [email],
          subject: `Your AI Readiness Audit Results — Ziiro`,
          html: confirmHtml,
        }),
      }),
    ]);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Audit email error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
