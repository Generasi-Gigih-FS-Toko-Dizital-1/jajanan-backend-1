import { type $Enums } from '@prisma/client'

export default class RegisterUserRequest {
  fullName: string
  username: string
  email: string
  password: string
  address: string
  balance: number
  experience: number
  gender: $Enums.Gender | null
  lastLatitude: number
  lastLongitude: number

  constructor (fullName: string, username: string, email: string, password: string, address: string, balance: number, experience: number, gender: $Enums.Gender | null, lastLatitude: number, lastLongitude: number) {
    this.fullName = fullName
    this.username = username
    this.email = email
    this.password = password
    this.address = address
    this.balance = balance
    this.experience = experience
    this.gender = gender
    this.lastLatitude = lastLatitude
    this.lastLongitude = lastLongitude
  }
}
