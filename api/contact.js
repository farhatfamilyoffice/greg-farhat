// Vercel Function: validates and delivers via Resend. Requires env RESEND_API_KEY, CONTACT_TO, CONTACT_FROM.
// Never logs submission contents.
const lim = { firstName: 80, lastName: 80, email: 200, phone: 30, comment: 4000 };
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'method' }); }
  if (!String(req.headers['content-type'] || '').includes('application/json')) return res.status(415).json({ error: 'type' });
  if (Number(req.headers['content-length'] || 0) > 10000) return res.status(413).json({ error: 'size' });
  const origin = req.headers.origin;
  if (origin) { try { const h = new URL(origin).hostname; if (!(h === 'gregfarhat.com' || h === 'www.gregfarhat.com' || h.endsWith('.vercel.app'))) return res.status(403).json({ error: 'origin' }); } catch { return res.status(403).json({ error: 'origin' }); } }
  const b = typeof req.body === 'object' && req.body ? req.body : {};
  if (b.website) return res.status(200).json({ ok: true }); // honeypot
  const v = {};
  for (const k in lim) { const x = typeof b[k] === 'string' ? b[k].trim() : ''; if (x.length > lim[k]) return res.status(400).json({ error: k }); v[k] = x; }
  if (!v.firstName || !v.lastName) return res.status(400).json({ error: 'name' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) return res.status(400).json({ error: 'email' });
  if (!/^[0-9+()\-. ]{7,30}$/.test(v.phone) || (v.phone.match(/\d/g) || []).length < 7) return res.status(400).json({ error: 'phone' });
  const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO || !CONTACT_FROM) return res.status(503).json({ error: 'not_configured' });
  const html = `<p><b>Name:</b> ${esc(v.firstName)} ${esc(v.lastName)}<br><b>Email:</b> ${esc(v.email)}<br><b>Phone:</b> ${esc(v.phone)}</p><p>${esc(v.comment).replace(/\n/g, '<br>')}</p>`;
  let r;
  try { r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: CONTACT_FROM, to: [CONTACT_TO], reply_to: v.email, subject: `gregfarhat.com contact: ${v.firstName} ${v.lastName}`.slice(0, 150), html }) });
  } catch { console.error('contact delivery failed', 'network'); return res.status(502).json({ error: 'delivery' }); }
  if (!r.ok) { console.error('contact delivery failed', r.status); return res.status(502).json({ error: 'delivery' }); }
  return res.status(200).json({ ok: true });
}
