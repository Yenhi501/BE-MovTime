import { body, query } from 'express-validator';

export const validateUpdateSubscription = [
  body('subscriptionTypeId').optional().isInt({ min: 1 }).withMessage('SubscriptionTypeId must be a positive integer'),
  body('userId').optional().isInt({ min: 1 }).withMessage('UserId must be a positive integer'),
  body('closeAt').optional().isISO8601().toDate().withMessage('CloseAt must be a valid date in ISO8601 format'),
  body('subscriptionInfoId').optional().isInt({ min: 1 }).withMessage('SubscriptionInfoId must be a positive integer'),
];

export const validateCreateSubscriptionType = [
  body('name').notEmpty().withMessage('Name is required'),
  body('price').notEmpty().withMessage('Price is required').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
];

export const validateUpdateSubscriptionType = [
  body('name').notEmpty().withMessage('Name is required'),
  body('price').notEmpty().withMessage('Price is required').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('subscriptionTypeId').notEmpty().withMessage('SubscriptionTypeId is required').isInt({ min: 1 }).withMessage('SubscriptionTypeId must be a positive integer'),
];

export const validateDeleteSubscriptionType = [
  query('subscriptionTypeId').notEmpty().withMessage('SubscriptionTypeId is required').isInt({ min: 1 }).withMessage('SubscriptionTypeId must be a positive integer'),
];

export const validateCreateSubscriptionInfo = [
  body('subscriptionTypeId').notEmpty().withMessage('SubscriptionTypeId is required').isInt({ min: 1 }).withMessage('SubscriptionTypeId must be a positive integer'),
  body('durationId').notEmpty().withMessage('DurationId is required').isInt({ min: 1 }).withMessage('DurationId must be a positive integer'),
  body('discount').notEmpty().withMessage('Discount is required').isFloat({ min: 0 }).withMessage('Discount must be a non-negative number'),
];

export const validateUpdateSubscriptionInfo = [
  body('subscriptionTypeId').optional().isInt({ min: 1 }).withMessage('SubscriptionTypeId must be a positive integer'),
  body('durationId').optional().isInt({ min: 1 }).withMessage('DurationId must be a positive integer'),
  body('discount').optional().isFloat({ min: 0 }).withMessage('Discount must be a non-negative number'),
  body('subscriptionInfoId').notEmpty().withMessage('SubscriptionInfoId is required').isInt({ min: 1 }).withMessage('SubscriptionInfoId must be a positive integer'),
];

export const validateDeleteSubscriptionInfo = [
  query('subscriptionInfoId').notEmpty().withMessage('SubscriptionInfoId is required').isInt({ min: 1 }).withMessage('SubscriptionInfoId must be a positive integer'),
];
