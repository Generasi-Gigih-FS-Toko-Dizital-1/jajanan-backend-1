import { type Application, Router } from 'express'
import type OneDatastore from '../datastores/OneDatastore'
import UserRepository from '../repositories/UserRepository'
import UserManagement from '../../inners/use_cases/managements/UserManagement'
import UserControllerRest from '../controllers/rests/UserControllerRest'
import { type Server } from 'socket.io'
import VendorLoginAuthentication from '../../inners/use_cases/authentications/vendors/VendorLoginAuthentication'
import VendorRegisterAuthentication from '../../inners/use_cases/authentications/vendors/VendorRegisterAuthentication'
import UserAuthenticationControllerRest from '../controllers/rests/UserAuthenticationControllerRest'
import ObjectUtility from '../utilities/ObjectUtility'
import UserRegisterAuthentication from '../../inners/use_cases/authentications/users/UserRegisterAuthentication'
import UserLoginAuthentication from '../../inners/use_cases/authentications/users/UserLoginAuthentication'
import VendorAuthenticationControllerRest from '../controllers/rests/VendorAuthenticationControllerRest'
import AdminLoginAuthentication from '../../inners/use_cases/authentications/admins/AdminLoginAuthentication'
import AdminAuthenticationControllerRest from '../controllers/rests/AdminAuthenticationControllerRest'
import VendorRepository from '../repositories/VendorRepository'
import VendorManagement from '../../inners/use_cases/managements/VendorManagement'
import VendorControllerRest from '../controllers/rests/VendorControllerRest'
import AdminRepository from '../repositories/AdminRepository'
import AdminManagement from '../../inners/use_cases/managements/AdminManagement'
import AdminControllerRest from '../controllers/rests/AdminControllerRest'
import JajanItemRepository from '../repositories/JajanItemRepository'
import JajanItemManagement from '../../inners/use_cases/managements/JajanItemManagement'
import JajanItemControllerRest from '../controllers/rests/JajanItemControllerRest'
import type TwoDatastore from '../datastores/TwoDatastore'
import SessionRepository from '../repositories/SessionRepository'
import SessionManagement from '../../inners/use_cases/managements/SessionManagement'
import AuthenticationValidation from '../../inners/use_cases/authentications/AuthenticationValidation'
import AdminRefreshAuthentication from '../../inners/use_cases/authentications/admins/AdminRefreshAuthentication'
import VendorRefreshAuthentication from '../../inners/use_cases/authentications/vendors/VendorRefreshAuthentication'
import UserRefreshAuthentication from '../../inners/use_cases/authentications/users/UserRefreshAuthentication'
import TransactionHistoryControllerRest from '../controllers/rests/TransactionHistoryControllerRest'
import TransactionHistoryManagement from '../../inners/use_cases/managements/TransactionHistoryManagement'
import TransactionHistoryRepository from '../repositories/TransactionHistoryRepository'
import CategoryManagement from '../../inners/use_cases/managements/CategoryManagement'
import PaymentGateway from '../gateways/PaymentGateway'
import TopUp from '../../inners/use_cases/top_ups/TopUp'
import TopUpControllerRest from '../controllers/rests/TopUpControllerRest'
import UserLogoutAuthentication from '../../inners/use_cases/authentications/users/UserLogoutAuthentication'
import VendorLogoutAuthentication from '../../inners/use_cases/authentications/vendors/VendorLogoutAuthentication'
import AdminLogoutAuthentication from '../../inners/use_cases/authentications/admins/AdminLogoutAuthentication'
import TopUpHistoryRepository from '../repositories/TopUpHistoryRepository'
import TopUpWebhook from '../../inners/use_cases/top_ups/TopUpWebhook'
import WebhookControllerRest from '../controllers/rests/WebhookControllerRest'
import VendorLevelRepository from '../repositories/VendorLevelRepository'
import VendorLevelManagement from '../../inners/use_cases/managements/VendorLevelManagement'
import VendorLevelControllerRest from '../controllers/rests/VendorLevelControllerRest'
import UserLevelRepository from '../repositories/UserLevelRepository'
import CategoryRepository from '../repositories/CategoryRepository'
import UserLevelManagement from '../../inners/use_cases/managements/UserLevelManagement'
import UserLevelControllerRest from '../controllers/rests/UserLevelControllerRest'
import CategoryControllerRest from '../controllers/rests/CategoryControllerRest'
import TransactionControllerRest from '../controllers/rests/TransactionControllerRest'
import TransactionCheckout from '../../inners/use_cases/transactions/TransactionCheckout'
import TopUpHistoryManagement from '../../inners/use_cases/managements/TopUpHistoryManagement'
import TopUpHistoryController from '../controllers/rests/TopUpHistoryControllerRest'
import UserSubscriptionRepository from '../repositories/UserSubscriptionRepository'
import SubscriptionUser from '../../inners/use_cases/subscriptions/SubscriptionUser'
import UserSubscriptionControllerRest from '../controllers/rests/UserSubscriptionControllerRest'
import JajanItemSnapshotManagement from '../../inners/use_cases/managements/JajanItemSnapshotManagement'
import JajanItemSnapshotRepository from '../repositories/JajanItemSnapshotRepository'
import UserSubscriptionManagement from '../../inners/use_cases/managements/UserSubscriptionManagement'
import FirebaseGateway from '../gateways/FirebaseGateway'
import LocationSync from '../../inners/use_cases/locations/LocationSync'
import LocationControllerRest from '../controllers/rests/LocationControllerRest'
import PayoutControllerRest from '../controllers/rests/PayoutControllerRest'
import Payout from '../../inners/use_cases/payouts/Payout'
import VendorPayoutRepository from '../repositories/VendorPayoutRepository'
import PayoutHistoryRepository from '../repositories/PayoutHistoryRepository'
import PayoutWebhook from '../../inners/use_cases/payouts/PayoutWebhook'
import PayoutHistoryManagement from '../../inners/use_cases/managements/PayoutHistoryManagement'
import PayoutHistoryController from '../controllers/rests/PayoutHistoryControllerRest'
import CloudinaryGateway from '../gateways/CloudinaryGateway'
import FileManagement from '../../inners/use_cases/managements/FileManagement'
import CloudinaryUtility from '../utilities/CloudinaryUtility'
import FileControllerRest from '../controllers/rests/FileControllerRest'
import TransactionItemHistoryManagement from '../../inners/use_cases/managements/TransactionItemHistoryManagement'
import TransactionItemHistoryRepository from '../repositories/TransactionItemHistoryRepository'
import AdminStatistic from '../../inners/use_cases/statistics/AdminStatistic'
import UserStatistic from '../../inners/use_cases/statistics/UserStatistic'
import VendorStatistic from '../../inners/use_cases/statistics/VendorStatistic'
import PayoutHistoryStatistic from '../../inners/use_cases/statistics/PayoutHistoryStatistic'
import TopUpHistoryStatistic from '../../inners/use_cases/statistics/TopUpHistoryStatistic'
import TransactionHistoryStatistic from '../../inners/use_cases/statistics/TransactionHistoryStatistic'
import StatisticCountControllerRest from '../controllers/rests/StatisticCountControllerRest'

