import type Session from '../../../Session'

export default class AdminRefreshAccessTokenResponse {
  session: Session
  constructor (session: Session) {
    this.session = session
  }
}
