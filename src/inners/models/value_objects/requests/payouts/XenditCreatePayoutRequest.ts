export default class XenditCreatePayoutRequest {
  external_id: string
  amount: number
  email: string

  constructor (externalId: string, amount: number, email: string) {
    this.external_id = externalId
    this.amount = amount
    this.email = email
  }
}
