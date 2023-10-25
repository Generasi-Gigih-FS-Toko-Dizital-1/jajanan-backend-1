import type Session from '../../../Session'

export default class VendorRefreshAccessTokenResponse {
  session: Session
  constructor (session: Session) {
    this.session = session
  }
}
