import { type Prisma } from '@prisma/client'

type UserSubscription = Prisma.UserSubscriptionGetPayload<{
  include: Prisma.UserSubscriptionInclude<any>
}>

export default UserSubscription
