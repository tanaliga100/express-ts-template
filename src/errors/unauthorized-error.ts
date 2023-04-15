import { StatusCodes } from "http-status-codes";
import CustomError from "./custom-error";

class UnAuthorizedError extends CustomError {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}
export default UnAuthorizedError;
