import { Service } from 'typedi';
import { BaseRepository } from './BaseRepository';
import { MovieFavorite } from '../models/MovieFavorite';
import { User } from '../models/User';
import { Movie } from '../models/Movie';
import { Genre } from '../models/Genre';
import { IMovieFavoriteRepository } from './Interfaces/IMovieFavoriteRepository';

@Service()
export class MovieFavoriteRepository
	extends BaseRepository<MovieFavorite>
	implements IMovieFavoriteRepository
{
	constructor() {
		super(MovieFavorite);
	}

	async findAll(userId: number) {
		try {
			const movieFavoriteList = await User.findOne({
				where: { userId: userId },
				attributes: ['userId'],
				include: [
					{
						model: Movie,
						as: 'movieFavoriteList',
						attributes: {
							exclude: ['createdAt', 'updatedAt', 'deletedAt'],
						},
						through: { attributes: ['updatedAt'] },
						include: [
							{
								model: Genre,
								attributes: ['genre_id', 'name'],
								as: 'genres',
								through: { attributes: [] },
							},
						],
					},
				],
			});

			return movieFavoriteList;
		} catch (error) {
			console.log(error);
			throw new Error('Cannot get all movie favorite');
		}
	}
}
