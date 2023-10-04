import type Session from '../../../Session'

export default class VendorLoginByEmailAndPasswordResponse {
  session: Session
  constructor (session: Session) {
    this.session = session
  }
}
