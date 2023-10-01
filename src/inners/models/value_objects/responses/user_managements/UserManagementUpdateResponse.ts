import { type Gender } from '@prisma/client'

export default class UserManagementUpdateResponse {
  id: string
  fullName: string
  username: string
  email: string
  gender: Gender
  message: string

  constructor (
    id: string,
    fullName: string,
    username: string,
    email: string,
    gender: Gender,
    message: string
  ) {
    this.id = id
    this.fullName = fullName
    this.username = username
    this.email = email
    this.gender = gender
    this.message = message
  }
}
