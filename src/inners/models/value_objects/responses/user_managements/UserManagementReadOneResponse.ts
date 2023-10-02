import { type Gender } from '@prisma/client'

export default class UserManagementReadOneResponse {
  id: string
  fullName: string
  username: string
  email: string
  gender: Gender
  balance: number
  experience: number
  lastLatitude: number
  lastLongitude: number
  message: string

  constructor (
    id: string,
    fullName: string,
    username: string,
    email: string,
    gender: Gender,
    balance: number,
    experience: number,
    lastLatitude: number,
    lastLongitude: number,
    message: string
  ) {
    this.id = id
    this.fullName = fullName
    this.username = username
    this.email = email
    this.gender = gender
    this.balance = balance
    this.experience = experience
    this.lastLatitude = lastLatitude
    this.lastLongitude = lastLongitude
    this.message = message
  }
}
