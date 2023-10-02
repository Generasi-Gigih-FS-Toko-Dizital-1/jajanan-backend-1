import { type User } from '@prisma/client'

export default class UserManagementReadManyResponse {
  totalUsers: number
  users: User[]

  constructor (
    totalUsers: number,
    users: User[]
  ) {
    this.totalUsers = totalUsers
    this.users = users
  }
}
