const allowedFields = ['name','business','email','country','industry','website','need','pages','languages','features','deadline','budget','notes'];

function clean(value) {
  return String(value ?? '').replace(/[<>]/g, '').trim().slice(0, 4000);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Invalid JSON payload.' }); }
  }
  const data = Object.fromEntries(allowedFields.map(key => [key, clean(body[key])]));
  if (!data.name || !data.business || !data.email || !data.need) {
    return res.status(400).json({ error: 'Please complete the required project fields.' });
  }
  if (!/^\S+@\S+\.\S+$/.test(data.email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL || 'LAUNCH CTRL <onboarding@resend.dev>';
  if (!apiKey || !to) {
    return res.status(503).json({ error: 'Lead intake is being configured. Please try again shortly.' });
  }

  const rows = allowedFields.map(key => `<tr><td style="padding:6px 12px 6px 0;color:#777;text-transform:uppercase;font-size:12px">${key}</td><td style="padding:6px 0">${data[key] || '—'}</td></tr>`).join('');
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: data.email,
      subject: `LAUNCH CTRL lead — ${data.business} / ${data.need}`,
      html: `<div style="font-family:Arial,sans-serif"><h1>New LAUNCH CTRL build request</h1><table>${rows}</table></div>`
    })
  });

  if (!response.ok) {
    console.error('Resend failure', response.status, await response.text());
    return res.status(502).json({ error: 'The brief could not be delivered. Please try again.' });
  }
  return res.status(200).json({ ok: true });
}
