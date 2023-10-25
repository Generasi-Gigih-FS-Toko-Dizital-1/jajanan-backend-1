import { type Vendor } from '@prisma/client'
import type VendorAggregate from '../../../../aggregates/VendorAggregate'

export default class VendorManagementReadOneByDistanceAndLocationResponse {
  vendor: Vendor | VendorAggregate
  distance: number

  constructor (vendor: Vendor | VendorAggregate, distance: number) {
    this.vendor = vendor
    this.distance = distance
  }
}
