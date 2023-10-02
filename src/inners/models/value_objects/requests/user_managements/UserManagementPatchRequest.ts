import { type Gender } from '@prisma/client'

export default class UserManagementPatchRequest {
  fullName: string
  gender: Gender
  username: string
  email: string
  password: string

  constructor (fullName: string, gender: Gender, username: string, email: string, password: string) {
    this.fullName = fullName
    this.gender = gender
    this.username = username
    this.email = email
    this.password = password
  }
}
