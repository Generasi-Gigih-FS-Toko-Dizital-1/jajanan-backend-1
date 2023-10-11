import type Session from '../../../Session'

export default class AdminLogoutRequest {
  session: Session

  constructor (session: Session) {
    this.session = session
  }
}
