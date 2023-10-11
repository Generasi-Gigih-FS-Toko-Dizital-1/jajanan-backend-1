import type JajanItemManagementReadOneResponse from './UserLevelManagementReadOneResponse'

export default class UserLevelManagementReadManyResponse {
  totalUserLevels: number
  userLevels: JajanItemManagementReadOneResponse[]

  constructor (
    totalUserLevels: number,
    userLevels: JajanItemManagementReadOneResponse[]
  ) {
    this.totalUserLevels = totalUserLevels
    this.userLevels = userLevels
  }
}
