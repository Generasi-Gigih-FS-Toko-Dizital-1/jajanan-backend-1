import type TwoDatastore from '../datastores/TwoDatastore'
import Session from '../../inners/models/value_objects/Session'

export default class SessionRepository {
  twoDatastore: TwoDatastore

  constructor (twoDatastore: TwoDatastore) {
    this.twoDatastore = twoDatastore
  }

  setOneById = async (id: string, session: Session): Promise<void> => {
    if (this.twoDatastore.client === undefined) {
      throw new Error('Client is undefined.')
    }
    const sessionString: string = JSON.stringify(session)
    await this.twoDatastore.client.set(id, sessionString)
    await this.twoDatastore.client.expireAt(id, session.expiredAt)
    await this.twoDatastore.client.set(session.accountId, id)
    await this.twoDatastore.client.expireAt(session.accountId, session.expiredAt)
  }

  readOneByAuthorizationId = async (id: string): Promise<Session> => {
    if (this.twoDatastore.client === undefined) {
      throw new Error('Client is undefined.')
    }
    const session: string | null = await this.twoDatastore.client.get(id)
    if (session === null) {
      throw new Error('Session is not saved.')
    }
    return Session.convertFromJsonString(session)
  }

  readOneByAccountId = async (accountId: string): Promise<Session> => {
    if (this.twoDatastore.client === undefined) {
      throw new Error('Client is undefined.')
    }
    const authorizationId: string | null = await this.twoDatastore.client.get(accountId)
    if (authorizationId === null) {
      throw new Error('Authorization id is not saved.')
    }
    const session: string | null = await this.twoDatastore.client.get(authorizationId)
    if (session === null) {
      throw new Error('Session is not saved.')
    }

    return Session.convertFromJsonString(session)
  }

  deleteOneById = async (id: string): Promise<void> => {
    if (this.twoDatastore.client === undefined) {
      throw new Error('Client is undefined.')
    }

    const deleteCount: number = await this.twoDatastore.client.del(id)
    if (deleteCount === 0) {
      throw new Error('Session is not saved.')
    }
  }
}