export default class RootRoute {
  app: Application
  io: Server
  datastoreOne: OneDatastore
  twoDatastore: TwoDatastore

  constructor (app: Application, io: Server, datastoreOne: OneDatastore, twoDatastore: TwoDatastore) {
    this.app = app
    this.io = io
    this.datastoreOne = datastoreOne
    this.twoDatastore = twoDatastore
  }

  registerRoutes = async (): Promise<void> => {
    const routerVersionOne = Router()

    const objectUtility: ObjectUtility = new ObjectUtility()
    const cloudinaryUtility: CloudinaryUtility = new CloudinaryUtility()

    const paymentGateway: PaymentGateway = new PaymentGateway()
    const firebaseGateway: FirebaseGateway = new FirebaseGateway()
    const cloudinaryGateway: CloudinaryGateway = new CloudinaryGateway()

    const sessionRepository: SessionRepository = new SessionRepository(this.twoDatastore)
    const userRepository: UserRepository = new UserRepository(this.datastoreOne)
    const vendorRepository: VendorRepository = new VendorRepository(this.datastoreOne)
    const adminRepository: AdminRepository = new AdminRepository(this.datastoreOne)
    const jajanItemRepository: JajanItemRepository = new JajanItemRepository(this.datastoreOne)
    const transactionHistoryRepository: TransactionHistoryRepository = new TransactionHistoryRepository(this.datastoreOne)
    const transactionItemHistoryRepository: TransactionItemHistoryRepository = new TransactionItemHistoryRepository(this.datastoreOne)
    const userLevelRepository: UserLevelRepository = new UserLevelRepository(this.datastoreOne)
    const vendorLevelRepository: VendorLevelRepository = new VendorLevelRepository(this.datastoreOne)
    const categoryRepository: CategoryRepository = new CategoryRepository(this.datastoreOne)
    const topUpHistoryRepository = new TopUpHistoryRepository(this.datastoreOne)
    const userSubscriptionRepository: UserSubscriptionRepository = new UserSubscriptionRepository(this.datastoreOne)
    const jajanItemSnashotRepository = new JajanItemSnapshotRepository(this.datastoreOne)
    const vendorPayoutRepository = new VendorPayoutRepository(this.datastoreOne)
    const payoutHistoryRepository = new PayoutHistoryRepository(this.datastoreOne)

    const userManagement: UserManagement = new UserManagement(userRepository, objectUtility)
    const vendorManagement: VendorManagement = new VendorManagement(vendorRepository, objectUtility)
    const adminManagement: AdminManagement = new AdminManagement(adminRepository, objectUtility)
    const jajanItemManagement: JajanItemManagement = new JajanItemManagement(jajanItemRepository, objectUtility)
    const jajanItemSnapshotManagement: JajanItemSnapshotManagement = new JajanItemSnapshotManagement(jajanItemSnashotRepository, objectUtility)
    const transactionHistoryManagement: TransactionHistoryManagement = new TransactionHistoryManagement(userManagement, jajanItemManagement, transactionHistoryRepository, objectUtility)
    const transactionItemHistoryManagement: TransactionItemHistoryManagement = new TransactionItemHistoryManagement(transactionHistoryManagement, transactionItemHistoryRepository, jajanItemSnapshotManagement, objectUtility)
    const vendorLevelManagement: VendorLevelManagement = new VendorLevelManagement(vendorLevelRepository, objectUtility)
    const userLevelManagement: UserLevelManagement = new UserLevelManagement(userLevelRepository, objectUtility)
    const categoryManagement: CategoryManagement = new CategoryManagement(categoryRepository, objectUtility)
    const topUpHistoryManagement: TopUpHistoryManagement = new TopUpHistoryManagement(topUpHistoryRepository, userManagement, objectUtility)
    const userSubscriptionManagement: UserSubscriptionManagement = new UserSubscriptionManagement(userSubscriptionRepository, objectUtility)
    const payoutHistoryManagement: PayoutHistoryManagement = new PayoutHistoryManagement(payoutHistoryRepository, vendorManagement, objectUtility)
    const fileManagement: FileManagement = new FileManagement(cloudinaryGateway, cloudinaryUtility, objectUtility)
    const sessionManagement: SessionManagement = new SessionManagement(sessionRepository, objectUtility)
    const authenticationValidation: AuthenticationValidation = new AuthenticationValidation(sessionManagement, userManagement, vendorManagement, adminManagement, objectUtility)

    const subscriptionUser: SubscriptionUser = new SubscriptionUser(userSubscriptionManagement)

    const userRegisterAuthentication: UserRegisterAuthentication = new UserRegisterAuthentication(userManagement)
    const vendorRegisterAuthentication: VendorRegisterAuthentication = new VendorRegisterAuthentication(vendorManagement)

    const userLoginAuthentication: UserLoginAuthentication = new UserLoginAuthentication(userManagement, sessionManagement, firebaseGateway)
    const vendorLoginAuthentication: VendorLoginAuthentication = new VendorLoginAuthentication(vendorManagement, sessionManagement)
    const adminLoginAuthentication: AdminLoginAuthentication = new AdminLoginAuthentication(adminManagement, sessionManagement)

    const userRefreshAuthentication: UserRefreshAuthentication = new UserRefreshAuthentication(userManagement, sessionManagement)
    const vendorRefreshAuthentication: VendorRefreshAuthentication = new VendorRefreshAuthentication(vendorManagement, sessionManagement)
    const adminRefreshAuthentication: AdminRefreshAuthentication = new AdminRefreshAuthentication(adminManagement, sessionManagement)

    const userLogoutAuthentication: UserLogoutAuthentication = new UserLogoutAuthentication(userManagement, sessionManagement)
    const vendorLogoutAuthentication: VendorLogoutAuthentication = new VendorLogoutAuthentication(vendorManagement, sessionManagement)
    const adminLogoutAuthentication: AdminLogoutAuthentication = new AdminLogoutAuthentication(adminManagement, sessionManagement)

    const topUpWebhook: TopUpWebhook = new TopUpWebhook(topUpHistoryRepository, userRepository)
    const topUp: TopUp = new TopUp(paymentGateway, userManagement)

    const transactionCheckout: TransactionCheckout = new TransactionCheckout(userManagement, vendorManagement, jajanItemManagement, jajanItemSnapshotManagement, transactionHistoryManagement, transactionItemHistoryManagement, objectUtility)
    const payoutWebhook: PayoutWebhook = new PayoutWebhook(payoutHistoryRepository, vendorRepository)
    const payout: Payout = new Payout(vendorPayoutRepository, paymentGateway, vendorManagement)

    const locationSync: LocationSync = new LocationSync(userManagement, vendorManagement, sessionManagement, firebaseGateway, objectUtility)

    const adminStatistic: AdminStatistic = new AdminStatistic(adminRepository)
    const userStatistic: UserStatistic = new UserStatistic(userRepository)
    const vendorStatistic: VendorStatistic = new VendorStatistic(vendorRepository)
    const payoutHistoryStatistic: PayoutHistoryStatistic = new PayoutHistoryStatistic(payoutHistoryRepository)
    const topUpHistoryStatistic: TopUpHistoryStatistic = new TopUpHistoryStatistic(topUpHistoryRepository)
    const transactionHistoryStatistic: TransactionHistoryStatistic = new TransactionHistoryStatistic(transactionHistoryRepository)

    const statisticCountControllerRest: StatisticCountControllerRest = new StatisticCountControllerRest(
      Router(),
      authenticationValidation,
      adminStatistic,
      userStatistic,
      vendorStatistic,
      payoutHistoryStatistic,
      topUpHistoryStatistic,
      transactionHistoryStatistic
    )
    statisticCountControllerRest.registerRoutes()
    routerVersionOne.use('/statistics/counts', statisticCountControllerRest.router)

    const userControllerRest: UserControllerRest = new UserControllerRest(
      Router(),
      userManagement,
      authenticationValidation
    )
    userControllerRest.registerRoutes()
    routerVersionOne.use('/users', userControllerRest.router)

    const vendorControllerRest: VendorControllerRest = new VendorControllerRest(
      Router(),
      vendorManagement,
      authenticationValidation
    )
    vendorControllerRest.registerRoutes()
    routerVersionOne.use('/vendors', vendorControllerRest.router)

    const jajanItemControllerRest: JajanItemControllerRest = new JajanItemControllerRest(
      Router(),
      jajanItemManagement,
      authenticationValidation
    )
    jajanItemControllerRest.registerRoutes()
    routerVersionOne.use('/jajan-items', jajanItemControllerRest.router)

    const userSubscriptionControllerRest: UserSubscriptionControllerRest = new UserSubscriptionControllerRest(
      Router(),
      subscriptionUser,
      authenticationValidation
    )
    userSubscriptionControllerRest.registerRoutes()
    routerVersionOne.use('/user-subscriptions', userSubscriptionControllerRest.router)

    const userLevelControllerRest: UserLevelControllerRest = new UserLevelControllerRest(
      Router(),
      userLevelManagement,
      authenticationValidation
    )
    userLevelControllerRest.registerRoutes()
    routerVersionOne.use('/user-levels', userLevelControllerRest.router)
    const vendorLevelControllerRest: VendorLevelControllerRest = new VendorLevelControllerRest(
      Router(),
      vendorLevelManagement,
      authenticationValidation
    )
    vendorLevelControllerRest.registerRoutes()
    routerVersionOne.use('/vendor-levels', vendorLevelControllerRest.router)

    const categoryControllerRest: CategoryControllerRest = new CategoryControllerRest(
      Router(),
      categoryManagement,
      authenticationValidation
    )
    categoryControllerRest.registerRoutes()
    routerVersionOne.use('/categories', categoryControllerRest.router)

    const transactionHistoryControllerRest: TransactionHistoryControllerRest = new TransactionHistoryControllerRest(
      Router(),
      transactionHistoryManagement,
      authenticationValidation
    )
    transactionHistoryControllerRest.registerRoutes()
    routerVersionOne.use('/transaction-histories', transactionHistoryControllerRest.router)

    const transactionControllerRest: TransactionControllerRest = new TransactionControllerRest(
      Router(),
      transactionCheckout,
      authenticationValidation
    )
    transactionControllerRest.registerRoutes()
    routerVersionOne.use('/transactions', transactionControllerRest.router)

    const adminControllerRest: AdminControllerRest = new AdminControllerRest(
      Router(),
      adminManagement,
      authenticationValidation
    )
    adminControllerRest.registerRoutes()
    routerVersionOne.use('/admins', adminControllerRest.router)

    const userAuthenticationControllerRest: UserAuthenticationControllerRest = new UserAuthenticationControllerRest(
      Router(),
      userLoginAuthentication,
      userRegisterAuthentication,
      userRefreshAuthentication,
      userLogoutAuthentication
    )
    userAuthenticationControllerRest.registerRoutes()
    routerVersionOne.use('/authentications/users', userAuthenticationControllerRest.router)

    const vendorAuthenticationControllerRest: VendorAuthenticationControllerRest = new VendorAuthenticationControllerRest(
      Router(),
      vendorLoginAuthentication,
      vendorRegisterAuthentication,
      vendorRefreshAuthentication,
      vendorLogoutAuthentication
    )
    vendorAuthenticationControllerRest.registerRoutes()
    routerVersionOne.use('/authentications/vendors', vendorAuthenticationControllerRest.router)

    const adminAuthenticationControllerRest: AdminAuthenticationControllerRest = new AdminAuthenticationControllerRest(
      Router(),
      adminLoginAuthentication,
      adminRefreshAuthentication,
      adminLogoutAuthentication
    )
    adminAuthenticationControllerRest.registerRoutes()
    routerVersionOne.use('/authentications/admins', adminAuthenticationControllerRest.router)

    const topUpControllerRest: TopUpControllerRest = new TopUpControllerRest(Router(), topUp, authenticationValidation)
    topUpControllerRest.registerRoutes()
    routerVersionOne.use('/top-ups', topUpControllerRest.router)

    const webhookControllerRest: WebhookControllerRest = new WebhookControllerRest(Router(), topUpWebhook, payoutWebhook)
    webhookControllerRest.registerRoutes()
    routerVersionOne.use('/webhooks', webhookControllerRest.router)

    const topUpHistoryControllerRest: TopUpHistoryController = new TopUpHistoryController(Router(), topUpHistoryManagement, authenticationValidation)
    topUpHistoryControllerRest.registerRoutes()
    routerVersionOne.use('/top-up-histories', topUpHistoryControllerRest.router)

    const locationControllerRest: LocationControllerRest = new LocationControllerRest(Router(), locationSync, authenticationValidation)
    locationControllerRest.registerRoutes()
    routerVersionOne.use('/locations', locationControllerRest.router)

    const payoutControllerRest: PayoutControllerRest = new PayoutControllerRest(Router(), payout, authenticationValidation)
    payoutControllerRest.registerRoutes()
    routerVersionOne.use('/payouts', payoutControllerRest.router)

    const payoutHistoryControllerRest: PayoutHistoryController = new PayoutHistoryController(Router(), payoutHistoryManagement, authenticationValidation)
    payoutHistoryControllerRest.registerRoutes()
    routerVersionOne.use('/payout-histories', payoutHistoryControllerRest.router)

    const fileControllerRest: FileControllerRest = new FileControllerRest(Router(), fileManagement, authenticationValidation)
    fileControllerRest.registerRoutes()
    routerVersionOne.use('/files', fileControllerRest.router)

    this.app.use('/api/v1', routerVersionOne)
  }

  registerSockets = async (): Promise<void> => {

  }
}
