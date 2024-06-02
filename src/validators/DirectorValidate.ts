import { query, param, body } from 'express-validator';

export const validateDeleteDirector= [
    param('directorId').notEmpty().withMessage('directorId is required').isInt({min:1}).withMessage('directorId must be an integer'),
];

export const validateGetDirectorDetails = [
    param('directorId').notEmpty().withMessage('directorId is required').isInt({min:1}).withMessage('directorId must be an integer'),
];

export const validateGetDirectors = [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('pageSize').optional().isInt({ min: 1 }).withMessage('Page size must be a positive integer'),
    query('name').optional().isString().withMessage('Search must be a string'),
];

export const validateUpdateDirector = [
    param('directorId').notEmpty().withMessage('directorId is required').isInt({min:1}).withMessage('directorId must be an integer'),
    body('name').optional().isString().withMessage('name of director must be a string'),
    body('gender').optional().isIn(['Male', 'Female','Other']).withMessage('option is required and in Male, Female, Other'),
    body('dateOfBirth').optional().isISO8601().withMessage('dateOfBirth must be a valid date'),
    body('description').optional().isString().withMessage('description must be a string'),
];

export const validateCreateDirector = [
    body('name').notEmpty().withMessage('name of director is required').isString().withMessage('name of director must be a string'),
    body('gender').optional().isIn(['Male', 'Female','Other']).withMessage('option is required and in Male, Female, Other'),
    body('dateOfBirth').optional().isISO8601().withMessage('dateOfBirth must be a valid date'),
    body('description').optional().isString().withMessage('description must be a string'),
];

export const validateGetPresignUrlDirector = [
    query('directorId').notEmpty().withMessage('directorId is required').isInt({min:1}).withMessage('directorId must be an integer'),
];

export const validateClearCloudFront = [
    body('id').notEmpty().withMessage('id is required').isInt({min:1}).withMessage('id must be an integer'),
    body('option').notEmpty().isIn(['actors', 'directors']).withMessage("option is required and in 'actors', 'directors'"),
];
