// server/middleware/errorHandler.js
// This is a simple error handling middleware to provide consistent error responses.
const errorHandler = (statusCode, message) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;
  return error;
};

module.exports = errorHandler;