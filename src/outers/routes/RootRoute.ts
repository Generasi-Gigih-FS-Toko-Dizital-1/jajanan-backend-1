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
import type PaymentGateway from '../payment_gateway/PaymentGateway'
import TopUpRepository from '../repositories/TopUpRepository'
import Midtrans from '../payment_gateway/midtrans'
import { randomUUID } from 'crypto'
import TopUp from '../../inners/use_cases/top_up/TopUp'
import TopUpControllerRest from '../controllers/rests/TopUpControllerRest'

export default class RootRoute {
  app: Application
  io: Server
  datastoreOne: OneDatastore
  twoDatastore: TwoDatastore
  paymentGateway: PaymentGateway

  constructor (app: Application, io: Server, datastoreOne: OneDatastore, twoDatastore: TwoDatastore, paymentGateway: PaymentGateway) {
    this.app = app
    this.io = io
    this.datastoreOne = datastoreOne
    this.twoDatastore = twoDatastore
    this.paymentGateway = paymentGateway
  }

  registerRoutes = async (): Promise<void> => {
    const routerVersionOne = Router()

    const objectUtility: ObjectUtility = new ObjectUtility()

    const sessionRepository: SessionRepository = new SessionRepository(this.twoDatastore)
    const userRepository: UserRepository = new UserRepository(this.datastoreOne)
    const vendorRepository: VendorRepository = new VendorRepository(this.datastoreOne)
    const adminRepository: AdminRepository = new AdminRepository(this.datastoreOne)
    const jajanItemRepository: JajanItemRepository = new JajanItemRepository(this.datastoreOne)
    const transactionHistoryRepository: TransactionHistoryRepository = new TransactionHistoryRepository(this.datastoreOne)

    const sessionManagement: SessionManagement = new SessionManagement(sessionRepository, objectUtility)
    const authenticationValidation: AuthenticationValidation = new AuthenticationValidation(sessionManagement)
    const userManagement: UserManagement = new UserManagement(userRepository, objectUtility)
    const vendorManagement: VendorManagement = new VendorManagement(vendorRepository, objectUtility)
    const adminManagement: AdminManagement = new AdminManagement(adminRepository, objectUtility)
    const jajanItemManagement: JajanItemManagement = new JajanItemManagement(jajanItemRepository, objectUtility)
    const transactionHistoryManagement: TransactionHistoryManagement = new TransactionHistoryManagement(transactionHistoryRepository, objectUtility)

    const userLoginAuthentication: UserLoginAuthentication = new UserLoginAuthentication(userManagement, sessionManagement)
    const userRegisterAuthentication: UserRegisterAuthentication = new UserRegisterAuthentication(userManagement)
    const vendorLoginAuthentication: VendorLoginAuthentication = new VendorLoginAuthentication(vendorManagement, sessionManagement)
    const vendorRegisterAuthentication: VendorRegisterAuthentication = new VendorRegisterAuthentication(vendorManagement)
    const adminLoginAuthentication: AdminLoginAuthentication = new AdminLoginAuthentication(adminManagement, sessionManagement)

    const userRefreshAuthentication: UserRefreshAuthentication = new UserRefreshAuthentication(userManagement, sessionManagement)
    const vendorRefreshAuthentication: VendorRefreshAuthentication = new VendorRefreshAuthentication(vendorManagement, sessionManagement)
    const adminRefreshAuthentication: AdminRefreshAuthentication = new AdminRefreshAuthentication(adminManagement, sessionManagement)

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

    const transactionHistoryControllerRest: TransactionHistoryControllerRest = new TransactionHistoryControllerRest(
      Router(),
      transactionHistoryManagement,
      authenticationValidation
    )
    transactionHistoryControllerRest.registerRoutes()
    routerVersionOne.use('/transaction-histories', transactionHistoryControllerRest.router)

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
      userRefreshAuthentication
    )
    userAuthenticationControllerRest.registerRoutes()
    routerVersionOne.use('/authentications/users', userAuthenticationControllerRest.router)

    const vendorAuthenticationControllerRest: VendorAuthenticationControllerRest = new VendorAuthenticationControllerRest(
      Router(),
      vendorLoginAuthentication,
      vendorRegisterAuthentication,
      vendorRefreshAuthentication
    )
    vendorAuthenticationControllerRest.registerRoutes()
    routerVersionOne.use('/authentications/vendors', vendorAuthenticationControllerRest.router)

    const adminAuthenticationControllerRest: AdminAuthenticationControllerRest = new AdminAuthenticationControllerRest(
      Router(),
      adminLoginAuthentication,
      adminRefreshAuthentication
    )
    adminAuthenticationControllerRest.registerRoutes()
    routerVersionOne.use('/authentications/admins', adminAuthenticationControllerRest.router)

    const paymentGateway = new Midtrans()
    const topUpRepository = new TopUpRepository(paymentGateway, randomUUID)
    const topUpUseCase = new TopUp(topUpRepository, userRepository)
    const topUpControllerRest = new TopUpControllerRest(Router(), topUpUseCase)
    topUpControllerRest.registerRoutes()
    routerVersionOne.use('/topup', topUpControllerRest.router)

    this.app.use('/api/v1', routerVersionOne)
  }

  registerSockets = async (): Promise<void> => {

  }
}
