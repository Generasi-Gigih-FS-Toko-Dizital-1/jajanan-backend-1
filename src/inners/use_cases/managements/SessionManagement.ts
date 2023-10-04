import Result from '../../models/value_objects/Result'
import type ObjectUtility from '../../../outers/utilities/ObjectUtility'
import type SessionRepository from '../../../outers/repositories/SessionRepository'
import type Session from '../../models/value_objects/Session'

export default class SessionManagement {
  sessionRepository: SessionRepository
  objectUtility: ObjectUtility

  constructor (sessionRepository: SessionRepository, objectUtility: ObjectUtility) {
    this.sessionRepository = sessionRepository
    this.objectUtility = objectUtility
  }

  readOneById = async (id: string): Promise<Result<Session | null>> => {
    let foundSession: Session
    try {
      foundSession = await this.sessionRepository.readOneById(id)
    } catch (error) {
      return new Result<null>(
        404,
        'Session read one by id failed, unknown id.',
        null
      )
    }
    return new Result<Session>(
      200,
      'Session read one by id succeed.',
      foundSession
    )
  }

  setOne = async (session: Session): Promise<Result<null>> => {
    await this.sessionRepository.setOne(session)
    return new Result<null>(
      200,
      'Session set one succeed.',
      null
    )
  }

  deleteOneById = async (sessionId: string): Promise<Result<null>> => {
    try {
      await this.sessionRepository.deleteOneById(sessionId)
    } catch (error) {
      return new Result<null>(
        404,
        'Session delete one failed, unknown id.',
        null
      )
    }
    return new Result<null>(
      200,
      'Session delete one succeed.',
      null
    )
  }
}
