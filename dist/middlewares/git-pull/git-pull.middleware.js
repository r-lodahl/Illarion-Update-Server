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
const promise_1 = __importDefault(require("simple-git/promise"));
function pullFromGit(gitDirectory) {
    return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        const git = promise_1.default();
        try {
            yield git.silent(true).cwd(gitDirectory);
            yield git.silent(true).pull();
        }
        catch (e) {
            console.error('Git pull failed!', e.errors);
            ctx.throw(500);
        }
        yield next();
    });
}
exports.pullFromGit = pullFromGit;
//# sourceMappingURL=git-pull.middleware.js.map