import { type Gender } from '@prisma/client'

export default class UserManagementPatchResponse {
  id: string
  fullName: string
  gender: Gender
  address: string
  username: string
  email: string
  balance: number
  experience: number
  lastLatitude: number
  lastLongitude: number
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null

  constructor (id: string, fullName: string, gender: Gender, address: string, username: string, email: string, balance: number, experience: number, lastLatitude: number, lastLongitude: number, createdAt: Date, updatedAt: Date, deletedAt: Date | null = null) {
    this.id = id
    this.fullName = fullName
    this.gender = gender
    this.address = address
    this.username = username
    this.email = email
    this.balance = balance
    this.experience = experience
    this.lastLatitude = lastLatitude
    this.lastLongitude = lastLongitude
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
  }
}
