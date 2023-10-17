export default class XenditCreatePayoutRequest {
  externalId: string
  amount: number
  email: string

  constructor (externalId: string, amount: number, email: string) {
    this.externalId = externalId
    this.amount = amount
    this.email = email
  }
}
