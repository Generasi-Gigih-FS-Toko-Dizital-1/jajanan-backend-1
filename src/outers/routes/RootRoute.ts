import { type Application, Router } from 'express'
import type OneDatastore from '../datastores/OneDatastore'
import UserRepository from '../repositories/UserRepository'
import UserManagement from '../../inners/use_cases/managements/UserManagement'
import UserControllerRest from '../controllers/rests/UserControllerRest'
import type socketIo from 'socket.io'
import VendorLoginAuthentication from '../../inners/use_cases/authentications/vendors/VendorLoginAuthentication'
import VendorRegisterAuthentication from '../../inners/use_cases/authentications/vendors/VendorRegisterAuthentication'
import UserAuthenticationControllerRest from '../controllers/rests/UserAuthenticationControllerRest'
import ObjectUtility from '../utilities/ObjectUtility'
import UserRegisterAuthentication from '../../inners/use_cases/authentications/users/UserRegisterAuthentication'
import UserLoginAuthentication from '../../inners/use_cases/authentications/users/UserLoginAuthentication'
import VendorAuthenticationControllerRest from '../controllers/rests/VendorAuthenticationControllerRest'
import AdminLoginAuthentication from '../../inners/use_cases/authentications/admins/AdminLoginAuthentication'
import AdminRegisterAuthentication from '../../inners/use_cases/authentications/admins/AdminRegisterAuthentication'
import AdminAuthenticationControllerRest from '../controllers/rests/AdminAuthenticationControllerRest'
import VendorRepository from '../repositories/VendorRepository'
import VendorManagement from '../../inners/use_cases/managements/VendorManagement'
import VendorControllerRest from '../controllers/rests/VendorControllerRest'
import AdminRepository from '../repositories/AdminRepository'
import AdminManagement from '../../inners/use_cases/managements/AdminManagement'
import AdminControllerRest from '../controllers/rests/AdminControllerRest'

export default class RootRoute {
  app: Application
  io: socketIo.Server
  datastoreOne: OneDatastore

  constructor (app: Application, io: socketIo.Server, datastoreOne: OneDatastore) {
    this.app = app
    this.io = io
    this.datastoreOne = datastoreOne
  }

  registerRoutes = async (): Promise<void> => {
    const routerVersionOne = Router()

    const objectUtility: ObjectUtility = new ObjectUtility()

    const userRepository: UserRepository = new UserRepository(this.datastoreOne)
    const userManagement: UserManagement = new UserManagement(userRepository, objectUtility)
    const userControllerRest: UserControllerRest = new UserControllerRest(
      Router(),
      userManagement
    )
    userControllerRest.registerRoutes()
    routerVersionOne.use('/users', userControllerRest.router)

    const vendorRepository: VendorRepository = new VendorRepository(this.datastoreOne)
    const vendorManagement: VendorManagement = new VendorManagement(vendorRepository, objectUtility)
    const vendorControllerRest: VendorControllerRest = new VendorControllerRest(
      Router(),
      vendorManagement
    )
    vendorControllerRest.registerRoutes()
    routerVersionOne.use('/vendors', vendorControllerRest.router)

    const adminRepository: AdminRepository = new AdminRepository(this.datastoreOne)
    const adminManagement: AdminManagement = new AdminManagement(adminRepository, objectUtility)
    const adminControllerRest: AdminControllerRest = new AdminControllerRest(
      Router(),
      adminManagement
    )
    adminControllerRest.registerRoutes()
    routerVersionOne.use('/admins', adminControllerRest.router)

    const userLoginAuthentication: UserLoginAuthentication = new UserLoginAuthentication(userManagement)
    const userRegisterAuthentication: UserRegisterAuthentication = new UserRegisterAuthentication(userManagement)
    const userAuthenticationControllerRest: UserAuthenticationControllerRest = new UserAuthenticationControllerRest(
      Router(),
      userLoginAuthentication,
      userRegisterAuthentication
    )
    userAuthenticationControllerRest.registerRoutes()
    routerVersionOne.use('/authentications/users', userAuthenticationControllerRest.router)

    const vendorLoginAuthentication: VendorLoginAuthentication = new VendorLoginAuthentication(vendorManagement)
    const vendorRegisterAuthentication: VendorRegisterAuthentication = new VendorRegisterAuthentication(vendorManagement)
    const vendorAuthenticationControllerRest: VendorAuthenticationControllerRest = new VendorAuthenticationControllerRest(
      Router(),
      vendorLoginAuthentication,
      vendorRegisterAuthentication
    )
    vendorAuthenticationControllerRest.registerRoutes()
    routerVersionOne.use('/authentications/vendors', vendorAuthenticationControllerRest.router)

    const adminLoginAuthentication: AdminLoginAuthentication = new AdminLoginAuthentication(adminManagement)
    const adminRegisterAuthentication: AdminRegisterAuthentication = new AdminRegisterAuthentication(adminManagement)
    const adminAuthenticationControllerRest: AdminAuthenticationControllerRest = new AdminAuthenticationControllerRest(
      Router(),
      adminLoginAuthentication,
      adminRegisterAuthentication
    )
    adminAuthenticationControllerRest.registerRoutes()
    routerVersionOne.use('/authentications/admins', adminAuthenticationControllerRest.router)

    this.app.use('/api/v1', routerVersionOne)
  }

  registerSockets = async (): Promise<void> => {

  }
}
