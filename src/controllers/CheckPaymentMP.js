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
exports.PaymentStatus = void 0;
const mercadopago_1 = __importDefault(require("mercadopago"));
const yup = __importStar(require("yup"));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["Pending"] = "pending";
    PaymentStatus["Approved"] = "approved";
    PaymentStatus["Error"] = "error";
    PaymentStatus["Cancelled"] = "cancelled";
})(PaymentStatus = exports.PaymentStatus || (exports.PaymentStatus = {}));
const yupSchema = yup.object().shape({
    id: yup.number().required()
});
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.MP_TOKEN) {
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor entre em contato com o suporte'
        });
    }
    try {
        const { id } = yield yupSchema.validate(req.body, {
            abortEarly: true
        });
        mercadopago_1.default.configurations.setAccessToken(process.env.MP_TOKEN);
        const { response } = yield mercadopago_1.default.payment.get(id);
        if (response.status === PaymentStatus.Approved) {
            return res.status(200).json({
                success: false,
                message: 'Seu pagamento foi aprovado'
            });
        }
        const paymentData = {
            id: response.id,
            status: response.status,
            qr_code: response.point_of_interaction.transaction_data.qr_code,
            qr_code_base64: response.point_of_interaction.transaction_data.qr_code_base64,
            ticket_url: response.point_of_interaction.transaction_data.ticket_url,
            date_created: response.date_created,
            date_of_expiration: response.date_of_expiration
        };
        return res.status(200).json({
            success: true,
            payment: paymentData
        });
    }
    catch (error) {
        if (error instanceof yup.ValidationError) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        return res.status(400).json({
            success: false,
            message: 'Não foi possível obter as informações de pagamento'
        });
    }
});
