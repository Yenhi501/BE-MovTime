import { query, param, body } from 'express-validator';

export const validateGetPayments = [
    query('status').optional().isString().withMessage('Search must be a string'),
    query('type').optional().isString().withMessage('Search must be a string').isIn(['VN Pay', 'Paypal', 'Momo']).withMessage('SortType must be one of: VN Pay, Paypal, Momo'),
    query('userId').optional(). isInt({min:1}).withMessage('userId must be an integer and genreId >=1'),
    query('isPayment').optional(). isBoolean().withMessage('isPayment is must be boolean'),
    query('subscriptionInfoId').optional(). isInt({min:1}).withMessage('subscriptionInfoId must be an integer and genreId >=1'),
    query('startDate').optional().isISO8601().withMessage('Release date must be a valid date'),
    query('endDate').optional().isISO8601().withMessage('Release date must be a valid date'),
    query('search').optional().isString().withMessage('Search must be a string'),
    
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('pageSize').optional().isInt({ min: 1 }).withMessage('Page size must be a positive integer'),
];

export const validateCreatePaypalOrder = [
  body('subscriptionInfoId').notEmpty().withMessage('SubscriptionInfoId is required').isInt({ min: 1 }).withMessage('SubscriptionInfoId must be a positive integer'),
];

export const validateCancelPaypalOrder = [
  query('token').notEmpty().withMessage('Token is required'),
];

export const validateCapturePaypalOrder = [
  body('order_id').notEmpty().withMessage('Order_id is required'),
];