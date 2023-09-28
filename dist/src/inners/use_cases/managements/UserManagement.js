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
const Result_1 = __importDefault(require("../../models/value_objects/Result"));
class UserManagement {
    constructor(userRepository) {
        this.readAll = () => __awaiter(this, void 0, void 0, function* () {
            const foundUsers = yield this.userRepository.readAll();
            return new Result_1.default(200, 'User read all succeed.', foundUsers);
        });
        this.readOneById = (id) => __awaiter(this, void 0, void 0, function* () {
            const foundUser = yield this.userRepository.readOneById(id);
            return new Result_1.default(200, 'User read one by id succeed.', foundUser);
        });
        this.readOneByUsername = (username) => __awaiter(this, void 0, void 0, function* () {
            const foundUser = yield this.userRepository.readOneByUsername(username);
            return new Result_1.default(200, 'User read one by username succeed.', foundUser);
        });
        this.readOneByEmail = (email) => __awaiter(this, void 0, void 0, function* () {
            const foundUser = yield this.userRepository.readOneByEmail(email);
            return new Result_1.default(200, 'User read one by email succeed.', foundUser);
        });
        this.readOneByUsernameAndPassword = (username, password) => __awaiter(this, void 0, void 0, function* () {
            const foundUser = yield this.userRepository.readOneByUsernameAndPassword(username, password);
            return new Result_1.default(200, 'User read one by username and password succeed.', foundUser);
        });
        this.readOneByEmailAndPassword = (email, password) => __awaiter(this, void 0, void 0, function* () {
            const foundUser = yield this.userRepository.readOneByEmailAndPassword(email, password);
            return new Result_1.default(200, 'User read one by email and password succeed.', foundUser);
        });
        this.createOne = (user) => __awaiter(this, void 0, void 0, function* () {
            const createdUser = yield this.userRepository.createOne(user);
            return new Result_1.default(201, 'User create one succeed.', createdUser);
        });
        this.patchOneById = (id, user) => __awaiter(this, void 0, void 0, function* () {
            const patchedUser = yield this.userRepository.patchOneById(id, user);
            return new Result_1.default(200, 'User patch one by id succeed.', patchedUser);
        });
        this.deleteOneById = (id) => __awaiter(this, void 0, void 0, function* () {
            const deletedUser = yield this.userRepository.deleteOneById(id);
            return new Result_1.default(200, 'User delete one by id succeed.', deletedUser);
        });
        this.userRepository = userRepository;
    }
}
exports.default = UserManagement;
//# sourceMappingURL=UserManagement.js.map