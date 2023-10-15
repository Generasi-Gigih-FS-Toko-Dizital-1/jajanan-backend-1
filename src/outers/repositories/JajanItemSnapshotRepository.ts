import { type JajanItemSnapshot } from '@prisma/client'
import type OneDatastore from '../datastores/OneDatastore'
import type JajanItemSnapshotAggregate from '../../inners/models/aggregates/JajanItemSnapshotAggregate'
import type RepositoryArgument from '../../inners/models/value_objects/RepositoryArgument'

export default class JajanItemSnapshotRepository {
  oneDatastore: OneDatastore
  aggregatedArgs?: any

  constructor (
    oneDatastore: OneDatastore
  ) {
    this.oneDatastore = oneDatastore
  }

  readMany = async (repositoryArgument: RepositoryArgument): Promise<JajanItemSnapshot[] | JajanItemSnapshotAggregate[]> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundJajanItemSnapshots: JajanItemSnapshot[] | JajanItemSnapshotAggregate[] = await this.oneDatastore.client.jajanItemSnapshot.findMany(args)
    if (foundJajanItemSnapshots === null) {
      throw new Error('Found jajanItemSnapshots is undefined.')
    }

    return foundJajanItemSnapshots
  }

  createOne = async (repositoryArgument: RepositoryArgument): Promise<JajanItemSnapshot | JajanItemSnapshotAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const createdJajanItemSnapshot: JajanItemSnapshot | JajanItemSnapshotAggregate = await this.oneDatastore.client.jajanItemSnapshot.create(args)

    return createdJajanItemSnapshot
  }

  readOne = async (repositoryArgument: RepositoryArgument): Promise<JajanItemSnapshot | JajanItemSnapshotAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundJajanItemSnapshot: JajanItemSnapshot | JajanItemSnapshotAggregate | null = await this.oneDatastore.client.jajanItemSnapshot.findFirst(args)
    if (foundJajanItemSnapshot === null) {
      throw new Error('Found jajanItemSnapshot is null.')
    }

    return foundJajanItemSnapshot
  }

  patchOne = async (repositoryArgument: RepositoryArgument): Promise<JajanItemSnapshot | JajanItemSnapshotAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const patchedUser: JajanItemSnapshot | JajanItemSnapshotAggregate = await this.oneDatastore.client.jajanItemSnapshot.update(args)
    if (patchedUser === null) {
      throw new Error('Patched jajanItemSnapshot is undefined.')
    }

    return patchedUser
  }

  deleteOne = async (repositoryArgument: RepositoryArgument): Promise<JajanItemSnapshot | JajanItemSnapshotAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const deletedJajanItemSnapshot: JajanItemSnapshot | JajanItemSnapshotAggregate = await this.oneDatastore.client.jajanItemSnapshot.delete(args)

    return deletedJajanItemSnapshot
  }

  createMany = async (repositoryArgument: RepositoryArgument): Promise<JajanItemSnapshot[] | JajanItemSnapshotAggregate[]> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    await this.oneDatastore.client.jajanItemSnapshot.createMany(args)

    return repositoryArgument.data
  }
}
