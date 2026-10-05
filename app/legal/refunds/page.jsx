import LegalPage from '@component/LegalPage'

export const metadata = { title: 'Refund policy | sitecraft' }

// REFUND_WINDOW is a placeholder decision for the owner. Match it to your payment provider's terms.
const REFUND_WINDOW = '14 days'

export default function Page() {
  return (
    <LegalPage title="Refund policy" updated="[DATE]">
      <p>
        Templates are digital downloads, so we cannot take them back. Even so, if a template does not work as described, we want to make it right.
      </p>

      <h2>When we refund</h2>
      <ul>
        <li>Within {REFUND_WINDOW} of purchase, if the template has a defect we cannot fix, or does not match its live preview.</li>
        <li>If you were charged twice for the same order.</li>
      </ul>

      <h2>When we do not</h2>
      <ul>
        <li>You changed your mind after downloading, or the template is not what you expected from the live preview.</li>
        <li>The issue is with your hosting, a third-party service or your own changes.</li>
      </ul>

      <h2>How to ask</h2>
      <p>Write to us with your order email and the problem you hit. Refunds go back to the original payment method. A refunded order&apos;s download link stops working.</p>
    </LegalPage>
  )
}
