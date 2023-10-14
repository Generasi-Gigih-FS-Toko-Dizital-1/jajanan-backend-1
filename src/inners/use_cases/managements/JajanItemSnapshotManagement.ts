import { type JajanItemSnapshot } from '@prisma/client'
import type JajanItemSnapshotRepository from '../../../outers/repositories/JajanItemSnapshotRepository'
import type Pagination from '../../models/value_objects/Pagination'
import Result from '../../models/value_objects/Result'
import type ObjectUtility from '../../../outers/utilities/ObjectUtility'

export default class JajanItemSnapshotManagement {
  jajanItemSnapshotRepository: JajanItemSnapshotRepository
  objectUtility: ObjectUtility

  constructor (jajananItemRepository: JajanItemSnapshotRepository, objectUtility: ObjectUtility) {
    this.jajanItemSnapshotRepository = jajananItemRepository
    this.objectUtility = objectUtility
  }

  readMany = async (pagination: Pagination, whereInput: any, includeInput: any): Promise<Result<JajanItemSnapshot[]>> => {
    const foundJajanItemSnapshots: JajanItemSnapshot[] = await this.jajanItemSnapshotRepository.readMany(pagination, whereInput, includeInput)
    return new Result<JajanItemSnapshot[]>(
      200,
      'Jajan Item Snapshot Snapshots read many succeed.',
      foundJajanItemSnapshots
    )
  }

  readManyByIds = async (ids: string[]): Promise<Result<JajanItemSnapshot[]>> => {
    const foundJajanItemSnapshots: JajanItemSnapshot[] = await this.jajanItemSnapshotRepository.readManyByIds(ids)
    return new Result<JajanItemSnapshot[]>(
      200,
      'Jajan Item Snapshot Snapshots read many by ids succeed.',
      foundJajanItemSnapshots
    )
  }

  readOneById = async (id: string): Promise<Result<JajanItemSnapshot | null>> => {
    let foundJajanItemSnapshot: JajanItemSnapshot
    try {
      foundJajanItemSnapshot = await this.jajanItemSnapshotRepository.readOneById(id)
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
      createdJajanItemSnapshot = await this.jajanItemSnapshotRepository.createOne(jajanItemSnapshot)
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
      createdJajanItemSnapshots = await this.jajanItemSnapshotRepository.createMany(jajanItemSnapshots)
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
    const patchedJajanItemSnapshot: JajanItemSnapshot = await this.jajanItemSnapshotRepository.patchOneById(id, foundJajanItemSnapshot.data)
    return new Result<JajanItemSnapshot>(
      200,
      'Jajan Item Snapshot patch one raw by id succeed.',
      patchedJajanItemSnapshot
    )
  }

  deleteOneById = async (id: string): Promise<Result<JajanItemSnapshot | null>> => {
    let deletedJajanItemSnapshot: JajanItemSnapshot
    try {
      deletedJajanItemSnapshot = await this.jajanItemSnapshotRepository.deleteOneById(id)
    } catch (error) {
      return new Result<null>(
        500,
        'JajanItemSnapshot delete one by id failed',
        null
      )
    }
    return new Result<JajanItemSnapshot>(
      200,
      'Jajan Item Snapshot delete one by id succeed.',
      deletedJajanItemSnapshot
    )
  }
}
