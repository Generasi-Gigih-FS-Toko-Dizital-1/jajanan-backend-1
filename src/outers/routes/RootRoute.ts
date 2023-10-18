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
import CheckoutTransaction from '../../inners/use_cases/transactions/CheckoutTransaction'
import TopUpHistoryManagement from '../../inners/use_cases/managements/TopUpHistoryManagement'
import TopUpHistoryController from '../controllers/rests/TopUpHistoryControllerRest'
import UserSubscriptionRepository from '../repositories/UserSubscriptionRepository'
import UserSubscriptionManagement from '../../inners/use_cases/managements/UserSubscriptionManagement'
import UserSubscriptionControllerRest from '../controllers/rests/UserSubscriptionControllerRest'
import JajanItemSnapshotManagement from '../../inners/use_cases/managements/JajanItemSnapshotManagement'
import JajanItemSnapshotRepository from '../repositories/JajanItemSnapshotRepository'

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

    const paymentGateway: PaymentGateway = new PaymentGateway()

    const sessionRepository: SessionRepository = new SessionRepository(this.twoDatastore)
    const userRepository: UserRepository = new UserRepository(this.datastoreOne)
    const vendorRepository: VendorRepository = new VendorRepository(this.datastoreOne)
    const adminRepository: AdminRepository = new AdminRepository(this.datastoreOne)
    const jajanItemRepository: JajanItemRepository = new JajanItemRepository(this.datastoreOne)
    const transactionHistoryRepository: TransactionHistoryRepository = new TransactionHistoryRepository(this.datastoreOne)
    const userLevelRepository: UserLevelRepository = new UserLevelRepository(this.datastoreOne)
    const vendorLevelRepository: VendorLevelRepository = new VendorLevelRepository(this.datastoreOne)
    const categoryRepository: CategoryRepository = new CategoryRepository(this.datastoreOne)
    const topUpHistoryRepository = new TopUpHistoryRepository(this.datastoreOne)
    const userSubscriptionRepository: UserSubscriptionRepository = new UserSubscriptionRepository(this.datastoreOne)
    const jajanItemSnashotRepository = new JajanItemSnapshotRepository(this.datastoreOne)

    const sessionManagement: SessionManagement = new SessionManagement(sessionRepository, objectUtility)
    const authenticationValidation: AuthenticationValidation = new AuthenticationValidation(sessionManagement)
    const userManagement: UserManagement = new UserManagement(userRepository, objectUtility)
    const vendorManagement: VendorManagement = new VendorManagement(vendorRepository, objectUtility)
    const adminManagement: AdminManagement = new AdminManagement(adminRepository, objectUtility)
    const jajanItemManagement: JajanItemManagement = new JajanItemManagement(jajanItemRepository, objectUtility)
    const jajanItemSnapshotManagement: JajanItemSnapshotManagement = new JajanItemSnapshotManagement(jajanItemSnashotRepository, objectUtility)
    const transactionHistoryManagement: TransactionHistoryManagement = new TransactionHistoryManagement(userManagement, jajanItemManagement, transactionHistoryRepository, objectUtility)
    const vendorLevelManagement: VendorLevelManagement = new VendorLevelManagement(vendorLevelRepository, objectUtility)
    const userLevelManagement: UserLevelManagement = new UserLevelManagement(userLevelRepository, objectUtility)
    const categoryManagement: CategoryManagement = new CategoryManagement(categoryRepository, objectUtility)
    const topUpHistoryManagement: TopUpHistoryManagement = new TopUpHistoryManagement(topUpHistoryRepository, userManagement, objectUtility)
    const userSubscriptionManagement: UserSubscriptionManagement = new UserSubscriptionManagement(userSubscriptionRepository, objectUtility)

    const userRegisterAuthentication: UserRegisterAuthentication = new UserRegisterAuthentication(userManagement)
    const vendorRegisterAuthentication: VendorRegisterAuthentication = new VendorRegisterAuthentication(vendorManagement)

    const userLoginAuthentication: UserLoginAuthentication = new UserLoginAuthentication(userManagement, sessionManagement)
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

    const checkoutTransaction: CheckoutTransaction = new CheckoutTransaction(userManagement, vendorManagement, jajanItemManagement, jajanItemSnapshotManagement, transactionHistoryManagement, objectUtility)

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
      userSubscriptionManagement,
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
      checkoutTransaction,
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

    const webhookControllerRest: WebhookControllerRest = new WebhookControllerRest(Router(), topUpWebhook)
    webhookControllerRest.registerRoutes()
    routerVersionOne.use('/webhooks', webhookControllerRest.router)

    const topUpHistoryControllerRest: TopUpHistoryController = new TopUpHistoryController(Router(), topUpHistoryManagement, authenticationValidation)
    topUpHistoryControllerRest.registerRoutes()
    routerVersionOne.use('/top-up-histories', topUpHistoryControllerRest.router)

    this.app.use('/api/v1', routerVersionOne)
  }

  registerSockets = async (): Promise<void> => {

  }
}
