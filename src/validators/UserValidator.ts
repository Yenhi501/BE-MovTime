import {
	body,
	query,
} from 'express-validator';

export const validateGetUser = [
  query('username').optional().isString().withMessage('Username must be a string'),
  query('email').optional().isEmail().withMessage('email must be a correct format '),
  query('pageSize').optional().isInt({ min: 1 }).withMessage('PageSize must be a positive integer'),
];

export const validateUpdateSelfInfo = [
	body('dateOfBirth')
		.optional()
		.isISO8601()
		.withMessage('Date of birth must be a valid date'),
	body('gender')
		.optional()
		.isIn(['Male', 'Female', 'Other'])
		.withMessage('Gender must be Male, Female, or Other'),
];

export const validateSearchUsers = [
	query('search').optional().isString().withMessage('Search must be a string'),
	query('gender')
		.optional()
		.isIn(['Male', 'Female', 'Other'])
		.withMessage('Gender must be Male, Female, or Other'),
	query('subscriptionType')
		.optional()
		.isInt({min:0})
		.withMessage('Subscription type must be a integer '),
	query('sort').optional().isString().withMessage('Sort must be a string'),
	query('sortType')
		.optional()
		.isString()
		.withMessage('Sort type must be a string'),
	query('page').optional().isInt({min:1}).withMessage('Page must be an integer'),
	query('pageSize')
		.optional()
		.isInt({min:1})
		.withMessage('Page size must be an integer'),
];

export const validateUpdateUser = [
	body('userId').isInt({min:1}).withMessage('User ID must be an integer'),
	body('email').optional().isEmail().withMessage('Invalid email format'),
	body('dateOfBirth')
		.optional()
		.isISO8601()
		.withMessage('Date of birth must be a valid date'),
	body('gender')
		.optional()
		.isIn(['Male', 'Female', 'Other'])
		.withMessage('Gender must be Male, Female, or Other'),
];

export const validateCreateUser = [
	body('email').notEmpty().withMessage("Email is required").isEmail().withMessage('Invalid email format'),
	body('dateOfBirth').notEmpty().withMessage("Date Of birth is required")
		.isISO8601()
		.withMessage('Date of birth must be a valid date'),
	body('gender').notEmpty().withMessage("Gender is required")
		.isIn(['Male', 'Female', 'Other'])
		.withMessage('Gender must be Male, Female, or Other'),
	body('username').notEmpty().withMessage("Username is required").isString().withMessage('Username must be a string'),
	body('password').notEmpty().withMessage("Password is required").isString().withMessage('Password must be a string'),
];

export const validateDeleteUser = [
	query('userId').notEmpty().withMessage("User Id is required").isInt({min:1}).withMessage('User ID must be an integer'),
];


export const favoriteMovie = [
	query('movieId').notEmpty().withMessage("Movie Id is required").isInt({min:1}).withMessage('Movie ID must be an integer'),
];

export const addMovieHistory = [
	query('episodeId').notEmpty().withMessage("Episode Id is required").isInt({min:1}).withMessage('Movie ID must be an integer'),
	query('duration').notEmpty().withMessage("Duration Id  required").isInt({min:1}).withMessage('Duration must be an integer'),
];

export const deleteMovieHistory = [
	query('episodeId').notEmpty().withMessage("Episode Id is required").isInt({min:1}).withMessage('Movie ID must be an integer'),
];


export const watchLater = [
	query('movieId').notEmpty().withMessage("Movie Id is required").isInt({min:1}).withMessage('Movie ID must be an integer'),
];

