export const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    code: err.code,
    status: err.status || 500,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Firebase specific errors
  if (err.code?.startsWith('auth/')) {
    const statusCode = err.code === 'auth/user-not-found' ? 404 : 400;
    return res.status(statusCode).json({
      error: err.message || 'Authentication error',
      code: err.code,
      timestamp: new Date().toISOString(),
    });
  }

  // Firestore errors
  if (err.code?.startsWith('firestore/')) {
    return res.status(500).json({
      error: 'Database error',
      code: err.code,
      timestamp: new Date().toISOString(),
    });
  }

  // Validation errors (from express-validator)
  if (err.array && typeof err.array === 'function') {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.array(),
      timestamp: new Date().toISOString(),
    });
  }

  // Default error response
  const statusCode = err.status || err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    error: err.message || 'Internal server error',
    ...(isProduction ? {} : { stack: err.stack }),
    timestamp: new Date().toISOString(),
    path: req.path,
  });
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
