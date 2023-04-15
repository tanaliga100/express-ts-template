import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import CustomError from "../errors/custom-error";

export const errorHandlerMidlleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err instanceof CustomError ? "CUSTOM_ERROR" : "FALLBACK_ERROR");

  // DEFINE A DEFAULT ERROR OBJECT
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong",
  };
  // BELOW ARE THE DIFFERENT KINDS OF ERROR THROWN BY MONGOOSE || CUSTOMIZED
  // Note: Validation Error Handler

  if (err.name && err.name === "ValidationError") {
    customError.msg = Object.values(err.errors).map((item: any) => {
      const path = item.path;
      const message = item.message;
      return {
        path: path,
        message: message,
      };
    });
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  // Note: Duplicate Error Handler
  if (err.code && err.code === 11000) {
    customError.msg = `DUPLICATE VALUE ENTERED FOR ${Object.keys(
      err.keyValue
    )} FIELD... Please choose another email address`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  // Note: Cast Error Handler
  if (err.name === "CastError") {
    customError.statusCode = StatusCodes.NOT_FOUND;
    customError.msg = `NO ITEM FOUND WITH ID: ${err.value} `;
  }
  // return res.status(404).json({
  //   err,
  // });

  return res.status(customError.statusCode).json({
    ERROR: customError.msg,
  });
};
