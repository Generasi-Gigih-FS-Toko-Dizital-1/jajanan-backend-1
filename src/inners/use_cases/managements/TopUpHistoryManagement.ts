import { type TopUpHistory } from '@prisma/client'
import type TopUpHistoryRepository from '../../../outers/repositories/TopUpHistoryRepository'
import type ObjectUtility from '../../../outers/utilities/ObjectUtility'
import type Pagination from '../../models/value_objects/Pagination'
import Result from '../../models/value_objects/Result'
import type TopUpHistoryManagementCreateRequest
  from '../../models/value_objects/requests/managements/top_up_history_managements/TopUpHistoryManagementCreateRequest'
import { randomUUID } from 'crypto'
import type UserManagement from './UserManagement'
import type TopUpHistoryManagementPatchRequest
  from '../../models/value_objects/requests/managements/top_up_history_managements/TopUpHistoryManagementPatchRequest'
import RepositoryArgument from '../../models/value_objects/RepositoryArgument'
import type TopUpHistoryAggregate from '../../models/aggregates/TopUpHistoryAggregate'

export default class TopUpHistoryManagement {
  topUpHistoryRepository: TopUpHistoryRepository
  userManagement: UserManagement
  objectUtility: ObjectUtility

  constructor (topUpHistoryRepository: TopUpHistoryRepository, userManagement: UserManagement, objectUtility: ObjectUtility) {
    this.topUpHistoryRepository = topUpHistoryRepository
    this.userManagement = userManagement
    this.objectUtility = objectUtility
  }

  readMany = async (pagination: Pagination, whereInput: any, includeInput: any): Promise<Result<TopUpHistory[] | TopUpHistoryAggregate[]>> => {
    const args: RepositoryArgument = new RepositoryArgument(
      whereInput,
      includeInput,
      pagination
    )
    const foundTopUpHistories: TopUpHistory[] = await this.topUpHistoryRepository.readMany(args)
    return new Result<TopUpHistory[]>(
      200,
      'TopUpHistory read many succeed.',
      foundTopUpHistories
    )
  }

  readOneById = async (id: string): Promise<Result<TopUpHistory | null>> => {
    let foundTopUpHistory: TopUpHistory | null
    try {
      const args: RepositoryArgument = new RepositoryArgument(
        { id }
      )
      foundTopUpHistory = await this.topUpHistoryRepository.readOne(args)
    } catch (error) {
      return new Result<null>(404, 'TopUpHistory read one by id failed, topup history not found', null)
    }
    return new Result<TopUpHistory>(200, 'TopUpHistory read one by id succeed.', foundTopUpHistory)
  }

  createOne = async (request: TopUpHistoryManagementCreateRequest): Promise<Result<TopUpHistory | null>> => {
    const topUpHistoryToCreate: TopUpHistory = {
      id: randomUUID(),
      userId: request.userId,
      xenditInvoiceId: request.xenditInvoiceId,
      amount: request.amount,
      media: request.media,
      updatedAt: new Date(),
      createdAt: new Date(),
      deletedAt: null
    }

    const createdTopUpHistory: Result<TopUpHistory | null> = await this.createOneRaw(topUpHistoryToCreate)

    if (createdTopUpHistory.status !== 201 || createdTopUpHistory.data === null) {
      return new Result<null>(createdTopUpHistory.status, `TopUpHistory create one failed, ${createdTopUpHistory.message}`, null)
    }

    return new Result<TopUpHistory>(201, 'TopUpHistory create one succeed.', createdTopUpHistory.data)
  }

  createOneRaw = async (topUpHistory: TopUpHistory): Promise<Result<TopUpHistory | null>> => {
    const foundUser: Result<any> = await this.userManagement.readOneById(topUpHistory.userId)
    if (foundUser.status !== 200 || foundUser.data === null) {
      return new Result<null>(404, 'TopUpHistory create one failed, user is not found.', null)
    }

    const args: RepositoryArgument = new RepositoryArgument(
      undefined,
      undefined,
      undefined,
      topUpHistory
    )
    const createdTopUpHistory: TopUpHistory | null = await this.topUpHistoryRepository.createOne(args)

    return new Result<TopUpHistory | null>(201, 'TopUpHistory create one succeed.', createdTopUpHistory)
  }

  patchOneById = async (id: string, request: TopUpHistoryManagementPatchRequest): Promise<Result<TopUpHistory | null>> => {
    const patchedTopUpHistory: Result<TopUpHistory | null> = await this.patchOneRawById(id, request)

    if (patchedTopUpHistory.status !== 200 || patchedTopUpHistory.data === null) {
      return new Result<null>(patchedTopUpHistory.status, `TopUpHistory patch one by id failed, ${patchedTopUpHistory.message}`, null)
    }

    return new Result<TopUpHistory>(200, 'TopUpHistory patch one by id succeed.', patchedTopUpHistory.data)
  }

  patchOneRawById = async (id: string, request: any): Promise<Result<TopUpHistory | null>> => {
    const foundTopUpHistory: Result<TopUpHistory | null> = await this.readOneById(id)
    if (foundTopUpHistory.status !== 200 || foundTopUpHistory.data === null) {
      return new Result<null>(404, 'TopUpHistory patch one by id failed, topup history is not found.', null)
    }

    this.objectUtility.patch(foundTopUpHistory.data, request)
    const args: RepositoryArgument = new RepositoryArgument(
      { id },
      undefined,
      undefined,
      foundTopUpHistory.data
    )

    const patchedTopUpHistory: TopUpHistory | null = await this.topUpHistoryRepository.patchOne(args)

    return new Result<TopUpHistory | null>(200, 'TopUpHistory patch one by id succeed.', patchedTopUpHistory)
  }

  deleteHardOneById = async (id: string): Promise<Result<TopUpHistory | null>> => {
    let deletedTopUpHistory: TopUpHistory
    try {
      const args: RepositoryArgument = new RepositoryArgument(
        { id },
        undefined,
        undefined,
        undefined
      )
      deletedTopUpHistory = await this.topUpHistoryRepository.deleteOne(args)
    } catch (error) {
      return new Result<null>(
        404,
        'TopUpHistory delete one by id failed, top up history is not found.',
        null
      )
    }
    return new Result<TopUpHistory>(
      200,
      'TopUpHistory delete one by id succeed.',
      deletedTopUpHistory
    )
  }

  deleteSoftOneById = async (id: string): Promise<Result<TopUpHistory | null>> => {
    let deletedTopUpHistory: TopUpHistory
    try {
      const foundTopUpHistory: Result<TopUpHistory | null> = await this.readOneById(id)
      if (foundTopUpHistory.status !== 200 || foundTopUpHistory.data === null) {
        return new Result<null>(
          foundTopUpHistory.status,
          'TopUpHistory delete soft one by id failed, top up history is not found.',
          null
        )
      }

      foundTopUpHistory.data.deletedAt = new Date()

      const args: RepositoryArgument = new RepositoryArgument(
        { id },
        undefined,
        undefined,
        foundTopUpHistory.data
      )
      deletedTopUpHistory = await this.topUpHistoryRepository.patchOne(args)
    } catch (error) {
      return new Result<null>(
        404,
        'TopUpHistory delete soft one by id failed, top up history is not found.',
        null
      )
    }
    return new Result<TopUpHistory>(
      200,
      'TopUpHistory delete one by id succeed.',
      deletedTopUpHistory
    )
  }
}
