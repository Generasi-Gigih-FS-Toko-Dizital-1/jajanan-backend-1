export default class UserLoginByEmailAndPasswordResponse {
  token: string | null

  constructor (
    token: string | null
  ) {
    this.token = token
  }
}
