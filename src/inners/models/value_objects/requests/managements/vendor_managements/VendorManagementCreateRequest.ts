import { type Gender, type Status } from '@prisma/client'

export default class VendorManagementCreateRequest {
  fullName: string
  gender: Gender
  address: string
  username: string
  email: string
  password: string
  jajanImageUrl: string
  jajanName: string
  jajanDescription: string
  status: Status
  lastLatitude: number
  lastLongitude: number

  constructor (fullName: string, gender: Gender, address: string, username: string, email: string, password: string, jajanImageUrl: string, jajanName: string, jajanDescription: string, status: Status, lastLatitude: number, lastLongitude: number) {
    this.fullName = fullName
    this.gender = gender
    this.address = address
    this.username = username
    this.email = email
    this.password = password
    this.jajanImageUrl = jajanImageUrl
    this.jajanName = jajanName
    this.jajanDescription = jajanDescription
    this.status = status
    this.lastLatitude = lastLatitude
    this.lastLongitude = lastLongitude
  }
}
