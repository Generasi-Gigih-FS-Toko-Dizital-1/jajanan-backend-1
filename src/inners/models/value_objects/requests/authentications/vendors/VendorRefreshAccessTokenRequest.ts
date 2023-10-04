import type Session from '../../../Session'

export default class VendorRefreshAccessTokenRequest {
  session: Session

  constructor (session: Session) {
    this.session = session
  }
}
