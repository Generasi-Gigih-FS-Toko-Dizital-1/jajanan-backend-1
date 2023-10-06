import { type Gender } from '@prisma/client'

export default class UserRegisterByEmailAndPasswordRequest {
  fullName: string
  gender: Gender
  username: string
  email: string
  password: string
  address: string
  lastLatitude: number
  lastLongitude: number

  constructor (fullName: string, gender: Gender, username: string, email: string, password: string, address: string, lastLatitude: number, lastLongitude: number) {
    this.fullName = fullName
    this.gender = gender
    this.username = username
    this.email = email
    this.password = password
    this.address = address
    this.lastLatitude = lastLatitude
    this.lastLongitude = lastLongitude
  }
}
