import { type User } from '@prisma/client'

export default class TopUpHistoryManagementReadOneResponse {
  id: string
  userId: string
  xenditInvoiceId: string
  amount: number
  media: string
  updatedAt: Date
  createdAt: Date
  deletedAt: Date | null
  user?: User

  constructor (id: string,
    userId: string,
    xenditInvoiceId: string,
    amount: number,
    media: string,
    updatedAt: Date,
    createdAt: Date,
    deletedAt: Date | null = null,
    user?: User

  ) {
    this.id = id
    this.userId = userId
    this.xenditInvoiceId = xenditInvoiceId
    this.amount = amount
    this.media = media
    this.updatedAt = updatedAt
    this.createdAt = createdAt
    this.user = user
    this.deletedAt = deletedAt
  }
}
