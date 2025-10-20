import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

// Rate limiting middleware
export const createRateLimit = (windowMs: number, max: number, message?: string) => {
  return rateLimit({
    windowMs,
    max,
    message: message || 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// General rate limiting
export const generalRateLimit = createRateLimit(
  parseInt(process.env.RATE_LIMIT_WINDOW_MS!) || 900000, // 15 minutes
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS!) || 100
);

// Strict rate limiting for auth endpoints
export const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts per window
  'Too many authentication attempts, please try again later.'
);

// Challenge submission rate limiting
export const submissionRateLimit = createRateLimit(
  60 * 1000, // 1 minute
  10, // 10 submissions per minute
  'Too many submissions, please slow down.'
);

// Error handling middleware
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  if (error.name === 'ValidationError') {
    res.status(400).json({
      error: 'Validation Error',
      details: error.message
    });
    return;
  }

  if (error.name === 'UnauthorizedError') {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid credentials'
    });
    return;
  }

  if (error.code === 'P2002') {
    res.status(409).json({
      error: 'Conflict',
      message: 'Resource already exists'
    });
    return;
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
};

// Not found middleware
export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
};

// CORS middleware
export const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};
