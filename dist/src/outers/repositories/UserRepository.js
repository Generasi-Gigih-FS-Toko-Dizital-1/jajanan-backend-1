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
Object.defineProperty(exports, "__esModule", { value: true });
class UserRepository {
    constructor(datastoreOne) {
        this.readAll = (isAggregated) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const args = {};
            if (isAggregated === true) {
                args.include = this.aggregatedArgs.include;
            }
            const foundUser = yield ((_a = this.oneDatastore.client) === null || _a === void 0 ? void 0 : _a.user.findMany(args));
            if (foundUser === undefined) {
                throw new Error('Found user is undefined.');
            }
            return foundUser;
        });
        this.readOneById = (id, isAggregated) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            const args = {
                where: {
                    id
                }
            };
            if (isAggregated === true) {
                args.include = this.aggregatedArgs.include;
            }
            const foundUser = yield ((_b = this.oneDatastore.client) === null || _b === void 0 ? void 0 : _b.user.findFirst(args));
            if (foundUser === undefined) {
                throw new Error('Found user is undefined.');
            }
            return foundUser;
        });
        this.readOneByUsername = (username, isAggregated) => __awaiter(this, void 0, void 0, function* () {
            var _c;
            const args = {
                where: {
                    username
                }
            };
            if (isAggregated === true) {
                args.include = this.aggregatedArgs.include;
            }
            const foundUser = yield ((_c = this.oneDatastore.client) === null || _c === void 0 ? void 0 : _c.user.findFirst(args));
            if (foundUser === undefined) {
                throw new Error('Found user is undefined.');
            }
            return foundUser;
        });
        this.readOneByEmail = (email, isAggregated) => __awaiter(this, void 0, void 0, function* () {
            var _d;
            const args = {
                where: {
                    email
                }
            };
            if (isAggregated === true) {
                args.include = this.aggregatedArgs.include;
            }
            const foundUser = yield ((_d = this.oneDatastore.client) === null || _d === void 0 ? void 0 : _d.user.findFirst(args));
            if (foundUser === undefined) {
                throw new Error('Found user is undefined.');
            }
            return foundUser;
        });
        this.readOneByUsernameAndPassword = (username, password, isAggregated) => __awaiter(this, void 0, void 0, function* () {
            var _e;
            const args = {
                where: {
                    username,
                    password
                }
            };
            if (isAggregated === true) {
                args.include = this.aggregatedArgs.include;
            }
            const foundUser = yield ((_e = this.oneDatastore.client) === null || _e === void 0 ? void 0 : _e.user.findFirst(args));
            if (foundUser === undefined) {
                throw new Error('Found user is undefined.');
            }
            return foundUser;
        });
        this.readOneByEmailAndPassword = (email, password, isAggregated) => __awaiter(this, void 0, void 0, function* () {
            var _f;
            const args = {
                where: {
                    email,
                    password
                }
            };
            if (isAggregated === true) {
                args.include = this.aggregatedArgs.include;
            }
            const foundUser = yield ((_f = this.oneDatastore.client) === null || _f === void 0 ? void 0 : _f.user.findFirst(args));
            if (foundUser === undefined) {
                throw new Error('Found user is undefined.');
            }
            return foundUser;
        });
        this.createOne = (user, isAggregated) => __awaiter(this, void 0, void 0, function* () {
            var _g;
            const args = {
                data: user
            };
            if (isAggregated === true) {
                args.include = this.aggregatedArgs.include;
            }
            const createdUser = yield ((_g = this.oneDatastore.client) === null || _g === void 0 ? void 0 : _g.user.create(args));
            if (createdUser === undefined) {
                throw new Error('Created user is undefined.');
            }
            return createdUser;
        });
        this.patchOneById = (id, user, isAggregated) => __awaiter(this, void 0, void 0, function* () {
            var _h;
            const args = {
                where: {
                    id
                },
                data: user
            };
            if (isAggregated === true) {
                args.include = this.aggregatedArgs.include;
            }
            const patchedUser = yield ((_h = this.oneDatastore.client) === null || _h === void 0 ? void 0 : _h.user.update(args));
            if (patchedUser === undefined) {
                throw new Error('Patched user is undefined.');
            }
            return patchedUser;
        });
        this.deleteOneById = (id, isAggregated) => __awaiter(this, void 0, void 0, function* () {
            var _j;
            const args = {
                where: {
                    id
                }
            };
            if (isAggregated === true) {
                args.include = this.aggregatedArgs.include;
            }
            const deletedUser = yield ((_j = this.oneDatastore.client) === null || _j === void 0 ? void 0 : _j.user.delete(args));
            if (deletedUser === undefined) {
                throw new Error('Deleted user is undefined.');
            }
            return deletedUser;
        });
        this.oneDatastore = datastoreOne;
        this.aggregatedArgs = {
            include: {
                notificationHistories: true,
                topUpHistories: true,
                transactionHistories: true,
                userSubscriptions: true
            }
        };
    }
}
exports.default = UserRepository;
//# sourceMappingURL=UserRepository.js.map