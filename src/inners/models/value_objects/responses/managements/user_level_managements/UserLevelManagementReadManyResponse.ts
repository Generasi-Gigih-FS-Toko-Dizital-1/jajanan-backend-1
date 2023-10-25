import type UserLevelManagementReadOneResponse from './UserLevelManagementReadOneResponse'

export default class UserLevelManagementReadManyResponse {
  totalUserLevels: number
  userLevels: UserLevelManagementReadOneResponse[]

  constructor (
    totalUserLevels: number,
    userLevels: UserLevelManagementReadOneResponse[]
  ) {
    this.totalUserLevels = totalUserLevels
    this.userLevels = userLevels
  }
}
