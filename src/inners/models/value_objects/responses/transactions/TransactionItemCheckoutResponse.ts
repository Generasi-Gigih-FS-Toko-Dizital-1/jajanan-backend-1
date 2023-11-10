export default class TransactionItemCheckoutResponse {
  id: string
  jajanItemSnapshotId: string
  quantity: number

  constructor (id: string, jajanItemSnapshotId: string, quantity: number) {
    this.id = id
    this.jajanItemSnapshotId = jajanItemSnapshotId
    this.quantity = quantity
  }
}
