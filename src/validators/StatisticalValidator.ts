import { query, body, param } from 'express-validator';

export const validateStatistical = [
    query('userId').optional().isInt({ min: 1 }).withMessage('userId must be a positive integer and min = 1'),
    query('startDate').optional().isString().withMessage('startDate must be a string').isISO8601().withMessage('startDate date must be a valid date'),
    query('endDate').optional().isString().withMessage('endDate must be a string').isISO8601().withMessage('endDate date must be a valid date'),
    query('statisBy').optional().isString().withMessage('statisBy must be a string').isIn(['year','month','week','day', 'paymentType']).withMessage('statisBy must be one of: year, month, week, day, paymentType'),
];

export const validateStatisticalComments = [
    query('startDate').optional().isString().withMessage('startDate must be a string').isISO8601().withMessage('startDate date must be a valid date'),
    query('endDate').optional().isString().withMessage('endDate must be a string').isISO8601().withMessage('endDate date must be a valid date'),
];