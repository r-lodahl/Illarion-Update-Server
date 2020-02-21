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
const koa_router_1 = __importDefault(require("koa-router"));
const payload_verification_middleware_1 = require("../middlewares/payload-verification/payload-verification.middleware");
const git_pull_middleware_1 = require("../middlewares/git-pull/git-pull.middleware");
const map_update_middleware_1 = require("../middlewares/map-update/map-update.middleware");
const version_update_middleware_1 = require("../middlewares/version-update/version-update.middleware");
exports.router = new koa_router_1.default();
exports.router.get('/api/health', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.status = 200;
    yield next();
}));
// Update routes
exports.router.get('/api/versions');
exports.router.get('/api/map');
// Git hook routes
exports.router.post('/api/map', payload_verification_middleware_1.verifyPayload, git_pull_middleware_1.pullFromGit(__dirname + 'git/maps'), map_update_middleware_1.updateMapFiles, version_update_middleware_1.updateVersion(__dirname + 'git/maps'));
//# sourceMappingURL=routes.js.map