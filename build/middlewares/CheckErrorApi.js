"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = void 0;
const error = (error, req, res, next) => {
    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Invalid request'
        });
    }
    next();
};
exports.error = error;
