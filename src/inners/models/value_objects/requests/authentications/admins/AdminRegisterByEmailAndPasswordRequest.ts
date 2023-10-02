import { type Gender } from '@prisma/client'

export default class AdminRegisterByEmailAndPasswordRequest {
  fullName: string
  gender: Gender
  email: string
  password: string
  address: string

  constructor (fullName: string, gender: Gender, email: string, password: string, address: string) {
    this.fullName = fullName
    this.gender = gender
    this.email = email
    this.password = password
    this.address = address
  }
}
