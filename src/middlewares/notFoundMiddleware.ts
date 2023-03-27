import express, { NextFunction, Request, Response } from "express";

export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).send(
    `<h3>Route Does not Exist</h3>
  <a href="/">Go Back</a>`
  );
};
