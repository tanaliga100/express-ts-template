import { NextFunction, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { UnAuthenticatedError } from "../errors";
import UnAuthorizedError from "../errors/unauthorized-error";
import { verifyToken } from "../utils/verifyToken";

const authenticationMiddleware = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  //CHECK HEADER
  const token = req.signedCookies.token;
  if (!token) {
    throw new UnAuthenticatedError("Authentication Failed");
  }
  try {
    const { name, userId, role } = verifyToken(token) as JwtPayload;
    req.user = { name, userId, role };
    next();
  } catch (error) {
    throw new UnAuthenticatedError("Authentication failed");
  }
};

const authorizedPermissions = (roles: string[]) => {
  return (req: any, res: any, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      throw new UnAuthorizedError("Not authorized to access this route");
    }
    next();
  };
};

export { authenticationMiddleware, authorizedPermissions };
