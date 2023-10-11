import type AdminManagementReadOneResponse from './AdminManagementReadOneResponse'

export default class AdminManagementReadManyResponse {
  totalAdmins: number
  admins: AdminManagementReadOneResponse[]

  constructor (
    totalAdmins: number,
    admins: AdminManagementReadOneResponse[]
  ) {
    this.totalAdmins = totalAdmins
    this.admins = admins
  }
}
