import { type Prisma } from '@prisma/client'

type JajanItemAggregate = Prisma.JajanItemGetPayload<{
  include: Prisma.JajanItemInclude<any>
}>

export default JajanItemAggregate
