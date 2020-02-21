"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Yup = __importStar(require("yup"));
exports.headerValidationSchema = Yup.object().shape({
    "x-github-delivery": Yup.string().required(),
    "x-github-event": Yup.string().required(),
    "x-hub-signature": Yup.string().required(),
});
//# sourceMappingURL=validation.js.map