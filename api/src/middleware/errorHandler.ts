import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ValidationError, NotFoundError } from '../utils/errors';

interface ErrorResponse {
  message: string;
  code: string;
  details?: Array<{
    field?: string;
    message: string;
    value?: any;
  }>;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  
  let response: ErrorResponse;

  if (err instanceof ValidationError) {
    response = {
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: [{
        message: err.message
      }]
    };
    return res.status(400).json(response);
  }

  if (err instanceof NotFoundError) {
    response = {
      message: 'Resource not found',
      code: 'NOT_FOUND_ERROR',
      details: [{
        message: err.message
      }]
    };
    return res.status(404).json(response);
  }

  if (err instanceof PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        response = {
          message: 'Database constraint violation',
          code: 'CONSTRAINT_ERROR',
          details: [{
            message: 'Unique constraint violation'
          }]
        };
        return res.status(409).json(response);
      case 'P2025':
        response = {
          message: 'Record not found',
          code: 'NOT_FOUND_ERROR',
          details: [{
            message: 'The requested record does not exist'
          }]
        };
        return res.status(404).json(response);
      default:
        response = {
          message: 'Database error',
          code: 'DATABASE_ERROR',
          details: [{
            message: 'An error occurred while accessing the database'
          }]
        };
        return res.status(500).json(response);
    }
  }

  // Default error
  response = {
    message: 'Internal Server Error',
    code: 'INTERNAL_ERROR',
    details: process.env.NODE_ENV === 'development' 
      ? [{ message: err.message }] 
      : undefined
  };

  res.status(500).json(response);
}; 