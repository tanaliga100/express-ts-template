import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(StatusCodes.NOT_FOUND).send(
    `<h3>Route Does not Exist</h3>
  <a href="/">Go Back</a>`
  );
};
