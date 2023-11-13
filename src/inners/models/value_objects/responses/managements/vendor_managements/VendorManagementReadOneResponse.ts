import {
  type Gender,
  type JajanItem,
  type JajanItemSnapshot,
  type NotificationHistory,
  type PayoutHistory,
  type Status
} from '@prisma/client'

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
  deletedAt: Date | null
  notificationHistories?: NotificationHistory[]
  jajanItems?: JajanItem[]
  jajanItemSnapshots?: JajanItemSnapshot[]
  payoutHistories?: PayoutHistory[]

  constructor (id: string, fullName: string, gender: Gender, address: string, username: string, email: string, balance: number, experience: number, jajanImageUrl: string, jajanName: string, jajanDescription: string, status: Status, lastLatitude: number, lastLongitude: number, createdAt: Date, updatedAt: Date, deletedAt: Date | null = null, notificationHistories?: NotificationHistory[], jajanItems?: JajanItem[], jajanItemSnapshots?: JajanItemSnapshot[], payoutHistories?: PayoutHistory[]) {
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
    this.jajanItemSnapshots = jajanItemSnapshots
    this.payoutHistories = payoutHistories
    this.deletedAt = deletedAt
  }
}
