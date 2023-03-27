"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("../controllers/controller");
const router = express_1.default.Router();
exports.router = router;
router.route("/").get(controller_1.sampleController).post(controller_1.sampleController);
router
    .route("/:id")
    .get(controller_1.sampleController)
    .patch(controller_1.sampleController)
    .delete(controller_1.sampleController);
