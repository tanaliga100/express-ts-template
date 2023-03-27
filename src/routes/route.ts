import express, { Request, Response } from "express";
import { sampleController } from "../controllers/controller";
const router = express.Router();

router.route("/").get(sampleController).post(sampleController);
router
  .route("/:id")
  .get(sampleController)
  .patch(sampleController)
  .delete(sampleController);

export { router };
