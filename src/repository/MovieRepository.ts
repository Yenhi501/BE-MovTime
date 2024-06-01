import { Movie } from '../models/Movie';
import { Genre } from '../models/Genre';
import { MovieGenre } from '../models/MovieGenre';
import { IMovieRepository } from './Interfaces/IMovieRepository';
import Database from '../config/database';
import { Op, QueryTypes, literal, OrderItem, Sequelize } from 'sequelize';
import { Actor } from '../models/Actor';
import { Director } from '../models/Director';
import { Episode } from '../models/Episode';
import Container, { Service } from 'typedi';
// import { ISearchMovieOption } from './Interfaces/ISearchMovieOption';
import { BaseRepository } from './BaseRepository';

const db = Database.getInstance();


@Service()
export class MovieRepository extends BaseRepository<Movie> implements IMovieRepository {
	
	constructor(){
		super(Movie);
	}
	updateMovie(movieId: number, updatedData: Partial<Movie>): Promise<[number, Movie[]]> {
		throw new Error('Method not implemented.');
	}
	getMoviesTrending(): Promise<Movie[]> {
		throw new Error('Method not implemented.');
	}
	getMoviesRecommender(): Promise<Movie[]> {
		throw new Error('Method not implemented.');
	}
	getMoviesUpcoming(): Promise<Movie[]> {
		throw new Error('Method not implemented.');
	}
	getMoviesForVip(): Promise<Movie[]> {
		throw new Error('Method not implemented.');
	}
	getAllNations(): Promise<string[]> {
		throw new Error('Method not implemented.');
	}
	getAllReleaseDates(): Promise<number[]> {
		throw new Error('Method not implemented.');
	}

	async searchMovies(whereCondition: any, whereConditionGenre: any, page: number, pageSize: number, sortField: string, sortBy: string) {
	
		const offset = (page - 1) * pageSize;
	  
		const movies = await Movie.findAll({
		   attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] },
		  where: whereCondition,
			// where :
		  include: [
			{
				model: Genre,
				attributes: ['genre_id', 'name'],
				as: 'genres',
				required: true,
				...(Object.keys(whereConditionGenre).length > 0 ? { where: whereConditionGenre } : {}),
				through: { attributes: [] },
			},
			// {
			// 	model: Actor,
			// 	attributes: ['actor_id', 'name'],
			// 	through: { attributes: [] },
			// 	// where: { name: { [Op.iLike]: search } },
			// },
			{
				model: Director,
				attributes: ['director_id', 'name'],
				through: { attributes: [] },
			},

		  ],
		  order:[
			[`${sortField}`,`${sortBy}`]
		  ],
		  limit: pageSize, // Số lượng kết quả trên mỗi trang
		  offset: offset, // Vị trí bắt đầu
		});
		    // Truy vấn lấy tổng số phim
		const { count, rows } = await Movie.findAndCountAll({
			where: whereCondition,
			include: [
				{
					model: Genre,
					attributes: ['genre_id', 'name'],
					as: 'genres',
					required: true,
					...(Object.keys(whereConditionGenre).length > 0 ? { where: whereConditionGenre } : {}),
					through: { attributes: [] },
				},
			]
		});
		  
		return {
			movies,
			totalCount:rows.length,
		  };
	  }

	/**
	 * Get movie by id_movie
	 * @param id 
	 * @returns Promise<Movie | null>
	 */
	async getMovieById(id: number): Promise<Movie | null> {
		try {
			const movie = await Movie.findByPk(id, {
				attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] },
				include: [
					{
						model: Genre,
						attributes: ['genre_id', 'name'],
						as: 'genres',
						through: { attributes: [] },
					},
					// {
					// 	model: Actor,
					// 	attributes: ['actor_id', 'name', 'avatar'],
					// 	through: { attributes: [] },
					// },
					{
						model: Director,
						attributes: ['director_id', 'name', 'avatar'],
						through: { attributes: [] },
					},
					// {
					// 	model: Episode,
					// 	attributes: ['episode_id', 'movie_id', 'poster_url', 'title', 'release_date', 'num_view', 'duration', 'episode_no'],
					// 	order: [
					// 		// We start the order array with the model we want to sort
					// 		[Episode, 'episode_id', 'ASC']
					// 	]
					// },
		
				  ],
			});

			return movie || null;
		} catch (error: any) {
			throw new Error('Can not get movie: ' + error.message);
		}
	}

	async getAllMovies(): Promise<Movie[]> {
		try {
			const movies = await Movie.findAll({
				attributes: {
					exclude: ['deletedAt', 'updatedAt', 'createdAt'],
				},
				include: [
					{
						model: Genre,
						attributes: {
							exclude: ['deletedAt', 'updatedAt', 'createdAt'],
						},
						through: { attributes: [] },
					},
					// {
					// 	model: Actor,
					// 	attributes: {
					// 		exclude: ['deletedAt', 'updatedAt', 'createdAt'],
					// 	},
					// 	through: { attributes: [] },
					// },
					{
						model: Director,
						attributes: {
							exclude: ['deletedAt', 'updatedAt', 'createdAt'],
						},
						through: { attributes: [] },
					},
				],
				order: [['movie_id', 'ASC']],
			});
			return movies;
		} catch (error) {
			throw new Error('Could not fetch movies');
		}
	}

	/**
	 * Delete Movie By ID
	 */
	async deleteMovieById(id: number): Promise<void> {
		try {
			const movieToDelete = await Movie.destroy({
				where: {
					movie_id: id,
				},
			});
		} catch (error) {
			throw new Error('Could not delete movie');
		}
	}

	/**
	 * Create Movie
	 */
	async createMovie(
		title: string,
		description: string,
		releaseDate: Date,
		nation: string,
		posterURL: string,
		trailerURL: string,
		averageRating: number,
		episodeNum: number,
		level: number,
		backgroundURL: string,
		isSeries: boolean
	): Promise<Movie> {
		try {
			const newMovie = await Movie.create({
				title: title,
				description: description,
				releaseDate: releaseDate,
				nation: nation,
				posterURL: posterURL,
				trailerURL: trailerURL,
				backgroundURL: backgroundURL,
				averageRating: averageRating,
				episodeNum: episodeNum,
				level: level,
				numFavorite: 0,
				isSeries: isSeries,
			});
			const formattedPosterURL = `movies/${newMovie.movieId}/poster.jpg`;
			const formattedTrailerURL = `movies/${newMovie.movieId}/trailer.mp4`;
			const formattedBackgroundURL = `movies/${newMovie.movieId}/background.jpg`;

			await newMovie.update({
			  posterURL: formattedPosterURL,
			  trailerURL: formattedTrailerURL,
			  backgroundURL:formattedBackgroundURL,
			});
			return newMovie;
		} catch (error) {
			throw new Error('Could not create movie');
		}
	}

	/**
	 * Get movies trending
	 * 
// 	 */
// 	async getMoviesTrending(): Promise<Movie[]> {
// 		const numLimit = 15;
		
