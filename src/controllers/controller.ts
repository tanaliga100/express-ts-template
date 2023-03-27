import { NextFunction, Request, Response } from "express";
import CustomError from "../class/ErrorClass";
import { asyncMiddleware } from "../middlewares/asyncMiddleware";

const sampleController = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    // if (test) throw new CustomError()
  }
);
export { sampleController };
