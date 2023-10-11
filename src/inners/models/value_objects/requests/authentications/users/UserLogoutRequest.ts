import type Session from '../../../Session'

export default class UserLogoutRequest {
  session: Session

  constructor (session: Session) {
    this.session = session
  }
}
