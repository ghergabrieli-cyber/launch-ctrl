# LAUNCH CTRL — BUILD #000

International web design / digital systems studio MVP.

## Stack
- Static-first semantic HTML
- Hand-written responsive CSS
- Vanilla JavaScript for language switching + configurator
- Vercel Serverless Function for project lead intake
- No runtime dependencies

## Lead intake
Set these Vercel environment variables:
- `RESEND_API_KEY`
- `LEAD_TO_EMAIL`
- `LEAD_FROM_EMAIL` (optional; verified sender recommended)

The public form POSTs to `/api/lead`.

## Languages
- EN: commercial copy included
- RO: commercial copy included
- FR: commercial copy included
- DE / IT / RU: architecture present; production copy intentionally held behind native/human QA

## Performance principles
- No third-party fonts
- No third-party JS
- Reduced-motion support
- Static-first rendering
- Lightweight original CSS instrumentation instead of heavy video/3D assets

## Deployment
Designed for Vercel. `vercel.json` includes baseline security headers.
