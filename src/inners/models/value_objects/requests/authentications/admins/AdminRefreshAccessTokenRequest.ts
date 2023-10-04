import type Session from '../../../Session'

export default class AdminRefreshAccessTokenRequest {
  session: Session

  constructor (session: Session) {
    this.session = session
  }
}
