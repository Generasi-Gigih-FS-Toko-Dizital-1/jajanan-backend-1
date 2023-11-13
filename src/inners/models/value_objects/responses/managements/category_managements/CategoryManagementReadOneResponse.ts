import { type JajanItem, type JajanItemSnapshot, type UserSubscription } from '@prisma/client'

export default class CategoryManagementReadOneResponse {
  id: string
  name: string
  iconUrl: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  jajanItems?: JajanItem[]
  jajanItemSnapshots?: JajanItemSnapshot[]
  userSubscriptions?: UserSubscription[]

  constructor (id: string, name: string, iconUrl: string, createdAt: Date, updatedAt: Date, deletedAt: Date | null = null, jajanItems?: JajanItem[], jajanItemSnapshots?: JajanItemSnapshot[], userSubscriptions?: UserSubscription[]) {
    this.id = id
    this.name = name
    this.iconUrl = iconUrl
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.jajanItems = jajanItems
    this.jajanItemSnapshots = jajanItemSnapshots
    this.userSubscriptions = userSubscriptions
    this.deletedAt = deletedAt
  }
}
