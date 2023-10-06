import type UserManagementReadOneResponse from './UserManagementReadOneResponse'

export default class UserManagementReadManyResponse {
  totalUsers: number
  users: UserManagementReadOneResponse[]

  constructor (
    totalUsers: number,
    users: UserManagementReadOneResponse[]
  ) {
    this.totalUsers = totalUsers
    this.users = users
  }
}
