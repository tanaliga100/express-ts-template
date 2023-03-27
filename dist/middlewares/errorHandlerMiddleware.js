"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandlerMidlleware = void 0;
const errorHandlerMidlleware = (err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({
        error: {
            message: err.message,
            status,
        },
    });
};
exports.errorHandlerMidlleware = errorHandlerMidlleware;
