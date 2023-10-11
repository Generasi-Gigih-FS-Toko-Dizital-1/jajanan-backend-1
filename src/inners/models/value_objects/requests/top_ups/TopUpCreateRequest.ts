export default class TopUpCreateRequest {
  userId: string
  amount: number

  constructor (userId: string, amount: number) {
    this.userId = userId
    this.amount = amount
  }
}
