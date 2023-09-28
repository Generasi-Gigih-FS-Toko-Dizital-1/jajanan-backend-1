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
const App_1 = require("../../../../src/App");
const humps_1 = __importDefault(require("humps"));
chai_1.default.use(chai_http_1.default);
chai_1.default.should();
(0, mocha_1.describe)('UserControllerRest', () => {
    const userMock = new UserMock_1.default();
    const oneDatastore = new OneDatastore_1.default();
    (0, mocha_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield oneDatastore.connect();
        if (oneDatastore.client === undefined) {
            throw new Error('Client is undefined.');
        }
        yield oneDatastore.client.user.createMany({
            data: userMock.data
        });
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        if (oneDatastore.client === undefined) {
            throw new Error('Client is undefined.');
        }
        yield oneDatastore.client.user.deleteMany();
        yield oneDatastore.disconnect();
    }));
    (0, mocha_1.describe)('GET /api/v1/users', () => {
        (0, mocha_1.it)('should return 200 OK', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield chai_1.default.request(App_1.server).get('/api/v1/users');
            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.should.have.property('status').eq(200);
            response.body.should.have.property('message').eq('Read all users succeed.');
            response.body.should.have.property('data');
            response.body.data.should.be.a('array');
            response.body.data.should.be.include.members(userMock.data.map((userMock) => {
                return humps_1.default.decamelizeKeys(userMock);
            }));
        }));
    });
    (0, mocha_1.describe)('GET /api/v1/users?search=encoded', () => {
        (0, mocha_1.it)('should return 200 OK', () => __awaiter(void 0, void 0, void 0, function* () {
        }));
    });
    (0, mocha_1.describe)('GET /api/v1/users/:id', () => {
        (0, mocha_1.it)('should return 200 OK', () => __awaiter(void 0, void 0, void 0, function* () {
        }));
    });
    (0, mocha_1.describe)('POST /api/v1/users', () => {
        (0, mocha_1.it)('should return 201 CREATED', () => __awaiter(void 0, void 0, void 0, function* () {
        }));
    });
    (0, mocha_1.describe)('PATCH /api/v1/users/:id', () => {
        (0, mocha_1.it)('should return 200 OK', () => __awaiter(void 0, void 0, void 0, function* () {
        }));
    });
    (0, mocha_1.describe)('DELETE /api/v1/users/:id', () => {
        (0, mocha_1.it)('should return 200 OK', () => __awaiter(void 0, void 0, void 0, function* () {
        }));
    });
});
//# sourceMappingURL=UserControllerRest.spec.js.map