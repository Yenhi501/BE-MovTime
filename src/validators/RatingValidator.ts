import { query, param, body } from 'express-validator';

export const validateAddRating = [
    body('movieId').notEmpty().withMessage('movieId is required').isInt({min:1}).withMessage('movieId must be an integer and movieId >=1'),
    body('rating').notEmpty().withMessage('rating is required').isFloat({min:1, max: 5}).withMessage('rating must be an number and 1 <= rating <=5'),
];

export const validateDeleteRating= [
    body('movieId').notEmpty().withMessage('movieId is required').isInt({min:1}).withMessage('movieId must be an integer and movieId >=1'),
    body('userId').notEmpty().withMessage('userId is required').isInt({min:1}).withMessage('userId must be an number and userId >= 1'),
];

export const validateUpdateRating= [
    body('movieId').notEmpty().withMessage('movieId is required').isInt({min:1}).withMessage('movieId must be an integer and movieId >=1'),
    body('userId').notEmpty().withMessage('userId is required').isInt({min:1}).withMessage('userId must be an number and userId >= 1'),
    body('rating').notEmpty().withMessage('rating is required').isFloat({min:1, max: 5}).withMessage('rating must be an number and 1 <= rating <=5'),
];