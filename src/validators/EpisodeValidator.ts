// file: validators/movieValidator.ts
import { query, param, validationResult, body } from 'express-validator';

export const validateGetEpisodeById = [
// Validator cho trường 'id'
    param('id').notEmpty().withMessage('ID is required').isInt({min:1}).withMessage('ID must be an integer'),
];

export const validateDeleteEpisodeById = [
    param('episodeId').notEmpty().withMessage('ID is required').isInt({min:1}).withMessage('ID must be an integer'),
];

export const validateUpdateEpisode = [
    param('episodeId').notEmpty().withMessage('episodeId is required').isInt({min:1}).withMessage('ID must be an integer'),
    body('movieId').optional().isInt({min:1}).withMessage('ID must be an integer and min = 1'),
    body('title').optional().isString().withMessage('Title must be a string'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('releaseDate').optional().isISO8601().withMessage('Release date must be a valid date'),
    body('posterURL').optional().isString().withMessage('Poster URL must be a string'),
    body('movieURL').optional().isString().withMessage('Movie URL must be a string'),
    body('numView').optional().isInt({min:0}).withMessage('Number of views must be an integer'),
    body('duration').optional().isInt({min:0}).withMessage('Duration must be an integer'),
    body('episodeNo').optional().isInt({min:1}).withMessage('Episode number must be an integer'),
]

export const validateCreateEpisode = [
    body('movieId').notEmpty().isInt({min:1}).withMessage('Movie ID is required and must be an integer'),
    body('title').notEmpty().withMessage('Title is required').isString().withMessage('Title must be a string'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('releaseDate').notEmpty().isISO8601().withMessage('Release date is required and must be a valid ISO8601 date'),
]

export const validateGetPresignURL = [
    query('movieId').notEmpty().isInt({min:1}).withMessage('Movie ID is required and must be an integer'),
    query('episodeNo').notEmpty().isInt({min:1}).withMessage('episodeNo is required and must be an integer'),
    query('option').notEmpty().isIn(['onlyMovie', 'onlyPoster','movieAndPoster']).withMessage('option is required and in onlyMovie, onlyPoster, movieAndPoster'),

];

export const validateGetQuality = [
    param('episodeId').notEmpty().isInt({min:1}).withMessage('episodeId is required and must be an integer'),
    query('quality').notEmpty().isString().withMessage('quality is must be an string').isIn(['4k', '1080p', '720p']).withMessage('quality must be one of: 4k, 1080p, 720p'),

];

export const validateClearCloudFront = [
    body('movieId').notEmpty().isInt({min:1}).withMessage('Movie ID is required and must be an integer'),
    body('episodeNum').notEmpty().isInt({min:1}).withMessage('episodeNum is required and must be an integer'),
    body('quality').notEmpty().isIn(['720p', '1080p','4k']).withMessage("option is required and in '720p', '1080p','4k'"),
]

export const validateGetPresignURLQuality = [
    query('movieId').notEmpty().isInt({min:1}).withMessage('Movie ID is required and must be an integer'),
    query('episodeNo').notEmpty().isInt({min:1}).withMessage('episodeNo is required and must be an integer'),
    query('quality').notEmpty().isIn(['1080p', '4k','720p']).withMessage('option is required and in 720p, 1080p or 4k'),
];