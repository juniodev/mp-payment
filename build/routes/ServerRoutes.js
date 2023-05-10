"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CheckPaymentMP_1 = __importDefault(require("../controllers/CheckPaymentMP"));
const CreatePaymentPix_1 = __importDefault(require("../controllers/CreatePaymentPix"));
const HookPaymentPixMP_1 = __importDefault(require("../hooks/HookPaymentPixMP"));
const route = (0, express_1.Router)();
route.post('/api/v1/create/payment/pix', CreatePaymentPix_1.default);
route.post('/api/v1/payment/status/notification', HookPaymentPixMP_1.default);
route.get('/api/v1/payment/status', CheckPaymentMP_1.default);
exports.default = route;
