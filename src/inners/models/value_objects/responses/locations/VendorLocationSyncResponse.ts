import { type User } from '@prisma/client'

export default class VendorLocationSyncResponse {
  nearbyUsers: User[]

  constructor (nearbyUsers: User[]) {
    this.nearbyUsers = nearbyUsers
  }
}
