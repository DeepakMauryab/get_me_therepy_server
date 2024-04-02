const ApiResponse = (res, statusCode, data, message = "Something went wrong") =>
  res.status(statusCode).json({ data, message, success: true });

export default ApiResponse;
