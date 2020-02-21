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
const config_1 = __importDefault(require("config"));
const crypto_1 = __importDefault(require("crypto"));
const validation_1 = require("./validation");
const yup_1 = require("yup");
const secret = config_1.default.get('secret');
function createComparisionSignature(body) {
    const hmac = crypto_1.default.createHmac('sha1', secret);
    const selfSignature = hmac.update(JSON.stringify(body)).digest('hex');
    return `sha1=${selfSignature}`;
}
function compareSignatures(signature, comparisonSignature) {
    const source = Buffer.from(signature);
    const comparison = Buffer.from(comparisonSignature);
    if (source.length !== comparison.length)
        return false;
    return crypto_1.default.timingSafeEqual(source, comparison);
}
function verifyPayload(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const headers = ctx.request.headers;
        try {
            yield validation_1.headerValidationSchema.validate(headers, {
                abortEarly: false,
            });
        }
        catch (e) {
            if (yup_1.ValidationError.isError(e)) {
                console.error(e.errors);
                ctx.throw(422, e.errors);
            }
            ctx.throw(500);
        }
        const signature = ctx.request.headers['x-hub-signature'];
        const comparison = createComparisionSignature(ctx.request.body);
        if (!compareSignatures(signature, comparison)) {
            ctx.throw(401, 'Mismatched signatures');
        }
        yield next();
    });
}
exports.verifyPayload = verifyPayload;
//# sourceMappingURL=payload-verification.middleware.js.map