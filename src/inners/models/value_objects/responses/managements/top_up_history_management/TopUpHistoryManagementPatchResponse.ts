export default class TopUpHistoryManagementPatchResponse {
  id: string
  userId: string
  amount: number
  media: string
  updatedAt: Date
  createdAt: Date

  constructor (id: string,
    userId: string,
    amount: number,
    media: string,
    updatedAt: Date,
    createdAt: Date) {
    this.id = id
    this.userId = userId
    this.amount = amount
    this.media = media
    this.updatedAt = updatedAt
    this.createdAt = createdAt
  }
}
