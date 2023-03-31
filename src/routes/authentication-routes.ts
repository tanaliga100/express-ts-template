import express from "express";
import { LOGIN, REGISTER } from "../controllers/auth-controller";
const router = express.Router();

router.route("/register").post(REGISTER);
router.route("/login").post(LOGIN);

export { router };
