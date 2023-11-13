import { type Category, type User } from '@prisma/client'

export default class UserSubscriptionManagementReadOneResponse {
  id: string
  userId: string
  categoryId: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  user?: User
  category?: Category

  constructor (
    id: string,
    userId: string,
    categoryId: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null = null,
    user?: User,
    category?: Category
  ) {
    this.id = id
    this.userId = userId
    this.categoryId = categoryId
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.user = user
    this.category = category
    this.deletedAt = deletedAt
  }
}
