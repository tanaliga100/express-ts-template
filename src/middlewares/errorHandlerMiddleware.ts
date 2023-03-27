import express, { NextFunction, Request, Response } from "express";

export const errorHandlerMidlleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: err.message,
      status,
    },
  });
};
