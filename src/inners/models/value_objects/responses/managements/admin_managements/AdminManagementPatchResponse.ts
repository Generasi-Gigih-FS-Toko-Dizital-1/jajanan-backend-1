import { type Gender } from '@prisma/client'

export default class AdminManagementPatchResponse {
  id: string
  fullName: string
  gender: Gender
  email: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null

  constructor (
    id: string,
    fullName: string,
    gender: Gender,
    email: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null = null

  ) {
    this.id = id
    this.fullName = fullName
    this.gender = gender
    this.email = email
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
  }
}
