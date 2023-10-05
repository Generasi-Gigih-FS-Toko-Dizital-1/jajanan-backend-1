import type Session from '../../../Session'

export default class UserLoginByEmailAndPasswordResponse {
  session: Session
  constructor (session: Session) {
    this.session = session
  }
}
