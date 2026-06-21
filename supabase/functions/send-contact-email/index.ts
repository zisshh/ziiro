import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const allowedOrigins = new Set([
  'https://ziiro.work',
  'https://www.ziiro.work',
  'http://localhost:4173',
  'http://localhost:8080',
]);

const rateLimitWindowMs = 10 * 60 * 1000;
const rateLimitMax = 5;
const rateLimitBuckets = new Map<string, number[]>();
const disposableDomains = new Set([
  'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'throwaway.email', 'yopmail.com',
  'sharklasers.com', 'guerrillamailblock.com', 'grr.la', 'guerrillamail.info', 'spam4.me',
  'trashmail.com', 'trashmail.me', 'trashmail.net', 'dispostable.com', 'maildrop.cc',
  '10minutemail.com', '10minutemail.net', '10minutemail.org', 'minutemail.com', 'temp-mail.org',
  'fakeinbox.com', 'mailnull.com', 'spamgourmet.com', 'spamgourmet.net', 'discard.email',
  'mailnesia.com', 'spamspot.com', 'spamthisplease.com', 'byom.de', 'getnada.com',
  'anonaddy.com', 'tempinbox.com', 'tempr.email', 'emailondeck.com', 'getairmail.com',
  'filzmail.com', 'zetmail.com', 'mohmal.com', 'owlpic.com', 'cfl.fr',
  'spamfree24.org', 'spamfree24.de', 'spamfree24.eu', 'spamfree24.info', 'spaml.de',
  'spaml.com', 'disigntime.com', 'no-spam.ws', 'antispam24.de', 'wegwerfmail.de',
  'wegwerfmail.net', 'wegwerfmail.org', 'abcmail.email', 'armyspy.com',
]);

const corsHeaders = (req: Request) => {
  const origin = req.headers.get('origin') ?? '';
  const allowOrigin = allowedOrigins.has(origin) || origin.startsWith('http://localhost:')
    ? origin
    : 'https://ziiro.work';

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Vary': 'Origin',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
};

const escapeHtml = (value: unknown) =>
  String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]!));

const sanitizeText = (value: unknown, maxLength = 500) =>
  Array.from(String(value ?? ''))
    .filter((char) => {
      const code = char.charCodeAt(0);
      return code === 9 || code === 10 || code === 13 || (code >= 32 && code !== 127);
    })
    .join('')
    .trim()
    .slice(0, maxLength);

const sanitizeHeader = (value: unknown, maxLength = 120) =>
  sanitizeText(value, maxLength).replace(/[\r\n]/g, ' ');

const isValidEmail = (email: string) =>
  /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) &&
  email.length <= 254 &&
  !disposableDomains.has(email.split('@')[1]?.toLowerCase());

const isRateLimited = (key: string) => {
  const now = Date.now();
  const recent = (rateLimitBuckets.get(key) ?? []).filter((time) => now - time < rateLimitWindowMs);
  if (recent.length >= rateLimitMax) {
    rateLimitBuckets.set(key, recent);
    return true;
  }
  recent.push(now);
  rateLimitBuckets.set(key, recent);
  return false;
};

const jsonResponse = (req: Request, body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(req), 'Content-Type': 'application/json' },
  });

const readJson = async (req: Request) => {
  const body = await req.text();
  if (body.length > 10_000) throw new Error('Payload too large');
  return JSON.parse(body);
};

serve(async (req) => {
  const headers = corsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY is not configured');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const payload = await readJson(req);
    const name = sanitizeText(payload.name, 100);
    const email = sanitizeText(payload.email, 254).toLowerCase();
    const phone = sanitizeText(payload.phone, 40);
    const company = sanitizeText(payload.company, 120);
    const industry = sanitizeText(payload.industry, 80);
    const service = sanitizeText(payload.service, 120);
    const budget = sanitizeText(payload.budget, 80);
    const timeline = sanitizeText(payload.timeline, 80);
    const message = sanitizeText(payload.message, 2_000);

    if (!name || !company || !message || !isValidEmail(email)) {
      return jsonResponse(req, { success: false, error: 'Invalid submission' }, 400);
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    if (isRateLimited(`${ip}:${email}`)) {
      return jsonResponse(req, { success: false, error: 'Too many submissions' }, 429);
    }

    const { error: dbError } = await supabase.from('contact_submissions').insert({
      name, email, phone: phone || null, company, message,
    });
    if (dbError) {
      throw dbError;
    }

    const fromAddress = 'Ziiro AI <onboarding@resend.dev>';

    // 1. Notification email to team
    const teamHtml = `
      <h2 style="color:#333;font-family:sans-serif;">New Contact Form Submission</h2>
      <table style="border-collapse:collapse;width:100%;max-width:600px;font-family:sans-serif;">
        <tr style="background:#f4f4f4;"><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Name</td><td style="padding:10px;border:1px solid #ddd;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Email</td><td style="padding:10px;border:1px solid #ddd;">${escapeHtml(email)}</td></tr>
        <tr style="background:#f4f4f4;"><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Phone</td><td style="padding:10px;border:1px solid #ddd;">${escapeHtml(phone || 'N/A')}</td></tr>
        <tr><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Company</td><td style="padding:10px;border:1px solid #ddd;">${escapeHtml(company)}</td></tr>
        <tr style="background:#f4f4f4;"><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Industry</td><td style="padding:10px;border:1px solid #ddd;">${escapeHtml(industry || 'N/A')}</td></tr>
        <tr><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Service Interest</td><td style="padding:10px;border:1px solid #ddd;">${escapeHtml(service || 'N/A')}</td></tr>
        <tr style="background:#f4f4f4;"><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Budget</td><td style="padding:10px;border:1px solid #ddd;">${escapeHtml(budget || 'N/A')}</td></tr>
        <tr><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Timeline</td><td style="padding:10px;border:1px solid #ddd;">${escapeHtml(timeline || 'N/A')}</td></tr>
        <tr style="background:#f4f4f4;"><td style="padding:10px;border:1px solid #ddd;font-weight:bold;">Message</td><td style="padding:10px;border:1px solid #ddd;">${escapeHtml(message)}</td></tr>
      </table>
    `;

    const teamRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: fromAddress,
        to: ['ziiro.work@gmail.com'],
        subject: `New Contact: ${sanitizeHeader(name)} from ${sanitizeHeader(company)}`,
        html: teamHtml,
      }),
    });

    const teamData = await teamRes.json();

    if (!teamRes.ok) {
      console.error('Team email failed:', teamData);
      throw new Error('Resend request failed');
    }

    return jsonResponse(req, { success: true });
  } catch (error) {
    console.error('Email send error:', error);
    return jsonResponse(req, { success: false, error: 'Unable to send email' }, 500);
  }
});
