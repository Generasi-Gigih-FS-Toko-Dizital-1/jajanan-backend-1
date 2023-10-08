import { type Gender, type JajanItem, type NotificationHistory, type Status } from '@prisma/client'
import { Vendor$jajanItemsArgs, Vendor$notificationHistoriesArgs } from '.prisma/client'

export default class VendorManagementReadOneResponse {
  id: string
  fullName: string
  gender: Gender
  address: string
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
  notificationHistories?: NotificationHistory[]
  jajanItems?: JajanItem[]

  constructor (id: string, fullName: string, gender: Gender, address: string, username: string, email: string, balance: number, experience: number, jajanImageUrl: string, jajanName: string, jajanDescription: string, status: Status, lastLatitude: number, lastLongitude: number, createdAt: Date, updatedAt: Date, notificationHistories?: NotificationHistory[], jajanItems?: JajanItem[]) {
    this.id = id
    this.fullName = fullName
    this.gender = gender
    this.address = address
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
    this.notificationHistories = notificationHistories
    this.jajanItems = jajanItems
  }
}
