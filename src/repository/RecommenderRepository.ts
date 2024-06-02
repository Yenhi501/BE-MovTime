import { Movie } from '../models/Movie';
import { Genre } from '../models/Genre';
import Database from '../config/database';
import { Op, QueryTypes, literal, OrderItem, Sequelize } from 'sequelize';
import Container, { Service } from 'typedi';
import { BaseRepository } from './BaseRepository';
import { IRecommenderRepository } from './Interfaces/IRecommenderRepository';
import { WatchHistory } from '../models/WatchHistory';
import { WatchLater } from '../models/WatchLater';
import { MovieFavorite } from '../models/MovieFavorite';
import { MovieGenre } from '../models/MovieGenre';
import { User } from '../models/User';
import { Rating } from '../models/Rating';
import { Episode } from '../models/Episode';

const db = Database.getInstance();


@Service()
export class RecommenderRepository extends BaseRepository<Movie> implements IRecommenderRepository {
	
	constructor(){
		super(Movie);
	}

    /**
     * Get all movies and genres to calculate maxtrix
     * 
     * @returns Promise<Movie[]> 
     */
    async getAllMovie(): Promise<any> {
		try {
			const movies = await Movie.findAndCountAll({
				attributes: ['movie_id', 'title'],
				include:{
					model: Genre,
					through: { attributes: [] },
					attributes: ['genre_id', 'name'],
				},
				order: [['movie_id', 'ASC']],
			});
            
			return movies;
		} catch (error) {
			throw new Error('Could not get movies and genres');
		}
    }

	async getMovieGenre(): Promise<MovieGenre[]> {
		try {
			const movies = await MovieGenre.findAll({
				attributes: ['movie_id', 'genre_id'],
				order: [['movie_id', 'ASC']],
			});
            
			return movies;
		} catch (error) {
			throw new Error('Could not get movies and genres');
		}
	}

    /**
     * Get data movies of user include watching history, favorite, rating movie of user
     * 
     * @returns Promise<Movie[]> 
     */
    async getDataMoviesOfUser(userId: number): Promise<User|null> {
		try {
			const movies = await User.findByPk(userId, {
				attributes: {
					exclude: ['deletedAt', 'updatedAt', 'createdAt'],
				},
				include: [
					{
						model: Movie,
						attributes: ['movie_id'],
						as: 'ratings',
						through: { attributes: ['movie_id', 'rating'] },
					},
					{
						model: Episode,
						as: 'watchHistoryList',
						attributes: ['movie_id'],
						through: { attributes: [] },
					},
					{
						model: Movie,
						as: 'movieFavoriteList',
						attributes: ['movie_id'],
						through: { attributes: [] },
					},
				],
			});
			if(movies){
				return movies;
			}
			return null;
		} catch (error) {
			console.log("Err in Repo: ",error);
			
			throw new Error('Could not get movies and genres');
		}
    }

	async getMoviesRecommendByIds(movieIds: number[], page: number, pageSize: number): Promise<Movie[]> {
		try {
			const offset = (page - 1) * pageSize;
			const movies: Movie[] = await Movie.findAll({
				where: {
					movieId: {
					  [Op.in]: movieIds
					}
				  },
				  order: 
					[
					  Sequelize.literal(
						`CASE ${movieIds
						  .map((id, index) => `WHEN movie_id = ${id} THEN ${index}`)
						  .join(' ')}
						END`
					  )
					]
				  ,
			  limit: pageSize,
			  offset: offset
			});
		
			return movies;
		  } catch (error) {
			console.log(error);
			
			throw new Error('Could not get movies by movie IDs');
		  }
	}
}
