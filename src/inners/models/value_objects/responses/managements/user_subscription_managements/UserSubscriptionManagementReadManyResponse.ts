import type UserSubscriptionManagementReadOneResponse from './UserSubscriptionManagementReadOneResponse'

export default class UserSubscriptionManagementReadManyResponse {
  totalUserSubscriptions: number
  userSubscriptions: UserSubscriptionManagementReadOneResponse[]

  constructor (
    totalUserSubscriptions: number,
    userSubscriptions: UserSubscriptionManagementReadOneResponse[]
  ) {
    this.totalUserSubscriptions = totalUserSubscriptions
    this.userSubscriptions = userSubscriptions
  }
}
