export default class VendorLoginByEmailAndPasswordResponse {
  token: string | null

  constructor (
    token: string | null
  ) {
    this.token = token
  }
}
