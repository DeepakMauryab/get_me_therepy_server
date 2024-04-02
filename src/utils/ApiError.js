const ApiError = (
  res,
  statusCode,
  message = "Some Error Occured",
  errors = [],
  stack = ""
) => res.status(statusCode).json({ message, errors, stack, success: false });

export default ApiError;
