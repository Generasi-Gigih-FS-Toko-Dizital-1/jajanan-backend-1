import type TransactionHistoryManagementReadOneResponse from './TransactionHistoryManagementReadOneResponse'

export default class TransactionHistoryManagementReadManyResponse {
  totalTransactionHistories: number
  transactionHistories: TransactionHistoryManagementReadOneResponse[]

  constructor (totalTransactionHistories: number, transactionHistories: TransactionHistoryManagementReadOneResponse[]) {
    this.totalTransactionHistories = totalTransactionHistories
    this.transactionHistories = transactionHistories
  }
}
