export default class TopUpHistoryManagementPatchRequest {
  userId: string
  amount: number
  media: string
  xenditInvoiceId: string

  constructor (userId: string, amount: number, media: string, xenditInvoiceId: string) {
    this.userId = userId
    this.amount = amount
    this.media = media
    this.xenditInvoiceId = xenditInvoiceId
  }
}
