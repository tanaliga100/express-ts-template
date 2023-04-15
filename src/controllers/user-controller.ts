import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from "../errors";
import { asyncMiddleware } from "../middlewares/async-middleware";
import User from "../models/user-model";
import { attachCookiesToResponse } from "../utils/attachCookies";
import { comparePassword } from "../utils/comparePassword";
import { hashPassword } from "../utils/hashedPassword";
import { createTokenUser } from "../utils/tokenUser";

const ALL_USERS = asyncMiddleware(
  async (req: any, res: Response, next: NextFunction) => {
    console.log("PAYLOAD FROM VERIFIED COOKIE", req.user);
    const users = await User.find({ role: "manager" });
    if (!users) {
      throw new BadRequestError("No Users found");
    }
    res.status(StatusCodes.OK).json({ msg: "ALL_USERS", users });
  }
);

const SINGLE_USER = asyncMiddleware(
  async (req: any, res: Response, next: NextFunction) => {
    console.log("PAYLOAD FROM VERIFIED COOKIE", req.user);

    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      throw new NotFoundError(`No user with id ${req.params.id}`);
    }
    res.status(StatusCodes.OK).json({ msg: "SINGLE_USER", user });
  }
);

const CURRENT_USER = asyncMiddleware(
  async (req: any, res: Response, next: NextFunction) => {
    const currentUser = { name: req.user.name, role: req.user.role };
    res.status(StatusCodes.OK).json({ msg: "CURRENT_USER", currentUser });
  }
);

const UPDATE_USER = asyncMiddleware(
  async (req: any, res: Response, next: NextFunction) => {
    const { name, email } = req.body;
    if (!name || !email) {
      throw new BadRequestError("PLEASE PROVIDE ALL THE VALUES");
    }
    const user = await User.findOneAndUpdate(
      { _id: req.user.userId },
      { email, name },
      { new: true, runValidators: true }
    );
    const tokenUser = await createTokenUser(user);
    // ATTACH COOKIES
    attachCookiesToResponse(res, tokenUser);
    // OK ? SEND BACK TO CLIENT : THROW ERROR
    res.status(StatusCodes.OK).json({ msg: "USER_UPDATED", data: tokenUser });
  }
);

const UPDATE_USER_PASSWORD = asyncMiddleware(
  async (req: any, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      throw new BadRequestError("Please provide both values");
    }
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
    }
    const isPasswordCorrect = await comparePassword(
      oldPassword,
      user?.password
    );
    if (!isPasswordCorrect) {
      throw new UnAuthenticatedError("Invalid password");
    }
    const hashedPassword = await hashPassword(newPassword);
    user!.password = hashedPassword;
    await user!.save();

    res.status(StatusCodes.OK).json({ msg: "USER_PASSWORD_UPDATED" });
  }
);

export {
  ALL_USERS,
  CURRENT_USER,
  SINGLE_USER,
  UPDATE_USER,
  UPDATE_USER_PASSWORD,
};
