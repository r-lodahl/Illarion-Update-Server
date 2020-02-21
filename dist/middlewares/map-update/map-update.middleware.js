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
const glob_1 = __importDefault(require("glob"));
const windows_1252_1 = __importDefault(require("windows-1252"));
const jszip_1 = __importDefault(require("jszip"));
const fs_extra_1 = __importDefault(require("fs-extra"));
function updateMapFiles(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = glob_1.default.sync(__dirname + "git/maps/**/*.txt");
        const zip = new jszip_1.default();
        for (const file of files) {
            const path = file.match(/(?<=raw_maps).*/)[0];
            zip.file(path, windows_1252_1.default.decode(yield fs_extra_1.default.readFile(file, 'binary')));
        }
        const file = yield zip.generateAsync({ type: "arraybuffer" });
        yield fs_extra_1.default.writeFile(__dirname + 'public/maps.zip', file);
        yield next();
    });
}
exports.updateMapFiles = updateMapFiles;
//# sourceMappingURL=map-update.middleware.js.map