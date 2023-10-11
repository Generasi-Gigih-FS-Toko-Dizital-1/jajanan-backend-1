export default class TopUpCreateResponse {
  redirectUrl: string

  constructor (redirectUrl: string) {
    this.redirectUrl = redirectUrl
  }
}
