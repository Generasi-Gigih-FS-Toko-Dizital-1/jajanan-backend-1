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
const chai_1 = __importDefault(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
const mocha_1 = require("mocha");
const OneDatastore_1 = __importDefault(require("../../../../src/outers/datastores/OneDatastore"));
const UserMock_1 = __importDefault(require("../../../mocks/UserMock"));
chai_1.default.use(chai_http_1.default);
chai_1.default.should();
(0, mocha_1.describe)('AuthenticationControllerRest', () => {
    const userMock = new UserMock_1.default();
    const oneDatastore = new OneDatastore_1.default();
    (0, mocha_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield oneDatastore.connect();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield oneDatastore.disconnect();
    }));
    (0, mocha_1.describe)('POST /api/v1/authentications/logins?method=username_and_password', () => {
        (0, mocha_1.it)('should return 200 OK', () => __awaiter(void 0, void 0, void 0, function* () {
        }));
        (0, mocha_1.it)('should return 404 NOT FOUND: Unknown username', () => __awaiter(void 0, void 0, void 0, function* () {
        }));
        (0, mocha_1.it)('should return 404 NOT FOUND: Unknown username or password', () => __awaiter(void 0, void 0, void 0, function* () {
        }));
    });
    (0, mocha_1.describe)('POST /api/v1/authentications/registers?method=username_and_password', () => {
        (0, mocha_1.it)('should return 201 CREATED', () => __awaiter(void 0, void 0, void 0, function* () {
        }));
        (0, mocha_1.it)('should return 409 CONFLICT: Username already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        }));
    });
});
//# sourceMappingURL=AuthenticationControllerRest.spec.js.map