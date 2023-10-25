export default class TopUpHistoryManagementPatchResponse {
  id: string
  userId: string
  xenditInvoiceId: string
  amount: number
  media: string
  updatedAt: Date
  createdAt: Date

  constructor (id: string,
    userId: string,
    xenditInvoiceId: string,
    amount: number,
    media: string,
    updatedAt: Date,
    createdAt: Date) {
    this.id = id
    this.userId = userId
    this.xenditInvoiceId = xenditInvoiceId
    this.amount = amount
    this.media = media
    this.updatedAt = updatedAt
    this.createdAt = createdAt
  }
}
