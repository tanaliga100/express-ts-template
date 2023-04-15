import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors";
import { asyncMiddleware } from "../middlewares/async-middleware";
import User from "../models/user-model";
import { attachCookiesToResponse } from "../utils/attachCookies";
import { comparePassword } from "../utils/comparePassword";
import { hashPassword } from "../utils/hashedPassword";
import { createTokenUser } from "../utils/tokenUser";

const REGISTER = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    // CHECK EMAIL IF ITS EXISTS
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      throw new BadRequestError(`THIS EMAIL: ${email} ALREADY EXISTS`);
    }
    // HASHING PASSWORD
    const hashedPassword = await hashPassword(password);
    // ASSIGNING THE USER
    const tempUser = {
      name,
      email,
      password: hashedPassword,
      role: req.body.role,
    };
    const hasAdmin = await User.findOne({ role: "admin" });
    const managerCount = await User.countDocuments({ role: "manager" });
    if (!hasAdmin) {
      tempUser.role = "admin";
    } else {
      if (managerCount < 3) {
        tempUser.role = "manager";
      } else {
        tempUser.role = "user";
      }
    }
    // CREATING USER
    const user = await User.create(tempUser);
    // ATTACHING COOKIES
    const tokenUser = await createTokenUser(user);
    // USING CREATE TOKEN | TRADITIONAL
    // const token = createToken(tokenUser);

    // USING COOKIES TO ATTACH TOKEN
    attachCookiesToResponse(res, tokenUser);
    res.status(StatusCodes.CREATED).json({
      msg: "USER_REGISTERED",
      data: tokenUser,
      // token,
    });
  }
);

const LOGIN = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    // CHECK THE REQUEST BODY
    const { email, password } = req.body;

    // FIND EXISTING EMAIL, IF NONE THROW ERROR
    if (!email || !password) {
      throw new BadRequestError("Please provide email and password");
    }
    // // GET THE USER
    const user = await User.findOne({ email });

    if (!user) {
      throw new UnAuthenticatedError(
        "Invalid Credentials : Email doesnt exist"
      );
    }

    // COMPARE PASSWORD USING BCRYPT JS IN THE MODEL
    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      throw new UnAuthenticatedError("Password is incorrect");
    }

    // const isPassCorredct = user.comparePassword(password);
    // if (!isPassCorredct) {
    //   throw new UnAuthenticatedError("Password is incorrect");
    // }

    // IF PASSWORD MATCH RELEASE THE TOKEN
    const tokenUser = await createTokenUser(user);
    attachCookiesToResponse(res, tokenUser);
    res.status(StatusCodes.OK).json({
      msg: "LOGIN_SUCCESSFUL",
      tokenUser,
    });
  }
);

const LOGOUT = asyncMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    // REMOVED COOKIES
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({
      msg: "USER_LOGOUT",
    });
  }
);

export { LOGIN, LOGOUT, REGISTER };
