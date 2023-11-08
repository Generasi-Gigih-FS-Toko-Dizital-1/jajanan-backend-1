export default class TransactionItemHistoryManagementCreateRequest {
  transactionId: string
  jajanItemSnapshotId: string
  quantity: number

  constructor (transactionId: string, jajanItemSnapshotId: string, quantity: number) {
    this.transactionId = transactionId
    this.jajanItemSnapshotId = jajanItemSnapshotId
    this.quantity = quantity
  }
}
