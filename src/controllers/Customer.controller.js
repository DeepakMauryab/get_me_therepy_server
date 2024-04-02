import AsyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { StatusCodes } from "http-status-codes";
import { generateRandomNumber, jwtGenerate } from "../utils/utils.js";
import Customer from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import sendMail from "../services/Mailer.js";
import bcrypt from "bcryptjs";

export const addUserWithGoogleAuth = AsyncHandler(async (req, res) => {
  const { email, username } = req.body;
  if (!email) {
    return ApiError(res, StatusCodes.BAD_REQUEST, "Email Required!");
  }
  let customer = await Customer.findOne({ email });
  if (!customer) {
    customer = new Customer();
    customer.email = email;
    customer.name = username;
  }
  const token = jwtGenerate(req.body);
  customer.token = token;
  customer.save();
  return ApiResponse(
    res,
    StatusCodes.OK,
    { customer },
    "Customer fetched success"
  );
});

export const addCustomer = AsyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  console.log(email, password);
  if (!email) {
    return ApiError(res, StatusCodes.BAD_REQUEST, "Email Required!");
  }
  let customer = await Customer.findOne({ email });
  if (customer) {
    return ApiError(res, StatusCodes.BAD_REQUEST, "Email already Exists!");
  }
  const token = jwtGenerate(req.body);
  const newCustomer = new Customer();
  newCustomer.name = username;
  newCustomer.email = email;
  newCustomer.password = password;
  newCustomer.token = token;
  newCustomer.save();
  return ApiResponse(res, StatusCodes.OK, { newCustomer }, "Customer Added");
});
export const loginCustomer = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return ApiError(res, StatusCodes.BAD_REQUEST, "Email Required!");
  }
  if (!password) {
    return ApiError(res, StatusCodes.BAD_REQUEST, "password Required!");
  }
  let customer = await Customer.findOne({ email });
  if (!customer) {
    return ApiError(res, StatusCodes.BAD_REQUEST, "customer not found");
  }
  const isPasswordCorrect = await bcrypt.compare(password, customer.password);
  if (!isPasswordCorrect) {
    return ApiError(res, StatusCodes.NOT_FOUND, "Wrong Password");
  }
  const token = jwtGenerate(req.body);
  customer.token = token;
  customer.save();
  return ApiResponse(res, StatusCodes.OK, { customer }, "Customer logged in");
});

export const sendOTP = AsyncHandler(async (req, res) => {
  const { email } = req.body;
  let customer = await Customer.findOne({ email });
  if (!customer) {
    return ApiError(res, StatusCodes.NOT_FOUND, "customer not found");
  }
  const otp = generateRandomNumber(4);
  sendMail(
    email,
    "Password Reset Varification",
    otp + " is your one time password to reset the password"
  );
  return ApiResponse(res, StatusCodes.OK, { otp }, "Email sent successfully");
});
export const resetPassword = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  let customer = await Customer.findOne({ email });
  if (!customer) {
    return ApiError(res, StatusCodes.NOT_FOUND, "customer not found");
  }
  customer.password = password;
  customer.save();

  return ApiResponse(res, StatusCodes.OK, {}, "Password reset successfully");
});