// 		const movies = await Movie.findAll({
// 			attributes: {
// 			  exclude: ['deletedAt', 'createdAt', 'updatedAt'],
// 			},
// 			order: [
// 				[Sequelize.col('num_favorite'), 'DESC'], // First sorting condition
// 				[Sequelize.col('average_rating'), 'DESC'], // Second sorting condition
// 			  ],
// 			limit: numLimit
// 		  });
		
// 		return movies;
// 	}

// 	/**
// 	 * Get movies recommender for user
// 	 * 
// 	 */
// 	async getMoviesRecommender(): Promise<Movie[]> {
// 		const numLimit = 15;
		
// 		const movies = await Movie.findAll({
// 			attributes: {
// 			  exclude: ['deletedAt', 'createdAt', 'updatedAt'],
// 			},
// 			order: [
// 				[Sequelize.col('num_favorite'), 'DESC'], // First sorting condition
// 				[Sequelize.col('average_rating'), 'DESC'], // Second sorting condition
// 			  ],
// 			limit: numLimit
// 		  });
		
// 		return movies;
// 	}

// 	/**
// 	 * Get movies upcoming
// 	 * 
// 	 */
// 	async getMoviesUpcoming(): Promise<Movie[]> {
// 		const numLimit = 15;
// 		const startDate = new Date(); // Current date
// 		startDate.setHours(23, 59, 59, 999);
// 		const endDate = new Date();
// 		endDate.setMonth(endDate.getMonth() + 12); // One month ago
// 		const movies = await Movie.findAll({
// 			attributes: {
// 			  exclude: ['deletedAt', 'createdAt', 'updatedAt'],
// 			},
// 			where: {
// 				release_date: {
// 				  [Op.gt]: startDate,
// 				},
// 			},
// 			order: [
// 				[Sequelize.col('release_date'), 'ASC'], // First sorting condition
// 			  ],
// 			limit: numLimit
// 		  });
// 		return movies;
// 	}

// 	/**
// 	 * Get movies for VIP privileges
// 	 * 
// 	 */
// 	async getMoviesForVip(): Promise<Movie[]> {
// 		const numLimit = 15;
		
// 		const movies = await Movie.findAll({
// 			attributes: {
// 			  exclude: ['deletedAt', 'createdAt', 'updatedAt'],
// 			},
// 			where: {
// 				level: {
// 				  [Op.gte]: 1,
// 				},
// 			},
// 			order: [
// 				[Sequelize.col('num_favorite'), 'DESC'], // First sorting condition
// 				[Sequelize.col('average_rating'), 'DESC'], // Second sorting condition
// 			  ],
// 			limit: numLimit
// 		  });
		
// 		return movies;
// 	}

// 	async updateMovie(movieId: number, updatedData: Partial<Movie>): Promise<[number, Movie[]]> {
// 		try {
// 			const [rowsAffected, updatedMovies] = await Movie.update(updatedData, {
// 				where: { movieId },
// 				returning: true, // Return the updated records
// 			  });
// 			return [rowsAffected, updatedMovies];
// 		} catch (error: any) {
// 			throw new Error('Update failed: ' + error.message);
// 		}
// 	}

// 	async getAllNations(): Promise<string[]> {
// 		try {
// 			const nations: { DISTINCT: string }[] = await Movie.aggregate('nation', 'DISTINCT', { plain: false }) as any;
// 			const nationNames: string[] = nations.map((nation) => nation.DISTINCT);
// 			return nationNames;
// 		  } catch (error) {
// 			throw new Error('Could not get all nations');
// 		  }
// 	}

// 	async getAllReleaseDates(): Promise<number[]> {
// 		try {
// 			const releaseYears: any = await Movie.findAll({
// 			  attributes: [
// 				[Sequelize.fn('DISTINCT', Sequelize.fn('extract', Sequelize.literal('YEAR FROM "release_date"'))), 'releaseYear']
// 			  ],
// 			  raw: true, // Chỉ trả về dữ liệu chưa được làm phẳng, không tạo instances của model
// 			});
		
// 			return releaseYears.map((yearObj: { releaseYear: number }) => yearObj.releaseYear);
// 		  } catch (error) {
// 			console.log(error);
			
// 			throw new Error('Could not get all release years');
// 		  }
// 	}
}


