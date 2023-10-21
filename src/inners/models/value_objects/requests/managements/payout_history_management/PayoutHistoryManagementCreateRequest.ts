export default class PayoutHistoryManagementCreateRequest {
  vendorId: string
  amount: number
  media: string
  xenditPayoutId: string

  constructor (vendorId: string, amount: number, media: string, xenditPayoutId: string) {
    this.vendorId = vendorId
    this.amount = amount
    this.media = media
    this.xenditPayoutId = xenditPayoutId
  }
}
