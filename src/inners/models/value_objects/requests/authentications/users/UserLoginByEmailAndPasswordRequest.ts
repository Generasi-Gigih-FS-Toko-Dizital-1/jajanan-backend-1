export default class UserLoginByEmailAndPasswordRequest {
  email: string
  password: string
  firebaseToken: string

  constructor (email: string, password: string, firebaseToken: string) {
    this.email = email
    this.password = password
    this.firebaseToken = firebaseToken
  }
}
