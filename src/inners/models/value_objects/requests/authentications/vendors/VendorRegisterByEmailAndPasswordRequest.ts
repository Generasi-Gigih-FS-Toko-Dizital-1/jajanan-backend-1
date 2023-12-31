import { type Gender, type Status } from '@prisma/client'

export default class VendorRegisterByEmailAndPasswordRequest {
  fullName: string
  gender: Gender
  username: string
  email: string
  password: string
  address: string
  jajanImageUrl: string
  jajanName: string
  jajanDescription: string
  status: Status
  lastLatitude: number
  lastLongitude: number

  constructor (fullName: string, gender: Gender, username: string, email: string, password: string, address: string, jajanImageUrl: string, jajanName: string, jajanDescription: string, status: Status, lastLatitude: number, lastLongitude: number) {
    this.fullName = fullName
    this.gender = gender
    this.username = username
    this.email = email
    this.password = password
    this.address = address
    this.jajanImageUrl = jajanImageUrl
    this.jajanName = jajanName
    this.jajanDescription = jajanDescription
    this.status = status
    this.lastLatitude = lastLatitude
    this.lastLongitude = lastLongitude
  }
}
