import type PayoutHistoryManagementReadOneResponse from './PayoutHistoryManagementReadOneResponse'

export default class PayoutHistoryManagementReadManyResponse {
  totalPayoutHistory: number
  payoutHistories: PayoutHistoryManagementReadOneResponse[]

  constructor (totalPayoutHistory: number,
    payoutHistories: PayoutHistoryManagementReadOneResponse[]) {
    this.totalPayoutHistory = totalPayoutHistory
    this.payoutHistories = payoutHistories
  }
}
