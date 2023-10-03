export default class Session {
  accountId: string
  accountType: string
  accessToken: string
  refreshToken: string
  expiredAt: Date

  constructor (accountId: string, accountType: string, accessToken: string, refreshToken: string, expiredAt: Date) {
    this.accountId = accountId
    this.accountType = accountType
    this.accessToken = accessToken
    this.refreshToken = refreshToken
    this.expiredAt = expiredAt
  }
}
