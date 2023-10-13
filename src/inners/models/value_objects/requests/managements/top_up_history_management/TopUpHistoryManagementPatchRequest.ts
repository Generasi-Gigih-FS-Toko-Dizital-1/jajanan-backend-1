export default class TopUpHistoryManagementPatchRequest {
  userId: string
  amount: number
  media: string

  constructor (userId: string, amount: number, media: string) {
    this.userId = userId
    this.amount = amount
    this.media = media
  }
}