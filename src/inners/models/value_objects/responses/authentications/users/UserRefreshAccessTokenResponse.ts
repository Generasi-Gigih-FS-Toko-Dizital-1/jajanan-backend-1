import type Session from '../../../Session'

export default class UserRefreshAccessTokenResponse {
  session: Session
  constructor (session: Session) {
    this.session = session
  }
}
