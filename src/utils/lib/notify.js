/**
 * Pings you when a request comes in. Set NOTIFY_WEBHOOK_URL to any incoming-webhook URL
 * (Discord, Slack, or ntfy.sh/<your-topic>). We send both `content` (Discord) and `text` (Slack).
 * Without it the request is still saved and shows up in /admin.
 */

export async function notifyOwner(message) {
  const url = process.env.NOTIFY_WEBHOOK_URL
  if (!url) {
    console.warn(`[notify] NOTIFY_WEBHOOK_URL not set. ${message}`)
    return
  }
  try {
    const isNtfy = /ntfy\./i.test(url)
    await fetch(url, {
      method: 'POST',
      headers: isNtfy ? { 'Content-Type': 'text/plain', Title: 'New purchase request' } : { 'Content-Type': 'application/json' },
      body: isNtfy ? message : JSON.stringify({ content: message, text: message }),
      signal: AbortSignal.timeout(8000),
    })
  } catch (error) {
    console.error('[notify] failed', error)
  }
}