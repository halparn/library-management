import { body, param, query, ValidationChain, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const paginationValidators = {
  page: query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive number')
    .toInt(),
  
  limit: query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
    .toInt()
};

export const userValidators = {
  userId: param('userId')
    .exists()
    .notEmpty()
    .isInt()
    .toInt(),
  
  bookId: param('bookId')
    .exists()
    .notEmpty()
    .isInt()
    .toInt(),
  
  score: body('score')
    .exists()
    .notEmpty()
    .isInt({ min: 0, max: 10 })
    .toInt(),

  queryParams: [
    paginationValidators.page,
    paginationValidators.limit
  ]
};

export const bookValidators = {
  bookId: param('id')
    .isInt()
    .withMessage('Book ID must be a number')
    .toInt(),
  
  createBook: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Book name is required')
      .isLength({ max: 255 })
      .withMessage('Book name must be less than 255 characters'),
    
    body('author')
      .trim()
      .notEmpty()
      .withMessage('Author name is required')
      .isLength({ max: 255 })
      .withMessage('Author name must be less than 255 characters'),
    
    body('year')
      .notEmpty()
      .withMessage('Year is required')
      .isInt({ min: 1000, max: new Date().getFullYear() })
      .withMessage('Invalid year')
      .toInt(),
  ],

  updateBook: [
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Book name cannot be empty')
      .isLength({ max: 255 })
      .withMessage('Book name must be less than 255 characters'),
    
    body('author')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Author name cannot be empty')
      .isLength({ max: 255 })
      .withMessage('Author name must be less than 255 characters'),
    
    body('year')
      .optional()
      .isInt({ min: 1000, max: new Date().getFullYear() })
      .withMessage('Invalid year')
      .toInt(),
  ],

  queryParams: [
    query('search')
      .optional()
      .trim(),
    
    query('available')
      .optional()
      .isBoolean()
      .withMessage('Available must be true or false')
      .toBoolean(),

    paginationValidators.page,
    paginationValidators.limit
  ],
};

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors.array().map((err: any) => ({
          field: err.path,
          message: err.msg,
          value: err.value
        }))
      });
    }
    
    next();
  };
};

export const sanitizeInputs = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      const value = req.body[key];
      if (typeof value === 'string') {
        req.body[key] = value.trim();
      }
    });
  }

  if (req.query) {
    Object.keys(req.query).forEach(key => {
      const value = req.query[key];
      if (typeof value === 'string') {
        req.query[key] = value.trim();
      }
    });
  }

  next();
}; 