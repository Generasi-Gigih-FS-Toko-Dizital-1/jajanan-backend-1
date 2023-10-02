import type VendorManagementReadOneResponse from './VendorManagementReadOneResponse'

export default class VendorManagementReadManyResponse {
  totalVendors: number
  vendors: VendorManagementReadOneResponse[]

  constructor (
    totalVendors: number,
    vendors: VendorManagementReadOneResponse[]
  ) {
    this.totalVendors = totalVendors
    this.vendors = vendors
  }
}
