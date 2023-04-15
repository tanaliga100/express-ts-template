import express from "express";
import {
  ALL_USERS,
  CURRENT_USER,
  SINGLE_USER,
  UPDATE_USER,
  UPDATE_USER_PASSWORD,
} from "../controllers/user-controller";
import {
  authenticationMiddleware,
  authorizedPermissions,
} from "../middlewares/authentication-middleware";
const router = express.Router();

router
  .route("/")
  .get(
    authenticationMiddleware,
    authorizedPermissions(["admin", "manager", "supervisor"]),
    ALL_USERS
  );
router.route("/showMe").get(authenticationMiddleware, CURRENT_USER);

router.route("/updateUser").patch(authenticationMiddleware, UPDATE_USER);
router
  .route("/updateUserPass")
  .patch(authenticationMiddleware, UPDATE_USER_PASSWORD);
router.route("/:id").get(authenticationMiddleware, SINGLE_USER);

export { router };
