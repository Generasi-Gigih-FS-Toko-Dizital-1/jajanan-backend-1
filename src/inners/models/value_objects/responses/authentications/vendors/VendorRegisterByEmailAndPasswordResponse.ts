import { type Gender, type Status } from '@prisma/client'

export default class VendorRegisterByEmailAndPasswordResponse {
  id: string
  fullName: string
  gender: Gender
  username: string
  email: string
  balance: number
  experience: number
  jajanImageUrl: string
  jajanName: string
  jajanDescription: string
  status: Status
  lastLatitude: number
  lastLongitude: number
  createdAt: Date
  updatedAt: Date

  constructor (
    id: string,
    fullName: string,
    gender: Gender,
    username: string,
    email: string,
    balance: number,
    experience: number,
    jajanImageUrl: string,
    jajanName: string,
    jajanDescription: string,
    status: Status,
    lastLatitude: number,
    lastLongitude: number,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id
    this.fullName = fullName
    this.gender = gender
    this.username = username
    this.email = email
    this.balance = balance
    this.experience = experience
    this.jajanImageUrl = jajanImageUrl
    this.jajanName = jajanName
    this.jajanDescription = jajanDescription
    this.status = status
    this.lastLatitude = lastLatitude
    this.lastLongitude = lastLongitude
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
