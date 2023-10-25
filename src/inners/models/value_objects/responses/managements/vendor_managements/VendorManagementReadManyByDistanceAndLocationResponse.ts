import type VendorManagementReadOneByDistanceAndLocationResponse
  from './VendorManagementReadOneByDistanceAndLocationResponse'

export default class VendorManagementReadManyByDistanceAndLocationResponse {
  totalVendors: number
  nearbyVendors: VendorManagementReadOneByDistanceAndLocationResponse[]

  constructor (totalVendors: number, nearbyVendors: VendorManagementReadOneByDistanceAndLocationResponse[]) {
    this.totalVendors = totalVendors
    this.nearbyVendors = nearbyVendors
  }
}
