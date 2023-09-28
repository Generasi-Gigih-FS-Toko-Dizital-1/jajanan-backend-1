export default class LoginByUsernameAndPasswordRequest {
  username: string
  password: string

  constructor (
    username: string,
    password: string
  ) {
    this.username = username
    this.password = password
  }
}
