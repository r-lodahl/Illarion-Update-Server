"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_logger_1 = __importDefault(require("koa-logger"));
const koa_body_1 = __importDefault(require("koa-body"));
const koa_json_1 = __importDefault(require("koa-json"));
const routes_1 = require("./routes/routes");
exports.app = new koa_1.default();
exports.app.use(koa_body_1.default());
exports.app.use(koa_json_1.default({ pretty: true }));
exports.app.use(koa_logger_1.default());
exports.app.use(routes_1.router.routes());
exports.app.use(routes_1.router.allowedMethods());
//# sourceMappingURL=app.js.map