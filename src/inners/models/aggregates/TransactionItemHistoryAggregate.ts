import { type Prisma } from '@prisma/client'

type TransactionHistoryAggregate = Prisma.TransactionHistoryGetPayload<{
  include: Prisma.TransactionHistoryInclude<any>
}>

export default TransactionHistoryAggregate
