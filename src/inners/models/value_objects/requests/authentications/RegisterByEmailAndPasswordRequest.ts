import { type Gender } from '@prisma/client'

export default class RegisterByEmailAndPasswordRequest {
  fullName: string
  gender: Gender
  username: string
  email: string
  password: string
  address: string

  constructor (fullName: string, gender: Gender, username: string, email: string, password: string, address: string) {
    this.fullName = fullName
    this.gender = gender
    this.username = username
    this.email = email
    this.password = password
    this.address = address
  }
}
