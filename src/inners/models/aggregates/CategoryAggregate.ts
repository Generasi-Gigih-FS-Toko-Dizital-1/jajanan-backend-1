import { type Prisma } from '@prisma/client'

type CategoryAggregate = Prisma.CategoryGetPayload<{
  include: Prisma.CategoryInclude<any>
}>

export default CategoryAggregate
