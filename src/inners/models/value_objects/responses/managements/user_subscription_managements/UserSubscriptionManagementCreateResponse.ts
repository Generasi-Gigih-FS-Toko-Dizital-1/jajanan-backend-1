export default class UserSubscriptionManagementCreateResponse {
  id: string
  userId: string
  categoryId: string
  createdAt: Date
  updatedAt: Date

  constructor (
    id: string,
    userId: string,
    categoryId: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id
    this.userId = userId
    this.categoryId = categoryId
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
