import { type Gender } from '@prisma/client'

export default class AdminManagementPatchRequest {
  fullName: string
  gender: Gender
  email: string
  password: string
  oldPassword: string

  constructor (fullName: string, gender: Gender, email: string, password: string, oldPassword: string) {
    this.fullName = fullName
    this.gender = gender
    this.email = email
    this.password = password
    this.oldPassword = oldPassword
  }
}
