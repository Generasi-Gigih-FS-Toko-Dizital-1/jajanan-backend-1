import { type Vendor } from '@prisma/client'

export default class SyncUserLocationResponse {
  nearbyVendors: Vendor[]

  constructor (nearbyVendors: Vendor[]) {
    this.nearbyVendors = nearbyVendors
  }
}
