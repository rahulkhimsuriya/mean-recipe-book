const AppError = require('./appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 404);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalide input data. ${errors.join(' ')}`;
  return new AppError(message, 404);
};

const handleJWTError = err =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiresError = err =>
  new AppError('Token is Expired. Please log in again.');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.success = false;

  let error = { ...err };

  if (error.name === 'CastError') error = handleCastErrorDB(error);

  if (error.code === 11000) error = handleDuplicateFieldDB(error);

  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

  if (error.name === 'JsonWebTokenError') error = handleJWTError(error);

  if (error.name === 'TokenExpiredError') error = handleJWTExpiresError(error);

  if (error.message === undefined) {
    // const oldMSG = `Cant find ${req.originalUrl} route on this server.`;
    error.message = err.message;
  }

  res.status(error.statusCode).json({
    success: error.success,
    message: error.message,
    error
  });
};
