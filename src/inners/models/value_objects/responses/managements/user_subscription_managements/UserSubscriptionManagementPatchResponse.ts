export default class UserSubscriptionManagementPatchResponse {
  id: string
  userId: string
  categoryId: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null

  constructor (
    id: string,
    userId: string,
    categoryId: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null = null
  ) {
    this.id = id
    this.userId = userId
    this.categoryId = categoryId
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
  }
}
