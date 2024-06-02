// file: validators/movieValidator.ts
import { query, body, param } from 'express-validator';

export const validateSearchMovies = [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('pageSize').optional().isInt({ min: 1 }).withMessage('Page size must be a positive integer'),
    query('search').optional().isString().withMessage('Search must be a string'),
    query('genre').optional().isString().withMessage('Genre must be a string'),
    query('nation').optional().isString().withMessage('Nation must be a string').isIn(['Trung Quốc', 'Việt Nam','Thái Lan','Hàn Quốc','Nhật Bản', 'Mỹ']).withMessage("Nation must be one of: 'Trung Quốc', 'Việt Nam','Thái Lan','Hàn Quốc','Nhật Bản', 'Mỹ'"),
    query('year').optional().isInt().withMessage('Year must be an integer'),
    query('isSeries').optional().isBoolean().withMessage('isSeries must be a boolean'),
    query('sort').optional().isIn(['highRated', 'newest', 'highFavorited']).withMessage('Sort must be one of: highRated, newest, highFavorited'),
    query('sortType').optional().isIn(['ASC', 'DESC']).withMessage('SortType must be one of: ASC, DESC'),
    query('level').optional().isIn([0, 1]).withMessage('level must be one of: 0, 1'),

];

export const validateGetMovieById = [
    // Validator cho trường 'id'
    param('id').notEmpty().withMessage('ID is required').isInt({min:1}).withMessage('ID must be an integer and min = 1'),
];

export const validateDeleteMovieById = [
    param('id').notEmpty().withMessage('ID is required').isInt({min:1}).withMessage('ID must be an integer and min = 1'),
];

export const validateCreateMovie = [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('releaseDate').isISO8601().withMessage('Release date must be a valid date'),
    body('nation').notEmpty().withMessage('Nation is required').isIn(['Trung Quốc', 'Việt Nam','Thái Lan','Hàn Quốc','Nhật Bản', 'Mỹ']).withMessage("Nation must be one of: 'Trung Quốc', 'Việt Nam','Thái Lan','Hàn Quốc','Nhật Bản', 'Mỹ'"),
    body('isSeries').isBoolean().withMessage('isSeries is must be boolean'),
    body('level').isInt().withMessage('Level must be an integer').isIn([1,0]),
];

export const validateUpdateMovie = [
    param('id').notEmpty().withMessage('ID is required').isInt({min:1}).withMessage('ID must be an integer and min = 1'),
    body('title').optional().isString().withMessage('Title must be a string'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('releaseDate').optional().isISO8601().withMessage('Release date must be a valid date'),
    body('nation').optional().isString().withMessage('Nation must be a string').isIn(['Trung Quốc', 'Việt Nam','Thái Lan','Hàn Quốc','Nhật Bản', 'Mỹ']).withMessage("Nation must be one of: 'Trung Quốc', 'Việt Nam','Thái Lan','Hàn Quốc','Nhật Bản', 'Mỹ'"),
    body('isSeries').optional().isBoolean().withMessage('isSeries is must be boolean'),
    body('level').optional().isInt().withMessage('Level must be an integer').isIn([0,1]),
    body('averageRating').optional().isFloat({min : 0.0}).withMessage('averageRating must be an float'),
    body('episode').optional().isInt().withMessage('Episode must be an integer'),
    body('numFavorite').optional().isInt({min : 0}).withMessage('numFavorite must be an integer'),
];

export const validategetPresignUrlToUpload = [
    query('movieId').notEmpty().withMessage('movieId is required').isInt({min:1}).withMessage('movieId must be an integer and min = 1'),
    query('option').notEmpty().isIn(['onlyTrailer', 'onlyPoster','onlyBackground','posterAndBackground','all']).withMessage('option is required and in onlyTrailer, onlyPoster,onlyBackground, all'),
];

export const validateClearCacheCloudFront = [
    body('movieId').notEmpty().withMessage('movieId is required').isInt({min:1}).withMessage('movieId must be an integer and min = 1'),
    body('option').notEmpty().isIn(['poster', 'background','trailer','all']).withMessage("option is required and in 'poster', 'background','trailer','all'"),
];

export const validateGetRelatedMovies = [
    query('movieId').notEmpty().withMessage('movieId is required').isInt({min:1}).withMessage('movieId must be an integer and min = 1'),
];