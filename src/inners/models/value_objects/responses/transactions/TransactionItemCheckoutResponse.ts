export default class TransactionItemCheckoutResponse {
  jajanItemSnapshotId: string
  quantity: number

  constructor (jajanItemSnapshotId: string, quantity: number) {
    this.jajanItemSnapshotId = jajanItemSnapshotId
    this.quantity = quantity
  }
}
