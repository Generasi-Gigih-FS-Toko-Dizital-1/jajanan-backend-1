export default class PayoutCreateResponse {
  redirectUrl: string

  constructor (redirectUrl: string) {
    this.redirectUrl = redirectUrl
  }
}
