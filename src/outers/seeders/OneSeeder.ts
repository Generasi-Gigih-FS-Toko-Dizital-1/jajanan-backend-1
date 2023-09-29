import type OneDatastore from '../datastores/OneDatastore'
import UserMock from '../../../test/mocks/UserMock'
import AdminMock from '../../../test/mocks/AdminMock'
import TransactionHistoryMock from '../../../test/mocks/TransactionHistoryMock'
import NotificationHistoryMock from '../../../test/mocks/NotificationHistoryMock'
import TopUpHistoryMock from '../../../test/mocks/TopUpHistoryMock'
import JajanItemMock from '../../../test/mocks/JajanItemMock'
import CategoryMock from '../../../test/mocks/CategoryMock'
import VendorMock from '../../../test/mocks/VendorMock'
import UserSubscriptionMock from '../../../test/mocks/UserSubscriptionMock'
import UserLevelMock from '../../../test/mocks/UserLevelMock'
import VendorLevelMock from '../../../test/mocks/VendorLevelMock'

export default class OneSeeder {
  oneDatastore: OneDatastore
  userMock: UserMock
  adminMock: AdminMock
  vendorMock: VendorMock
  categoryMock: CategoryMock
  jajanItemMock: JajanItemMock
  topUpHistoryMock: TopUpHistoryMock
  transactionHistoryMock: TransactionHistoryMock
  notificationHistoryMock: NotificationHistoryMock
  userSubscriptionMock: UserSubscriptionMock
  userLevelMock: UserLevelMock
  vendorLevelMock: VendorLevelMock

  constructor (oneDatastore: OneDatastore) {
    this.oneDatastore = oneDatastore
    this.userMock = new UserMock()
    this.adminMock = new AdminMock()
    this.vendorMock = new VendorMock()
    this.categoryMock = new CategoryMock()
    this.jajanItemMock = new JajanItemMock(this.vendorMock, this.categoryMock)
    this.topUpHistoryMock = new TopUpHistoryMock(this.userMock)
    this.transactionHistoryMock = new TransactionHistoryMock(this.userMock, this.jajanItemMock)
    this.notificationHistoryMock = new NotificationHistoryMock(this.userMock, this.vendorMock)
    this.userSubscriptionMock = new UserSubscriptionMock(this.userMock, this.categoryMock)
    this.userLevelMock = new UserLevelMock()
    this.vendorLevelMock = new VendorLevelMock()
  }

  up = async (): Promise<void> => {
    if (this.oneDatastore.client === undefined) {
      throw new Error('Client is undefined.')
    }
    await this.oneDatastore.client.user.createMany({
      data: this.userMock.data
    })
    await this.oneDatastore.client.admin.createMany({
      data: this.adminMock.data
    })
    await this.oneDatastore.client.vendor.createMany({
      data: this.vendorMock.data
    })
    await this.oneDatastore.client.category.createMany({
      data: this.categoryMock.data
    })
    await this.oneDatastore.client.jajanItem.createMany({
      data: this.jajanItemMock.data
    })
    await this.oneDatastore.client.topUpHistory.createMany({
      data: this.topUpHistoryMock.data
    })
    await this.oneDatastore.client.transactionHistory.createMany({
      data: this.transactionHistoryMock.data
    })
    await this.oneDatastore.client.notificationHistory.createMany({
      data: this.notificationHistoryMock.data
    })
    await this.oneDatastore.client.userSubscription.createMany({
      data: this.userSubscriptionMock.data
    })
    await this.oneDatastore.client.userLevel.createMany({
      data: this.userLevelMock.data
    })
    await this.oneDatastore.client.vendorLevel.createMany({
      data: this.vendorLevelMock.data
    })
    console.log('One seeder up.')
  }

  down = async (): Promise<void> => {
    if (this.oneDatastore.client === undefined) {
      throw new Error('Client is undefined.')
    }
    await this.oneDatastore.client.vendorLevel.deleteMany()
    await this.oneDatastore.client.userLevel.deleteMany()
    await this.oneDatastore.client.userSubscription.deleteMany()
    await this.oneDatastore.client.notificationHistory.deleteMany()
    await this.oneDatastore.client.transactionHistory.deleteMany()
    await this.oneDatastore.client.topUpHistory.deleteMany()
    await this.oneDatastore.client.jajanItem.deleteMany()
    await this.oneDatastore.client.category.deleteMany()
    await this.oneDatastore.client.vendor.deleteMany()
    await this.oneDatastore.client.admin.deleteMany()
    await this.oneDatastore.client.user.deleteMany()
    console.log('One seeder down.')
  }
}
