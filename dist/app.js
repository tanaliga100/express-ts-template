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
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const connectDB_1 = require("./config/connectDB");
const errorHandlerMiddleware_1 = require("./middlewares/errorHandlerMiddleware");
const notFoundMiddleware_1 = require("./middlewares/notFoundMiddleware");
const route_1 = require("./routes/route");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
// ROUTES
app.get("/", (req, res) => {
    res.json({ msg: "Server Alive : Express Ts" });
});
app.use("/api/v1", route_1.router);
// 404 MIDDLEWARE
app.use(notFoundMiddleware_1.notFoundMiddleware);
// ERROR MIDDLEWARE
app.use(errorHandlerMiddleware_1.errorHandlerMidlleware);
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    const port = process.env.PORT || 5001;
    try {
        yield (0, connectDB_1.connectDB)(process.env.MONGO_URL);
        app.listen(port, () => {
            console.log(`Server alive: ${port}`);
        });
    }
    catch (error) {
        console.log("Something went wrong");
    }
});
start();
