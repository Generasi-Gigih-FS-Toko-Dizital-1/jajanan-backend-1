import type TopUpHistoryManagementReadOneResponse from './TopUpHistoryManagementReadOneResponse'

export default class TopUpHistoryManagementReadManyResponse {
  totalTopUpHistory: number
  topUpHistories: TopUpHistoryManagementReadOneResponse[]

  constructor (totalTopUpHistory: number,
    topUpHistories: TopUpHistoryManagementReadOneResponse[]) {
    this.totalTopUpHistory = totalTopUpHistory
    this.topUpHistories = topUpHistories
  }
}
