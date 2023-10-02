import { type Prisma } from '@prisma/client'

type VendorAggregate = Prisma.VendorGetPayload<{
  include: Prisma.VendorInclude<any>
}>

export default VendorAggregate
