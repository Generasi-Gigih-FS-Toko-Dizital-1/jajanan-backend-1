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
import { randomUUID } from 'crypto'
import TransactionItemHistoryMock from '../../../test/mocks/TransactionItemHistoryMock'
import {
  type PayoutHistory,
  type Admin,
  type Category,
  type JajanItem,
  type JajanItemSnapshot,
  type NotificationHistory,
  type TopUpHistory,
  type TransactionHistory,
  type TransactionItemHistory,
  type User,
  type UserLevel,
  type UserSubscription,
  type Vendor,
  type VendorLevel
} from '@prisma/client'
import JajanItemSnapshotMock from '../../../test/mocks/JajanItemSnapshotMock'
import PayoutHistoryMock from '../../../test/mocks/PayoutHistoryMock'

export default class OneSeeder {
  oneDatastore: OneDatastore
  userMock: UserMock
  adminMock: AdminMock
  vendorMock: VendorMock
  categoryMock: CategoryMock
  jajanItemMock: JajanItemMock
  jajanItemSnapshotMock: JajanItemSnapshotMock
  topUpHistoryMock: TopUpHistoryMock
  payoutHistoryMock: PayoutHistoryMock
  transactionHistoryMock: TransactionHistoryMock
  transactionItemHistoryMock: TransactionItemHistoryMock
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
    this.jajanItemSnapshotMock = new JajanItemSnapshotMock(this.jajanItemMock)
    this.topUpHistoryMock = new TopUpHistoryMock(this.userMock)
    this.payoutHistoryMock = new PayoutHistoryMock(this.vendorMock)
    this.transactionHistoryMock = new TransactionHistoryMock(this.userMock, this.jajanItemMock)
    this.transactionItemHistoryMock = new TransactionItemHistoryMock(this.transactionHistoryMock, this.jajanItemSnapshotMock)
    this.notificationHistoryMock = new NotificationHistoryMock(this.userMock, this.vendorMock)
    this.userSubscriptionMock = new UserSubscriptionMock(this.userMock, this.categoryMock)
    this.userLevelMock = new UserLevelMock()
    this.vendorLevelMock = new VendorLevelMock()

    this.adminMock.data.push(
      {
        id: randomUUID(),
        fullName: 'admin0',
        email: 'email0@mail.com',
        password: 'password0',
        gender: 'MALE',
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      }
    )
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
    await this.oneDatastore.client.jajanItemSnapshot.createMany({
      data: this.jajanItemSnapshotMock.data
    })
    await this.oneDatastore.client.topUpHistory.createMany({
      data: this.topUpHistoryMock.data
    })
    await this.oneDatastore.client.payoutHistory.createMany({
      data: this.payoutHistoryMock.data
    })
    await this.oneDatastore.client.transactionHistory.createMany({
      data: this.transactionHistoryMock.data
    })
    await this.oneDatastore.client.transactionItemHistory.createMany({
      data: this.transactionItemHistoryMock.data
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
    await this.oneDatastore.client.vendorLevel.deleteMany({
      where: {
        id: {
          in: this.vendorLevelMock.data.map((vendorLevel: VendorLevel) => vendorLevel.id)
        }
      }
    })
    await this.oneDatastore.client.userLevel.deleteMany({
      where: {
        id: {
          in: this.userLevelMock.data.map((userLevel: UserLevel) => userLevel.id)
        }
      }
    })
    await this.oneDatastore.client.userSubscription.deleteMany({
      where: {
        id: {
          in: this.userSubscriptionMock.data.map((userSubscription: UserSubscription) => userSubscription.id)
        }
      }
    })
    await this.oneDatastore.client.notificationHistory.deleteMany({
      where: {
        id: {
          in: this.notificationHistoryMock.data.map((notificationHistory: NotificationHistory) => notificationHistory.id)
        }
      }
    })
    await this.oneDatastore.client.transactionItemHistory.deleteMany({
      where: {
        id: {
          in: this.transactionItemHistoryMock.data.map((transactionItemHistory: TransactionItemHistory) => transactionItemHistory.id)
        }
      }
    })
    await this.oneDatastore.client.transactionHistory.deleteMany({
      where: {
        id: {
          in: this.transactionHistoryMock.data.map((transactionHistory: TransactionHistory) => transactionHistory.id)
        }
      }
    })
    await this.oneDatastore.client.topUpHistory.deleteMany({
      where: {
        id: {
          in: this.topUpHistoryMock.data.map((topUpHistory: TopUpHistory) => topUpHistory.id)
        }
      }
    })
    await this.oneDatastore.client.payoutHistory.deleteMany({
      where: {
        id: {
          in: this.payoutHistoryMock.data.map((payoutHistory: PayoutHistory) => payoutHistory.id)
        }
      }
    })
    await this.oneDatastore.client.jajanItemSnapshot.deleteMany({
      where: {
        id: {
          in: this.jajanItemSnapshotMock.data.map((jajanItemSnapshot: JajanItemSnapshot) => jajanItemSnapshot.id)
        }
      }
    })
    await this.oneDatastore.client.jajanItem.deleteMany({
      where: {
        id: {
          in: this.jajanItemMock.data.map((jajanItem: JajanItem) => jajanItem.id)
        }
      }
    })
    await this.oneDatastore.client.category.deleteMany({
      where: {
        id: {
          in: this.categoryMock.data.map((category: Category) => category.id)
        }
      }
    })
    await this.oneDatastore.client.vendor.deleteMany({
      where: {
        id: {
          in: this.vendorMock.data.map((vendor: Vendor) => vendor.id)
        }
      }
    })
    await this.oneDatastore.client.admin.deleteMany({
      where: {
        id: {
          in: this.adminMock.data.map((admin: Admin) => admin.id)
        }
      }
    })
    await this.oneDatastore.client.user.deleteMany({
      where: {
        id: {
          in: this.userMock.data.map((user: User) => user.id)
        }
      }
    })

    console.log('One seeder down.')
  }
}
