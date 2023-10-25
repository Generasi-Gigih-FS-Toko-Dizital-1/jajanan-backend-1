import { type PayoutHistory } from '@prisma/client'
import type PayoutHistoryRepository from '../../../outers/repositories/PayoutHistoryRepository'
import type ObjectUtility from '../../../outers/utilities/ObjectUtility'
import RepositoryArgument from '../../models/value_objects/RepositoryArgument'
import Result from '../../models/value_objects/Result'
import type VendorManagement from './VendorManagement'
import type Pagination from '../../models/value_objects/Pagination'
import { randomUUID } from 'crypto'
import type PayoutHistoryManagementCreateRequest
  from '../../models/value_objects/requests/managements/payout_history_management/PayoutHistoryManagementCreateRequest'
import type PayoutHistoryManagementPatchRequest
  from '../../models/value_objects/requests/managements/payout_history_management/PayoutHistoryManagementPatchRequest'
import type PayoutHistoryAggregate from '../../models/aggregates/PayoutHistoryAggregate'

export default class PayoutHistoryManagement {
  constructor (
    private readonly payoutHistoryRepository: PayoutHistoryRepository,
    private readonly vendorManagement: VendorManagement,
    public readonly objectUtility: ObjectUtility) {}

  readMany = async (pagination: Pagination, whereInput: any, includeInput: any): Promise<Result<PayoutHistory[]>> => {
    const args: RepositoryArgument = new RepositoryArgument(
      whereInput,
      includeInput,
      pagination
    )
    const foundPayoutHistories: PayoutHistory[] = await this.payoutHistoryRepository.readMany(args)
    return new Result<PayoutHistory[]>(
      200,
      'PayoutHistory read many succeed.',
      foundPayoutHistories
    )
  }

  readOneById = async (id: string): Promise<Result<PayoutHistory | null>> => {
    let foundPayoutHistory: PayoutHistory | null
    try {
      const arg: RepositoryArgument = new RepositoryArgument({ id })
      foundPayoutHistory = await this.payoutHistoryRepository.readOne(arg)
    } catch (error) {
      return new Result<null>(404, `PayoutHistory read one by id failed, ${(error as Error).message}`, null)
    }

    return new Result<PayoutHistory>(200, 'PayoutHistory read one by id succeed.', foundPayoutHistory)
  }

  createOne = async (request: PayoutHistoryManagementCreateRequest): Promise<Result<PayoutHistory | null>> => {
    const payoutHistoryToCreate: PayoutHistory = {
      id: randomUUID(),
      xenditPayoutId: request.xenditPayoutId,
      vendorId: request.vendorId,
      amount: request.amount,
      media: request.media,
      updatedAt: new Date(),
      createdAt: new Date(),
      deletedAt: null
    }

    const createdPayoutHistory: Result<PayoutHistory | null> = await this.createOneRaw(payoutHistoryToCreate)

    if (createdPayoutHistory.status !== 201 || createdPayoutHistory.data === null) {
      return new Result<null>(createdPayoutHistory.status, `PayoutHistory create one failed, ${createdPayoutHistory.message}`, null)
    }

    return new Result<PayoutHistory>(201, 'PayoutHistory create one succeed.', createdPayoutHistory.data)
  }

  createOneRaw = async (payoutHistory: PayoutHistory): Promise<Result<PayoutHistory | null>> => {
    const foundVendor: Result<any> = await this.vendorManagement.readOneById(payoutHistory.vendorId)
    if (foundVendor.status !== 200 || foundVendor.data === null) {
      return new Result<null>(404, 'PayoutHistory create one failed, vendor is not found.', null)
    }

    const args: RepositoryArgument = new RepositoryArgument(
      undefined,
      undefined,
      undefined,
      payoutHistory
    )

    const createdPayoutHistory: PayoutHistory | null = await this.payoutHistoryRepository.createOne(args)

    return new Result<PayoutHistory | null>(201, 'PayoutHistory create one succeed.', createdPayoutHistory)
  }

  patchOneById = async (id: string, request: PayoutHistoryManagementPatchRequest): Promise<Result<PayoutHistory | null>> => {
    const patchedPayoutHistory: Result<PayoutHistory | null> = await this.patchOneRawByid(id, request)

    if (patchedPayoutHistory.status !== 200 || patchedPayoutHistory.data === null) {
      return new Result<null>(patchedPayoutHistory.status, `PayoutHistory patch one by id failed, ${patchedPayoutHistory.message}`, null)
    }

    return new Result<PayoutHistory>(200, 'PayoutHistory patch one by id succeed.', patchedPayoutHistory.data)
  }

  patchOneRawByid = async (id: string, request: any): Promise<Result<PayoutHistory | null>> => {
    const foundPayoutHistory: Result<PayoutHistory | null> = await this.readOneById(id)
    if (foundPayoutHistory.status !== 200 || foundPayoutHistory.data === null) {
      return new Result<null>(404, 'PayoutHistory patch one by id failed, payout history is not found.', null)
    }

    this.objectUtility.patch(foundPayoutHistory.data, request)
    const args: RepositoryArgument = new RepositoryArgument(
      { id },
      undefined,
      undefined,
      foundPayoutHistory.data
    )

    const patchedPayoutHistory: PayoutHistory | null = await this.payoutHistoryRepository.patchOne(args)

    return new Result<PayoutHistory | null>(200, 'PayoutHistory patch one by id succeed.', patchedPayoutHistory)
  }

  deleteOneById = async (id: string): Promise<Result<PayoutHistory | null>> => {
    const args: RepositoryArgument = new RepositoryArgument(
      { id }
    )
    const deletedPayoutHistory: PayoutHistory | PayoutHistoryAggregate = await this.payoutHistoryRepository.deleteOne(args)

    return new Result<PayoutHistory>(
      200, 'PayoutHistory delete one by id succeed.', deletedPayoutHistory
    )
  }
}
