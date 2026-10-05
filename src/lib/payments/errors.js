/** An error whose message is safe to show to the buyer. Anything else stays in the server logs. */
export class PaymentError extends Error {
  constructor(publicMessage, { status = 502, cause } = {}) {
    super(publicMessage, { cause })
    this.name = 'PaymentError'
    this.status = status
    this.publicMessage = publicMessage
  }
}
