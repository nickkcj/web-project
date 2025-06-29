import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { validationResult } from 'express-validator';

// Custom error class
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error response interface
interface ErrorResponse {
  success: false;
  error: {
    message: string;
    statusCode: number;
    stack?: string;
  };
}

// Main error handler middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err);

  let error: AppError;

  // Use the AppError if it's an error we created intentionally
  if (err instanceof AppError) {
    error = err;
  } 
  // Handle Prisma's "Record not found" error
  else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
    error = new AppError('Record not found', 404);
  }
  // For all other errors, return a generic message to avoid leaking details
  else {
    error = new AppError('An internal server error occurred', 500);
  }

  const response: ErrorResponse = {
    success: false,
    error: {
      message: error.message,
      statusCode: error.statusCode,
    },
  };
  res.status(error.statusCode).json(response);
};

// Wraps async functions to catch errors and pass them to the express error handler
export const asyncHandler = (fn: Function) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 404 handler for undefined routes
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

// Validation middleware - checks for validation errors and throws AppError if found
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err: any) => `${err.path}: ${err.msg}`);
    throw new AppError(`Validation failed: ${errorMessages.join(', ')}`, 400);
  }
  next();
}; 