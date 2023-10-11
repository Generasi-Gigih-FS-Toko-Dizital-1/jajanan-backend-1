import { type Gender } from '@prisma/client'

export default class UserManagementCreateRequest {
  fullName: string
  gender: Gender
  address: string
  username: string
  email: string
  password: string
  lastLatitude: number
  lastLongitude: number

  constructor (fullName: string, gender: Gender, address: string, username: string, email: string, password: string, lastLatitude: number, lastLongitude: number) {
    this.fullName = fullName
    this.gender = gender
    this.address = address
    this.username = username
    this.email = email
    this.password = password
    this.lastLatitude = lastLatitude
    this.lastLongitude = lastLongitude
  }
}
