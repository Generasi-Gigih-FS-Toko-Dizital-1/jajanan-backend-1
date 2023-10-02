import { type Gender } from '@prisma/client'

export default class AdminRegisterByEmailAndPasswordResponse {
  id: string
  fullName: string
  gender: Gender
  email: string
  password: string
  createdAt: Date
  updatedAt: Date

  constructor (
    id: string,
    fullName: string,
    gender: Gender,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id
    this.fullName = fullName
    this.gender = gender
    this.email = email
    this.password = password
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
