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

  readOneByAuthorizationId = async (id: string): Promise<Result<Session | null>> => {
    let foundSession: Session
    try {
      foundSession = await this.sessionRepository.readOneByAuthorizationId(id)
    } catch (error) {
      return new Result<null>(
        404,
        `Session read one by id failed,${(error as Error).message}.`,
        null
      )
    }
    return new Result<Session>(
      200,
      'Session read one by id succeed.',
      foundSession
    )
  }

  readOneByAccountId = async (accountId: string): Promise<Result<Session | null>> => {
    let foundSession: Session
    try {
      foundSession = await this.sessionRepository.readOneByAccountId(accountId)
    } catch (error) {
      return new Result<null>(
        404,
        `Session read one by account id failed, ${(error as Error).message}.`,
        null
      )
    }
    return new Result<Session>(
      200,
      'Session read one by account id succeed.',
      foundSession
    )
  }

  setOneById = async (id: string, session: Session): Promise<Result<null>> => {
    try {
      await this.sessionRepository.setOneById(id, session)
    } catch (error) {
      return new Result<null>(
        500,
        `Session set one failed, ${(error as Error).message}.`,
        null
      )
    }
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
        `Session delete one failed, ${(error as Error).message}.`,
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
