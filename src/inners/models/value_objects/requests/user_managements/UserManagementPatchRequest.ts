import { type Gender } from '@prisma/client'

export default class UserManagementPatchRequest {
  username: string
  fullName: string
  email: string
  password: string
  gender: Gender

  constructor (
    username: string,
    fullName: string,
    email: string,
    password: string,
    gender: Gender
  ) {
    this.username = username
    this.fullName = fullName
    this.email = email
    this.password = password
    this.gender = gender
  }
}
