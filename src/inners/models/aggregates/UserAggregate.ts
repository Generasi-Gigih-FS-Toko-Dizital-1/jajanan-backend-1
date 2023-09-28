import { type Prisma } from '@prisma/client'

type UserAggregate = Prisma.UserGetPayload<{
  include: Prisma.UserInclude<any>
}>

export default UserAggregate
