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

    const { name, email, phone, company, industry, service, budget, timeline, message } = await req.json();

    // Save to database (best-effort)
    try {
      await supabase.from('contact_submissions').insert({
        name, email, phone: phone || null, company, message,
      });
    } catch (dbErr) {
      console.error('DB insert error:', dbErr);
    }

    const fromAddress = 'Ziiro AI <onboarding@resend.dev>';

    // 1. Notification email to team
    const teamHtml = `
      <h2 style="color:#333;font-family:sans-serif;">New Contact Form Submission</h2>
      <table style="border-collapse:collapse;width:100%;max-width:600px;font-family:sans-serif;">
        <tr style="background:#f4f4f4;"><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Name</td><td style="padding:10px;border:1px solid #ddd;">${name}</td></tr>
        <tr><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Email</td><td style="padding:10px;border:1px solid #ddd;">${email}</td></tr>
        <tr style="background:#f4f4f4;"><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Phone</td><td style="padding:10px;border:1px solid #ddd;">${phone || 'N/A'}</td></tr>
        <tr><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Company</td><td style="padding:10px;border:1px solid #ddd;">${company}</td></tr>
        <tr style="background:#f4f4f4;"><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Industry</td><td style="padding:10px;border:1px solid #ddd;">${industry || 'N/A'}</td></tr>
        <tr><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Service Interest</td><td style="padding:10px;border:1px solid #ddd;">${service || 'N/A'}</td></tr>
        <tr style="background:#f4f4f4;"><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Budget</td><td style="padding:10px;border:1px solid #ddd;">${budget || 'N/A'}</td></tr>
        <tr><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Timeline</td><td style="padding:10px;border:1px solid #ddd;">${timeline || 'N/A'}</td></tr>
        <tr style="background:#f4f4f4;"><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Message</td><td style="padding:10px;border:1px solid #ddd;">${message}</td></tr>
      </table>
    `;

    // 2. Confirmation email to the person who submitted
    const confirmationHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#333;">
        <h2 style="color:#333;">Thank you for reaching out, ${name}!</h2>
        <p>We've received your message and our team will get back to you within 24 hours.</p>
        <p>Here's a summary of what you submitted:</p>
        <table style="border-collapse:collapse;width:100%;font-family:sans-serif;margin:16px 0;">
          <tr style="background:#f4f4f4;"><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Company</td><td style="padding:10px;border:1px solid #ddd;">${company}</td></tr>
          ${service ? `<tr><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Service Interest</td><td style="padding:10px;border:1px solid #ddd;">${service}</td></tr>` : ''}
          ${budget ? `<tr style="background:#f4f4f4;"><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Budget</td><td style="padding:10px;border:1px solid #ddd;">${budget}</td></tr>` : ''}
          ${timeline ? `<tr><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Timeline</td><td style="padding:10px;border:1px solid #ddd;">${timeline}</td></tr>` : ''}
        </table>
        <p>If you have any urgent questions, feel free to email us at <a href="mailto:aniket@ziiro.work">aniket@ziiro.work</a>.</p>
        <p style="margin-top:24px;">Best regards,<br/><strong>The Ziiro Team</strong></p>
      </div>
    `;

    // Send both emails in parallel
    const [teamRes, confirmRes] = await Promise.all([
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: fromAddress,
          to: ['ziiro.work@gmail.com'],
          subject: `New Contact: ${name} from ${company}`,
          html: teamHtml,
        }),
      }),
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: fromAddress,
          to: [email],
          subject: `Thanks for contacting Ziiro, ${name}!`,
          html: confirmationHtml,
        }),
      }),
    ]);

    const teamData = await teamRes.json();
    const confirmData = await confirmRes.json();

    if (!teamRes.ok) {
      console.error('Team email failed:', teamData);
    }
    if (!confirmRes.ok) {
      console.error('Confirmation email failed:', confirmData);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Email send error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
