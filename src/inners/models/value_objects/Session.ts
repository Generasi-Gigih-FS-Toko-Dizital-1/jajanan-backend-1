export default class Session {
  accountId: string
  accountType: string
  accessToken: string
  refreshToken: string
  expiredAt: Date
  firebaseToken?: string

  constructor (accountId: string, accountType: string, accessToken: string, refreshToken: string, expiredAt: Date, firebaseToken?: string) {
    this.accountId = accountId
    this.accountType = accountType
    this.accessToken = accessToken
    this.refreshToken = refreshToken
    this.expiredAt = expiredAt
    this.firebaseToken = firebaseToken
  }

  static convertFromJsonString = (jsonString: any): Session => {
    const jsonObject = JSON.parse(jsonString)
    return new Session(
      jsonObject.accountId,
      jsonObject.accountType,
      jsonObject.accessToken,
      jsonObject.refreshToken,
      new Date(jsonObject.expiredAt),
      jsonObject.firebaseToken
    )
  }
}
