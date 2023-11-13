import { type Vendor } from '@prisma/client'

export default class PayoutHistoryManagementReadOneResponse {
  constructor (
    public id: string,
    public vendorId: string,
    public xenditPayoutId: string,
    public amount: number,
    public media: string,
    public updatedAt: Date,
    public createdAt: Date,
    public deletedAt: Date | null = null,
    public vendor?: Vendor
  ) {}
}
