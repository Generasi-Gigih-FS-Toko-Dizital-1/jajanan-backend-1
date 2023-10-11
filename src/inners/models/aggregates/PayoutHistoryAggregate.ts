import { type Prisma } from '@prisma/client'

type PayoutHistoryAggregate = Prisma.PayoutHistoryGetPayload<{
  include: Prisma.PayoutHistoryInclude<any>
}>

export default PayoutHistoryAggregate
