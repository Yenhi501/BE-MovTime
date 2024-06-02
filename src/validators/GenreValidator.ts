import { query, param, body } from 'express-validator';

export const validateDeleteGenre = [
    body('genreId').notEmpty().withMessage('genreId is required').isInt({min:1}).withMessage('genreId must be an integer and genreId >=1'),
];

export const validateUpdateGenre = [
    body('genreId').notEmpty().withMessage('genreId is required').isInt({min:1}).withMessage('genreId must be an integer and genreId >=1'),
    body('name').notEmpty().withMessage('name genre to update is required').isString().withMessage('Name of genre must be a string'),
  ];
  
export const validateCreateGenre = [
    body('name').notEmpty().withMessage('name genre is required').isString().withMessage('Name of genre must be a string'),
  ];

    