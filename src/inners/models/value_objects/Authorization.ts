export default class Authorization {
  token: string
  scheme: string

  constructor (token: string, scheme: string) {
    this.token = token
    this.scheme = scheme
  }

  static convertFromString (authorizationHeader: string): Authorization {
    const [scheme, token] = authorizationHeader.split(' ')
    return new Authorization(token, scheme)
  }

  convertToString (): string {
    return `${this.scheme} ${this.token}`
  }
}
