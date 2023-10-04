import type TwoDatastore from '../datastores/TwoDatastore'
import Session from '../../inners/models/value_objects/Session'
import bcrypt from 'bcrypt'

export default class SessionRepository {
  twoDatastore: TwoDatastore

  constructor (twoDatastore: TwoDatastore) {
    this.twoDatastore = twoDatastore
  }

  setOne = async (session: Session): Promise<void> => {
    if (this.twoDatastore.client === undefined) {
      throw new Error('Client is undefined.')
    }

    const salt: string | undefined = process.env.BCRYPT_SALT
    if (salt === undefined) {
      throw new Error('Salt is undefined.')
    }

    const sessionString: string = JSON.stringify(session)
    const id: string = bcrypt.hashSync(sessionString, salt)
    await this.twoDatastore.client.set(id, sessionString)
  }

  readOneById = async (id: string): Promise<Session> => {
    if (this.twoDatastore.client === undefined) {
      throw new Error('Client is undefined.')
    }
    const session: string | null = await this.twoDatastore.client.get(id)
    if (session === null) {
      throw new Error('Session is not saved.')
    }
    return Session.parseFromJsonString(session)
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
