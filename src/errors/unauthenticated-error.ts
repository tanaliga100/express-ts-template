import { StatusCodes } from "http-status-codes";
import CustomError from "./custom-error";

class UnAuthenticatedError extends CustomError {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}
export default UnAuthenticatedError;
