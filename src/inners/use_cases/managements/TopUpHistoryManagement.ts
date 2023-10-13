import { type TopUpHistory } from '@prisma/client'
import type TopUpHistoryRepository from '../../../outers/repositories/TopUpHistoryRepository'
import type ObjectUtility from '../../../outers/utilities/ObjectUtility'
import type Pagination from '../../models/value_objects/Pagination'
import Result from '../../models/value_objects/Result'
import type TopUpHistoryManagementCreateRequest from '../../models/value_objects/requests/managements/top_up_history_management/TopUpHistoryManagementCreateRequest'
import { randomUUID } from 'crypto'
import type UserManagement from './UserManagement'
import type TopUpHistoryManagementPatchRequest from '../../models/value_objects/requests/managements/top_up_history_management/TopUpHistoryManagementPatchRequest'

export default class TopUpHistoryManagement {
  topUpHistoryRepository: TopUpHistoryRepository
  userManagement: UserManagement
  objectUtility: ObjectUtility

  constructor (topUpHistoryRepository: TopUpHistoryRepository, userManagement: UserManagement, objectUtility: ObjectUtility) {
    this.topUpHistoryRepository = topUpHistoryRepository
    this.userManagement = userManagement
    this.objectUtility = objectUtility
  }

  readMany = async (pagination: Pagination, whereInput: any, includeInput: any): Promise<Result<TopUpHistory[]>> => {
    const foundTopUpHistories: TopUpHistory[] = await this.topUpHistoryRepository.readMany(pagination, whereInput, includeInput)
    return new Result<TopUpHistory[]>(
      200,
      'TopUpHistory read many succeed.',
      foundTopUpHistories
    )
  }

  readOneById = async (id: string): Promise<Result<TopUpHistory | null>> => {
    let foundTopUpHistory: TopUpHistory | null
    try {
      foundTopUpHistory = await this.topUpHistoryRepository.readOneById(id)
    } catch (error) {
      return new Result<TopUpHistory | null>(400, 'TopUpHistory read one by id failed, topup history not found', null)
    }
    return new Result<TopUpHistory | null>(200, 'TopUpHistory read one by id succeed.', foundTopUpHistory)
  }

  readManyByUserId = async (userId: string, pagination: Pagination, includeInput: any): Promise<Result<TopUpHistory[]>> => {
    const foundTopUpHistories: TopUpHistory[] = await this.topUpHistoryRepository.readManyByUserId(userId, pagination, includeInput)
    return new Result<TopUpHistory[]>(
      200,
      'TopUpHistory read many by user id succeed.',
      foundTopUpHistories
    )
  }

  createOne = async (request: TopUpHistoryManagementCreateRequest): Promise<Result<TopUpHistory | null>> => {
    const topUpHistoryToCreate: TopUpHistory = {
      id: randomUUID(),
      ...request,
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

    const createdTopUpHistory: TopUpHistory | null = await this.topUpHistoryRepository.createOne(topUpHistory)

    return new Result<TopUpHistory | null>(201, 'TopUpHistory create one succeed.', createdTopUpHistory)
  }

  patchOneById = async (id: string, request: TopUpHistoryManagementPatchRequest): Promise<Result<TopUpHistory | null>> => {
    const patchedTopUpHistory: Result<TopUpHistory | null> = await this.patchOneByIdRaw(id, request)

    if (patchedTopUpHistory.status !== 200 || patchedTopUpHistory.data === null) {
      return new Result<null>(patchedTopUpHistory.status, `TopUpHistory patch one by id failed, ${patchedTopUpHistory.message}`, null)
    }

    return new Result<TopUpHistory>(200, 'TopUpHistory patch one by id succeed.', patchedTopUpHistory.data)
  }

  patchOneByIdRaw = async (id: string, request: TopUpHistoryManagementPatchRequest): Promise<Result<TopUpHistory | null>> => {
    const foundTopUpHistory: Result<TopUpHistory | null> = await this.readOneById(id)
    if (foundTopUpHistory.status !== 200 || foundTopUpHistory.data === null) {
      return new Result<null>(404, 'TopUpHistory patch one by id failed, topup history is not found.', null)
    }

    this.objectUtility.patch(foundTopUpHistory.data, request)

    const patchedTopUpHistory: TopUpHistory | null = await this.topUpHistoryRepository.patchOneById(id, foundTopUpHistory.data)

    return new Result<TopUpHistory | null>(200, 'TopUpHistory patch one by id succeed.', patchedTopUpHistory)
  }

  deleteOneById = async (id: string): Promise<Result<TopUpHistory | null>> => {
    const deletedTopUpHistory: any = await this.topUpHistoryRepository.deleteOneById(id)
    return new Result<TopUpHistory>(
      200, 'TopUpHistory delete one by id succeed.', deletedTopUpHistory
    )
  }
}
