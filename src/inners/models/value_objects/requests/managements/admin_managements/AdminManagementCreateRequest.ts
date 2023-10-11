import { type Gender } from '@prisma/client'

export default class AdminManagementCreateRequest {
  fullName: string
  gender: Gender
  email: string
  password: string

  constructor (
    fullName: string,
    gender: Gender,
    email: string,
    password: string
  ) {
    this.fullName = fullName
    this.gender = gender
    this.email = email
    this.password = password
  }
}
