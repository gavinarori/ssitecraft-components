import LegalPage from '@component/LegalPage'

export const metadata = { title: 'Template license | sitecraft' }

// Starter text. Have a lawyer review it before you take payments.
export default function Page() {
  return (
    <LegalPage title="Template license" updated="[DATE]">
      <p>Buying a template gives you a license to use its source code. You do not become the owner of the template.</p>

      <h2>Standard license</h2>
      <ul>
        <li>Build one finished website, for yourself or for one client.</li>
        <li>Modify the code and content as much as you like.</li>
      </ul>

      <h2>Extended license</h2>
      <ul>
        <li>Everything in the Standard license.</li>
        <li>Build any number of websites for clients.</li>
        <li>Use the template inside a product you sell, as long as buyers cannot extract the template itself.</li>
      </ul>

      <h2>You may not</h2>
      <ul>
        <li>Resell, share or publish the template source, whole or in part, as a template, theme or starter kit.</li>
        <li>Share your download link or license with people who have not bought it.</li>
      </ul>

      <h2>Support and updates</h2>
      <p>Bug fixes and updates to the major version you bought are free. Download them again from your original link or by writing to us.</p>

      <h2>Warranty</h2>
      <p>Templates are provided as they are, without warranty. Our liability is limited to the price you paid.</p>
    </LegalPage>
  )
}
