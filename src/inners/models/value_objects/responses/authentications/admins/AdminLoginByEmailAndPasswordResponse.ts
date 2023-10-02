export default class AdminLoginByEmailAndPasswordResponse {
  token: string | null

  constructor (
    token: string | null
  ) {
    this.token = token
  }
}
