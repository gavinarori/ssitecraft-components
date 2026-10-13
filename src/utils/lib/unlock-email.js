const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

/** Emails the "unlock on this browser" link. Without RESEND_API_KEY it logs the link (development). */
export async function sendUnlockEmail({ to, titles, unlockUrl }) {
  const list = titles.join(', ')
  const subject = `Unlock your components: ${list}`
  const text = `Thanks for your purchase.\n\nOpen this link in the browser you want to use. It unlocks: ${list}\n${unlockUrl}\n\nThe link works for 7 days. Lost access later? Use "Restore purchases" on the site with this email address.`
  const html = `<!doctype html><html><body style="font-family:Inter,Arial,sans-serif;color:#0a0a0a;padding:24px">
<p style="font-size:15px;line-height:1.6">Thanks for your purchase. Open the link below in the browser you want to use. It unlocks <strong>${esc(list)}</strong>.</p>
<p><a href="${esc(unlockUrl)}" style="display:inline-block;background:#171717;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:999px">Unlock my components</a></p>
<p style="font-size:13px;color:#525252">The link works for 7 days. Lost access later? Use “Restore purchases” on the site with this email address.</p></body></html>`

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn(`[email] RESEND_API_KEY not set. Would have emailed ${to}: ${unlockUrl}`)
    return { skipped: true }
  }
  const from = process.env.EMAIL_FROM
  if (!from) throw new Error('EMAIL_FROM must be set when RESEND_API_KEY is set.')

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject, html, text }),
  })
  if (!response.ok) throw new Error(`Resend rejected the email (${response.status}): ${await response.text()}`)
  return { skipped: false }
}
