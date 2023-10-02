import { type Gender } from '@prisma/client'

export default class UserManagementPatchRequest {
  fullName: string
  gender: Gender
  username: string
  email: string
  password: string
  last_latitude: number
  last_longitude: number

  constructor (fullName: string, gender: Gender, username: string, email: string, password: string, last_latitude: number, last_longitude: number) {
    this.fullName = fullName
    this.gender = gender
    this.username = username
    this.email = email
    this.password = password
    this.last_latitude = last_latitude
    this.last_longitude = last_longitude
  }
}
