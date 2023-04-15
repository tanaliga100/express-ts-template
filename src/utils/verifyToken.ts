import jwt from "jsonwebtoken";

export const verifyToken = (accessToken: string) => {
  const token = jwt.verify(accessToken, process.env.JWT_SECRET as string);
  return token;
};
