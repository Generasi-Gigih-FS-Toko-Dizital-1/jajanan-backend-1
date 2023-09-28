"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserRepository_1 = __importDefault(require("../repositories/UserRepository"));
const UserManagement_1 = __importDefault(require("../../inners/use_cases/managements/UserManagement"));
const UserControllerRest_1 = __importDefault(require("../controllers/rests/UserControllerRest"));
const LoginAuthentication_1 = __importDefault(require("../../inners/use_cases/authentications/LoginAuthentication"));
const RegisterAuthentication_1 = __importDefault(require("../../inners/use_cases/authentications/RegisterAuthentication"));
const AuthenticationControllerRest_1 = __importDefault(require("../controllers/rests/AuthenticationControllerRest"));
class RootRoute {
    constructor(app, io, datastoreOne) {
        this.registerRoutes = () => __awaiter(this, void 0, void 0, function* () {
            const routerVersionOne = (0, express_1.Router)();
            const userRepository = new UserRepository_1.default(this.datastoreOne);
            const userManagement = new UserManagement_1.default(userRepository);
            const userControllerRest = new UserControllerRest_1.default((0, express_1.Router)(), userManagement);
            userControllerRest.registerRoutes();
            routerVersionOne.use('/users', userControllerRest.router);
            const loginAuthentication = new LoginAuthentication_1.default(userManagement);
            const registerAuthentication = new RegisterAuthentication_1.default(userManagement);
            const authenticationControllerRest = new AuthenticationControllerRest_1.default((0, express_1.Router)(), loginAuthentication, registerAuthentication);
            authenticationControllerRest.registerRoutes();
            routerVersionOne.use('/authentications', authenticationControllerRest.router);
            this.app.use('/api/v1', routerVersionOne);
        });
        this.registerSockets = () => __awaiter(this, void 0, void 0, function* () {
        });
        this.app = app;
        this.io = io;
        this.datastoreOne = datastoreOne;
    }
}
exports.default = RootRoute;
//# sourceMappingURL=RootRoute.js.map