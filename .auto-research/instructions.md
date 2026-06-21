# Ziiro Site Performance Auto Research

## Goal

Raise the average mobile Lighthouse Performance score across all public Ziiro routes while preserving business-critical content and functionality.

## Primary Score

One number defines better:

```text
mean mobile Lighthouse Performance score across:
/, /services, /about, /contact, /audit, /privacy, /terms
```

Higher is better. Keep a change only when this score improves and all hard guardrails pass.

## Editable Assets During Loops

Only these files may change during optimization loops:

- `src/pages/**`
- `src/components/**`
- `src/data/**`
- `src/index.css`
- `index.html`
- `vite.config.ts`
- `public/**`, except `public/performance-dashboard.html`
- `/Users/rits/.agents/skills/landing-page-optimizer/SKILL.md` only in the final skill-update phase

## Locked Assets

Do not edit these during optimization loops:

- `.auto-research/**`
- `supabase/**`
- `.env*`
- `package.json`
- `package-lock.json`
- `public/performance-dashboard.html`

The package files may change only during the initial setup needed to install the fixed scoring tools.

## Build And Scoring Commands

The scorer must run against a production build:

```bash
npm run build
npm run preview -- --port 4173 --strictPort --host 127.0.0.1
python3 .auto-research/score.py
```

`score.py` owns the build, preview server, route checks, Lighthouse runs, and final numeric score.

## Hard Guardrails

If any guardrail fails, revert the experiment even if Lighthouse improves:

- All seven routes must render successfully.
- Navbar and footer links must remain available.
- Homepage hero and primary CTA must remain visible.
- Services/offers must remain visible.
- Contact form fields and submit CTA must remain visible.
- Audit form and "GET YOUR AUDIT" CTA must remain visible.
- Privacy and Terms legal text must remain visible.
- Do not remove or hide required business content to improve scores.
- Do not replace real content with placeholders.
- Do not break keyboard-visible form controls or basic readable contrast.

## Loop Protocol

For each round:

1. Record the current score.
2. Form one focused hypothesis.
3. Edit only allowed assets.
4. Run the locked scorer.
5. Keep the change only if the primary score improves and guardrails pass.
6. Revert only the experiment change if the score is unchanged, worse, or guardrails fail.
7. Append one row to `results.tsv`.

## Stop Condition

Stop when the user says stop, the average score reaches 90, or the planned multi-route optimization and skill update are complete.
