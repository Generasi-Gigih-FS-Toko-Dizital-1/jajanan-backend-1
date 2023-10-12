import { type Prisma } from '@prisma/client'

type TopUpHistoryAggregate = Prisma.TopUpHistoryGetPayload<{
  include: Prisma.TopUpHistoryInclude<any>
}>

export default TopUpHistoryAggregate
