import { query, param, body } from 'express-validator';

export const validateDeleteActor = [
    param('actorId').notEmpty().withMessage('actorId is required').isInt({min:1}).withMessage('actorId must be an integer'),
];

export const validateGetActorDetails = [
    param('actorId').notEmpty().withMessage('actorId is required').isInt({min:1}).withMessage('actorId must be an integer'),
];

export const validateGetActors = [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('pageSize').optional().isInt({ min: 1 }).withMessage('Page size must be a positive integer'),
    query('name').optional().isString().withMessage('Search must be a string'),
];

export const validateUpdateActor = [
    param('actorId').notEmpty().withMessage('actorId is required').isInt({min:1}).withMessage('actorId must be an integer'),
    body('name').optional().isString().withMessage('name of actor must be a string'),
    body('gender').optional().isIn(['Male', 'Female','Other']).withMessage('option is required and in Male, Female, Other'),
    body('dateOfBirth').optional().isISO8601().withMessage('dateOfBirth must be a valid date'),
    body('description').optional().isString().withMessage('description must be a string'),
];

export const validateCreateActor = [
    body('name').notEmpty().withMessage('name of actor is required').isString().withMessage('name of actor must be a string'),
    body('gender').optional().isIn(['Male', 'Female','Other']).withMessage('option is required and in Male, Female, Other'),
    body('dateOfBirth').optional().isISO8601().withMessage('dateOfBirth must be a valid date'),
    body('description').optional().isString().withMessage('description must be a string'),
];

export const validateGetPresignUrlActor = [
    query('actorId').notEmpty().withMessage('actorId is required').isInt({min:1}).withMessage('actorId must be an integer'),
];
