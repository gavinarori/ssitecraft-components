/**
 * Sends the delivery email through Resend's HTTP API.
 *   RESEND_API_KEY   from resend.com
 *   EMAIL_FROM       e.g. "Sitecraft <orders@yourdomain.com>" (domain must be verified in Resend)
 *
 * With no RESEND_API_KEY it logs the link instead of sending, which is what you want in development.
 */

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])

export async function sendDeliveryEmail({ to, name, templateTitle, tier, downloadUrl, expiresInHours }) {
  const greeting = name ? `Hi ${name.split(' ')[0]},` : 'Hi,'
  const days = Math.round(expiresInHours / 24)
  const validFor = days >= 2 ? `${days} days` : `${expiresInHours} hours`
  const subject = `Your download: ${templateTitle}`

  const text = [
    greeting,
    '',
    `Thanks for buying ${templateTitle} (${tier} license).`,
    `Download the source: ${downloadUrl}`,
    '',
    `The link works for ${validFor} and a limited number of downloads.`,
    'Your license key and receipt are in the separate email from our payment provider.',
  ].join('\n')

  const html = `<!doctype html><html><body style="margin:0;background:#fafafa;font-family:Inter,Arial,sans-serif;color:#0a0a0a">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
    <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fff;border:1px solid #e5e5e5;border-radius:12px">
      <tr><td style="padding:28px">
        <p style="margin:0 0 16px;font-size:15px">${escapeHtml(greeting)}</p>
        <p style="margin:0 0 20px;font-size:15px;line-height:1.6">Thanks for buying <strong>${escapeHtml(templateTitle)}</strong> (${escapeHtml(tier)} license). Your source files are ready.</p>
        <p style="margin:0 0 24px"><a href="${escapeHtml(downloadUrl)}" style="display:inline-block;background:#0a0a0a;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:999px">Download source</a></p>
        <p style="margin:0;font-size:13px;line-height:1.6;color:#525252">The link works for ${escapeHtml(validFor)} and a limited number of downloads. Your license key and receipt are in the separate email from our payment provider.</p>
      </td></tr>
    </table>
  </td></tr></table></body></html>`

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn(`[email] RESEND_API_KEY not set. Would have emailed ${to}: ${downloadUrl}`)
    return { skipped: true }
  }

  const from = process.env.EMAIL_FROM
  if (!from) throw new Error('EMAIL_FROM must be set when RESEND_API_KEY is set.')

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject, html, text }),
  })

  if (!response.ok) {
    throw new Error(`Resend rejected the email (${response.status}): ${await response.text()}`)
  }
  return { skipped: false }
}
