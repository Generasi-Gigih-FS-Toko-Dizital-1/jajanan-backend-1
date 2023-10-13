import { type Prisma } from '@prisma/client'

type JajanItemSnapshotAggregate = Prisma.JajanItemSnapshotGetPayload<{
  include: Prisma.JajanItemSnapshotInclude<any>
}>

export default JajanItemSnapshotAggregate
