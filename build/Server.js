"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const express_1 = __importStar(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const CheckErrorApi_1 = require("./middlewares/CheckErrorApi");
const ServerRoutes_1 = __importDefault(require("./routes/ServerRoutes"));
const app = (0, express_1.default)();
(0, dotenv_1.config)();
const PORT = process.env.PORT || 3001;
app.use((0, express_1.urlencoded)({ extended: false }));
app.use((0, express_1.json)());
app.use((0, cors_1.default)({
    origin: '*'
}));
app.use((0, helmet_1.default)());
app.use(CheckErrorApi_1.error);
app.use(ServerRoutes_1.default);
app.listen(PORT, () => {
    console.log('Listening on port %s', PORT);
});
