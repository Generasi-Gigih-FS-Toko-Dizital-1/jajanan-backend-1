export default class PayoutCreateRequest {
  vendorId: string
  amount: number

  constructor (vendorId: string, amount: number) {
    this.vendorId = vendorId
    this.amount = amount
  }
}
