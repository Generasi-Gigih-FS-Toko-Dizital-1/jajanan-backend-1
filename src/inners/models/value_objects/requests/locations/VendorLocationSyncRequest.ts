export default class VendorLocationSyncRequest {
  vendorId: string
  lastLatitude: number
  lastLongitude: number
  maxDistance: number

  constructor (vendorId: string, lastLatitude: number, lastLongitude: number, maxDistance: number) {
    this.vendorId = vendorId
    this.lastLatitude = lastLatitude
    this.lastLongitude = lastLongitude
    this.maxDistance = maxDistance
  }
}
