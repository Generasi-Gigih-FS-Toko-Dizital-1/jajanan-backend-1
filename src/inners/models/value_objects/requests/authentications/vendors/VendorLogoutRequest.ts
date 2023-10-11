import type Session from '../../../Session'

export default class VendorLogoutRequest {
  session: Session

  constructor (session: Session) {
    this.session = session
  }
}
