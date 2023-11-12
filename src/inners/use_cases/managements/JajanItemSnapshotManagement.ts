import { type JajanItemSnapshot } from '@prisma/client'
import type JajanItemSnapshotRepository from '../../../outers/repositories/JajanItemSnapshotRepository'
import type Pagination from '../../models/value_objects/Pagination'
import Result from '../../models/value_objects/Result'
import type ObjectUtility from '../../../outers/utilities/ObjectUtility'
import RepositoryArgument from '../../models/value_objects/RepositoryArgument'

export default class JajanItemSnapshotManagement {
  jajanItemSnapshotRepository: JajanItemSnapshotRepository
  objectUtility: ObjectUtility

  constructor (jajananItemRepository: JajanItemSnapshotRepository, objectUtility: ObjectUtility) {
    this.jajanItemSnapshotRepository = jajananItemRepository
    this.objectUtility = objectUtility
  }

  readMany = async (pagination: Pagination, whereInput: any, includeInput: any): Promise<Result<JajanItemSnapshot[]>> => {
    const args: RepositoryArgument = new RepositoryArgument(
      whereInput,
      includeInput,
      pagination
    )
    const foundJajanItemSnapshots: JajanItemSnapshot[] = await this.jajanItemSnapshotRepository.readMany(args)
    return new Result<JajanItemSnapshot[]>(
      200,
      'Jajan Item Snapshot Snapshots read many succeed.',
      foundJajanItemSnapshots
    )
  }

  readManyByIds = async (ids: string[]): Promise<Result<JajanItemSnapshot[]>> => {
    const args: RepositoryArgument = new RepositoryArgument(
      { id: { in: ids } },
      undefined,
      undefined
    )
    const foundJajanItemSnapshots: JajanItemSnapshot[] = await this.jajanItemSnapshotRepository.readMany(args)
    return new Result<JajanItemSnapshot[]>(
      200,
      'Jajan Item Snapshot Snapshots read many by ids succeed.',
      foundJajanItemSnapshots
    )
  }

  readOneById = async (id: string): Promise<Result<JajanItemSnapshot | null>> => {
    let foundJajanItemSnapshot: JajanItemSnapshot
    try {
      const args: RepositoryArgument = new RepositoryArgument(
        { id }
      )
      foundJajanItemSnapshot = await this.jajanItemSnapshotRepository.readOne(args)
    } catch (error) {
      return new Result<null>(
        404,
        'Jajan Item Snapshot read one by id failed, jajan item is not found.',
        null
      )
    }
    return new Result<JajanItemSnapshot>(
      200,
      'Jajan Item Snapshot read one by id succeed.',
      foundJajanItemSnapshot
    )
  }

  createOneRaw = async (jajanItemSnapshot: JajanItemSnapshot): Promise<Result<JajanItemSnapshot | null>> => {
    let createdJajanItemSnapshot: JajanItemSnapshot
    try {
      const args: RepositoryArgument = new RepositoryArgument(
        undefined,
        undefined,
        undefined,
        jajanItemSnapshot
      )
      createdJajanItemSnapshot = await this.jajanItemSnapshotRepository.createOne(args)
    } catch (error) {
      return new Result<null>(
        500,
        `Jajan Item Snapshot create one failed, ${(error as Error).message}`,
        null
      )
    }
    return new Result<JajanItemSnapshot>(
      201,
      'Jajan Item Snapshot create one succeed.',
      createdJajanItemSnapshot
    )
  }

  createManyRaw = async (jajanItemSnapshots: JajanItemSnapshot[]): Promise<Result<JajanItemSnapshot[] | null>> => {
    let createdJajanItemSnapshots: JajanItemSnapshot[]
    try {
      const args: RepositoryArgument = new RepositoryArgument(
        undefined,
        undefined,
        undefined,
        jajanItemSnapshots
      )
      createdJajanItemSnapshots = await this.jajanItemSnapshotRepository.createMany(args)
    } catch (error) {
      return new Result<null>(
        500,
          `Jajan Item Snapshot create many failed, ${(error as Error).message}`,
          null
      )
    }
    return new Result<JajanItemSnapshot[]>(
      201,
      'Jajan Item Snapshot create many succeed.',
      createdJajanItemSnapshots
    )
  }

  patchOneRawById = async (id: string, request: any): Promise<Result<JajanItemSnapshot | null>> => {
    const foundJajanItemSnapshot: Result<JajanItemSnapshot | null> = await this.readOneById(id)
    if (foundJajanItemSnapshot.status !== 200 || foundJajanItemSnapshot.data === null) {
      return new Result<null>(
        404,
        'Jajan Item Snapshot patch one raw by id failed, jajan item is not found.',
        null
      )
    }
    this.objectUtility.patch(foundJajanItemSnapshot.data, request)
    const args: RepositoryArgument = new RepositoryArgument(
      { id },
      undefined,
      undefined,
      foundJajanItemSnapshot.data
    )
    const patchedJajanItemSnapshot: JajanItemSnapshot = await this.jajanItemSnapshotRepository.patchOne(args)
    return new Result<JajanItemSnapshot>(
      200,
      'Jajan Item Snapshot patch one raw by id succeed.',
      patchedJajanItemSnapshot
    )
  }

  deleteOneById = async (id: string, method: string): Promise<Result<JajanItemSnapshot | null>> => {
    try {
      let deletedJajanItemSnapshot: JajanItemSnapshot
      const args: RepositoryArgument = new RepositoryArgument(
        { id }
      )
      if (method === 'hard') {
        deletedJajanItemSnapshot = await this.jajanItemSnapshotRepository.deleteOne(args)
      } else if (method === 'soft') {
        const jajanItemSnapshot: JajanItemSnapshot = await this.jajanItemSnapshotRepository.readOne(args)

        const newJajanItemSnapshot: JajanItemSnapshot = {
          ...jajanItemSnapshot,
          deletedAt: new Date()
        }

        const softDeleteArgs: RepositoryArgument = new RepositoryArgument(
          { id },
          undefined,
          undefined,
          newJajanItemSnapshot
        )

        deletedJajanItemSnapshot = await this.jajanItemSnapshotRepository.patchOne(softDeleteArgs)
      } else {
        return new Result<null>(
          400,
          'Invalid deletion method. Use "hard" or "soft".',
          null
        )
      }

      return new Result<JajanItemSnapshot>(
        200,
        'Jajan Item Snapshot delete one by id succeed.',
        deletedJajanItemSnapshot
      )
    } catch (error) {
      const errorMessage = (error as Error).message
      return new Result<null>(
        404,
        `JajajnItemSnapshot delete one by id failed, ${errorMessage}`,
        null
      )
    }
  }
}
