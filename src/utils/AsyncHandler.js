import { StatusCodes } from "http-status-codes";
import ApiError from "./ApiError.js";

const AsyncHandler = (handler) => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch((err) => {
      next(
        ApiError(
          res,
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Error: Exception Error",
          err.toString()
        )
      );
    });
  };
};

export default AsyncHandler;
