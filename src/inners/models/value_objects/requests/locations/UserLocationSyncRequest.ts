export default class UserLocationSyncRequest {
  userId: string
  lastLatitude: number
  lastLongitude: number
  maxDistance: number

  constructor (userId: string, lastLatitude: number, lastLongitude: number, maxDistance: number) {
    this.userId = userId
    this.lastLatitude = lastLatitude
    this.lastLongitude = lastLongitude
    this.maxDistance = maxDistance
  }
}
