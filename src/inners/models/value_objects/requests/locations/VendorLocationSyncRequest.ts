export default class VendorLocationSyncRequest {
  vendorId: string
  lastLatitude: number
  lastLongitude: number
  maxDistance: number
  isNotifyUsers: boolean

  constructor (vendorId: string, lastLatitude: number, lastLongitude: number, maxDistance: number, isNotifyUsers: boolean) {
    this.vendorId = vendorId
    this.lastLatitude = lastLatitude
    this.lastLongitude = lastLongitude
    this.maxDistance = maxDistance
    this.isNotifyUsers = isNotifyUsers
  }
}
