export default class LoginByEmailAndPasswordResponse {
  token: string | null

  constructor (
    token: string | null
  ) {
    this.token = token
  }
}
