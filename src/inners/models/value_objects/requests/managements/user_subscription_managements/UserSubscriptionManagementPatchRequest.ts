export default class UserSubscriptionManagementPatchRequest {
  userId: string
  categoryId: string

  constructor (userId: string, categoryId: string) {
    this.userId = userId
    this.categoryId = categoryId
  }
}
