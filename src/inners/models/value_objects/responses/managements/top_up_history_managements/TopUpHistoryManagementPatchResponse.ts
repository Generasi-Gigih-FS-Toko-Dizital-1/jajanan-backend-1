export default class TopUpHistoryManagementPatchResponse {
  id: string
  userId: string
  xenditInvoiceId: string
  amount: number
  media: string
  updatedAt: Date
  createdAt: Date
  deletedAt: Date | null

  constructor (id: string,
    userId: string,
    xenditInvoiceId: string,
    amount: number,
    media: string,
    updatedAt: Date,
    createdAt: Date,
    deletedAt: Date | null = null
  ) {
    this.id = id
    this.userId = userId
    this.xenditInvoiceId = xenditInvoiceId
    this.amount = amount
    this.media = media
    this.updatedAt = updatedAt
    this.createdAt = createdAt
    this.deletedAt = deletedAt
  }
}
