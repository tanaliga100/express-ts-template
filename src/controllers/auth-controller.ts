import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { asyncMiddleware } from "../middlewares/async-middleware";

const REGISTER = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);

    const { name, email, password } = req.body;
    //Note:  PASSWORD IS HASHED IN THE MODEL BEFORE IT SAVE TO DATABSE
    // Creation of the User here....
    res.status(StatusCodes.CREATED).json({
      msg: "USER_REGISTERED",
      data: { ...req.body },
    });
  }
);

const LOGIN = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);

    // CHECK THE REQUEST BODY
    const { email, password } = req.body;
    // FIND EXISTING EMAIL, IF NONE THROW ERROR
    // COMPARE PASSWORD USING BCRYPT JS IN THE MODEL
    // IF PASSWORD MATCH RELEASE THE TOKEN
    res.status(StatusCodes.OK).json({
      msg: "LOGIN_SUCCESSFUL",
      data: { ...req.body },
    });
  }
);

export { LOGIN, REGISTER };
