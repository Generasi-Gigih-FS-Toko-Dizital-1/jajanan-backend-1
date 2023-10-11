import type VendorLevelManagementReadOneResponse from './VendorLevelManagementReadOneResponse'

export default class VendorLevelManagementReadManyResponse {
  totalVendorLevels: number
  vendorLevels: VendorLevelManagementReadOneResponse[]

  constructor (
    totalVendorLevels: number,
    vendorLevels: VendorLevelManagementReadOneResponse[]
  ) {
    this.totalVendorLevels = totalVendorLevels
    this.vendorLevels = vendorLevels
  }
}
