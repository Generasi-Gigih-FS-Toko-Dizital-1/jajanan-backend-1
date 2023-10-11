import {
  type Gender,
  type NotificationHistory,
  type TopUpHistory,
  type TransactionHistory,
  type UserSubscription
} from '@prisma/client'

export default class UserManagementReadOneResponse {
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
  notificationHistories?: NotificationHistory[]
  topUpHistories?: TopUpHistory[]
  transactionHistories?: TransactionHistory[]
  userSubscriptions?: UserSubscription[]

  constructor (id: string, fullName: string, gender: Gender, address: string, username: string, email: string, balance: number, experience: number, lastLatitude: number, lastLongitude: number, createdAt: Date, updatedAt: Date, notificationHistories?: NotificationHistory[], topUpHistories?: TopUpHistory[], transactionHistories?: TransactionHistory[], userSubscriptions?: UserSubscription[]) {
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
    this.notificationHistories = notificationHistories
    this.topUpHistories = topUpHistories
    this.transactionHistories = transactionHistories
    this.userSubscriptions = userSubscriptions
  }
}
