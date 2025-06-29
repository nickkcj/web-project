import { body, param, query } from 'express-validator';

// User validations
export const validateCreateUser = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one letter and one number'),
];

export const validateUpdateUser = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one letter and one number'),
];

export const validateLoginUser = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Review validations
export const validateCreateReview = [
  body('movieId')
    .isInt({ min: 1 })
    .withMessage('Valid movie ID is required'),
  
  body('rating')
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating must be between 0 and 5'),
  
  body('comment')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1 and 1000 characters'),
  
  body('visibility')
    .optional()
    .isIn(['PUBLIC', 'PRIVATE'])
    .withMessage('Visibility must be either PUBLIC or PRIVATE'),
];

export const validateUpdateReview = [
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating must be between 0 and 5'),
  
  body('comment')
    .optional()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1 and 1000 characters'),
  
  body('visibility')
    .optional()
    .isIn(['PUBLIC', 'PRIVATE'])
    .withMessage('Visibility must be either PUBLIC or PRIVATE'),
];

// Comment validations
export const validateCreateComment = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ min: 1, max: 500 })
    .withMessage('Comment must be between 1 and 500 characters'),
];

// Follower validations
export const validateFollowUser = [
  body('followUserId')
    .isInt({ min: 1 })
    .withMessage('Valid user ID is required'),
];

export const validateUnfollowUser = [
  body('unfollowUserId')
    .isInt({ min: 1 })
    .withMessage('Valid user ID is required'),
];

// Parameter validations
export const validateIdParam = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid ID parameter is required'),
];

export const validateUserIdParam = [
  param('userId')
    .isInt({ min: 1 })
    .withMessage('Valid user ID parameter is required'),
];

export const validateMovieIdParam = [
  param('movieId')
    .isInt({ min: 1 })
    .withMessage('Valid movie ID parameter is required'),
];

export const validateReviewIdParam = [
  param('reviewId')
    .isInt({ min: 1 })
    .withMessage('Valid review ID parameter is required'),
];

// Query validations
export const validatePaginationQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

export const validateSearchQuery = [
  query('query')
    .trim()
    .notEmpty()
    .withMessage('Search query is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
]; 