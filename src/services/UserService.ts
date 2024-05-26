import { Movie } from './../models/Movie';
import { User } from '../models/User';
import Container, { Inject, Service } from 'typedi';
import { IUserRepository } from '../repository/Interfaces/IUserRepository';
import { UserDTO } from '../dto/UserDTO';
import { WatchHistoryRepository } from '../repository/WatchHistorRepository';
import { WatchLaterRepository } from '../repository/WatchLaterRepository';
import { MovieFavoriteRepository } from '../repository/MovieFavoriteRepository';
import { MovieFavorite } from '../models/MovieFavorite';
import { WatchHistory } from '../models/WatchHistory';
import { WatchLater } from '../models/WatchLater';
import { MovieDTO } from '../dto/MovieDTO';
import { S3Service } from './S3Service';
import express, { Request, Response } from 'express';
import { IMovieFavoriteRepository } from '../repository/Interfaces/IMovieFavoriteRepository';
import { IWatchHistoryRepository } from '../repository/Interfaces/IWatchHistorRepository';
import { IWatchLaterRepository } from '../repository/Interfaces/IWatchLaterRepository';
import { IUserService } from './Interfaces/IUserService';
import { IUserSearchOption } from './Interfaces/IUserSearchOption';
import { Op } from 'sequelize';
import { UserRepository } from '../repository/UserRepository';
import { ReserveRepository } from '../repository/ReserveRepository';
import { IReserveRepository } from '../repository/Interfaces/IReserveRepository';
import { Reserve } from '../models/Reserve';
import { ParsedQs } from 'qs';
import { ParamsDictionary } from 'express-serve-static-core';
import Mail from '../utils/Mail';
import { MovieRepository } from '../repository/MovieRepository';
import { IMovieRepository } from '../repository/Interfaces/IMovieRepository';
import { ContentNotFound, handleErrorFunction } from '../error/CustomErrors';

@Service()
export class UserService implements IUserService {
	@Inject(() => UserRepository)
	private userRepository!: IUserRepository;

	@Inject(() => MovieFavoriteRepository)
	private movieFavoriteRepository!: IMovieFavoriteRepository;

	@Inject(() => WatchHistoryRepository)
	private watchHistoryRepository!: IWatchHistoryRepository;

	@Inject(() => WatchLaterRepository)
	private watchLaterRepository!: IWatchLaterRepository;

	@Inject(() => S3Service)
	private s3Service!: S3Service;

	@Inject(() => ReserveRepository)
	private reserveRepository!: IReserveRepository;

	@Inject(() => MovieRepository)
	private movieRepository!: IMovieRepository;

	@Inject(() => Mail)
	private mail!: Mail;

	findOneUser = async (searchConditions: any): Promise<UserDTO> => {
		try {
			let userDTO = UserDTO.userToUserDTO(
				await this.userRepository.findOneUser(searchConditions)
			);
			if (userDTO!.avatarURL) {
				userDTO!.avatarURL = await this.s3Service.getObjectUrl(
					userDTO!.avatarURL
				);
			} else {
				userDTO!.avatarURL = await this.s3Service.getObjectUrl(
					'default/user/default_avatar.jpg'
				);
			}
			return userDTO;
		} catch (err: any) {
			throw new Error(err.message);
		}
	};

	searchUsers = async (
		options: IUserSearchOption,
		page: number,
		pageSize: number
	): Promise<{
		users: User[];
		count: number;
	}> => {
		try {
			const { search, gender, subscriptionType, sort, sortType } = options;
			const whereConditions: any = {};
			const whereSubTypeCons: any = {};

			if (search) {
				if (search) {
					whereConditions[Op.or] = [
						{ email: { [Op.like]: `%${search}%` } },
						{ '$account.username$': { [Op.like]: `%${search}%` } },
					];
				}
			}

			if (gender) {
				whereConditions['gender'] = gender;
			}

			if (subscriptionType) {
				const mapping: Record<string, number | number[]> = {
					'1': 1,
					'2': 2,
					'3': 3,
					'0': [2, 3],
				};

				whereSubTypeCons['subscription_type_id'] = mapping[subscriptionType];
			}

			const sortFieldMap = {
				createdAt: 'createdAt',
				subscriptionType: '$subscription.subscription_type_id',
			};

			let sortField = 'user_id';
			let sortBy = 'DESC';
			if (sort) {
				sortField = sortFieldMap[sort];
			}
			if (sortType) {
				sortBy = sortType || 'ASC';
			}

			return await this.userRepository.searchUsers(
				whereConditions,
				whereSubTypeCons,
				(page = page),
				(pageSize = pageSize),
				sortField,
				sortBy
			);
		} catch (err: any) {
			throw new Error(err.message);
		}
	};

	updateUser = async (userData: Partial<User>) => {
		try {
			const data = Object.fromEntries(
				Object.entries(userData).filter(([_, value]) => value !== undefined)
			);
			if (data.userId) {
				const userToUpdate = await this.userRepository.findById(data.userId);
				if (userToUpdate) {
					await userToUpdate.update(data);
					return await this.userRepository.save(userToUpdate);
				} else {
					throw new Error('User not found for the given ID');
				}
			}
		} catch (error: any) {
			throw new Error(error.message);
		}
	};

	deleteUser = async (userId: number) => {
		try {
			const user = await this.userRepository.findById(userId);
			if(!user){
				throw new ContentNotFound("User not found");
			}
			return await this.userRepository.delete(user, true);
		} catch (error: any) {
			handleErrorFunction(error);
		}
	};

	activeUser = async (userId: number) => {
		try {
			const user = await this.userRepository.findById(userId);
			if(!user){
				throw new ContentNotFound("User not found");
			}
			user.active= true;
			return await this.userRepository.save(user);
		} catch (error: any) {
			handleErrorFunction(error);
		}
	};

	findOneUserByEmail= async (email: string) => {
		try {
			return await this.userRepository.findOneUserByEmail(email);
		} catch (error: any) {
			throw new Error(error.message);
		}
	};

	saveMovieFavorite = async (userId: number, movieId: number) => {
		try {
			let movieFavorite = await this.movieFavoriteRepository.findOneByCondition(
				{
					user_id: userId,
					movie_id: movieId,
				}
			);

			if (movieFavorite != null && movieFavorite.deletedAt != null) {
				return await this.movieFavoriteRepository.restore(movieFavorite);
			} else if (movieFavorite != null && movieFavorite.deletedAt == null) {
				throw new Error('Dữ liệu đã tồn tại');
			}

			return await this.movieFavoriteRepository.save(
				MovieFavorite.build({ userId: userId, movieId: movieId })
			);
		} catch (error: any) {
			console.log(error);
			throw new Error(error.message);
		}
	};

	deleteMovieFavorite = async (userId: number, movieId: number) => {
		try {
			let movieFavorite = await this.movieFavoriteRepository.findOneByCondition(
				{
					user_id: userId,
					movie_id: movieId,
				}
			);
			return await this.movieFavoriteRepository.delete(movieFavorite);
		} catch (error: any) {
			console.log(error);
			throw new Error(error.message);
		}
	};

	findAllMovieFavorite = async (userId: number) => {
		try {
			const userMovie = await this.movieFavoriteRepository.findAll(userId);
			let movieFavoriteDTOlist = new MovieDTO(userMovie!, 'MovieFavorite');

			for (let favoriteMovie of movieFavoriteDTOlist.ListMovie || []) {
				favoriteMovie.posterURL = await this.s3Service.getObjectUrl(
					favoriteMovie.posterURL
				);
				favoriteMovie.backgroundMovieURL = await this.s3Service.getObjectUrl(
					'movies/'.concat(favoriteMovie.id.toString(), '/background.jpg')
				);
			}
			return movieFavoriteDTOlist;
		} catch (error: any) {
			throw new Error(error.message);
		}
	};

	saveWatchHistory = async (
		userId: number,
		episodeId: number,
		duration: number
	) => {
		try {
			let watchHistory = await this.watchHistoryRepository.findOneByCondition({
				user_id: userId,
				episode_id: episodeId,
			});
			if (watchHistory && watchHistory.deletedAt != null) {
				await this.watchHistoryRepository.restore(watchHistory);
				watchHistory.duration = duration;
				return await this.watchHistoryRepository.save(watchHistory);
			} else if (watchHistory && watchHistory.deletedAt == null) {
				watchHistory.duration = duration;
				return await this.watchHistoryRepository.save(watchHistory);
			}
			return await this.watchHistoryRepository.save(
				WatchHistory.build({
					userId: userId,
					episodeId: episodeId,
					duration: duration,
				})
			);
		} catch (error: any) {
			console.log(error);
			throw new Error(error.message);
		}
	};

	getWatchHistory = async (userId: number, episodeId: number) => {
		try {
			return await this.watchHistoryRepository.findOneByCondition({
				user_id: userId,
				episode_id: episodeId,
			});
		} catch (error: any) {
			console.log(error);
			throw new Error(error.message);
		}
	};

	deleteWatchHistory = async (userId: number, episodeId: number) => {
		try {
			let watchHistory = await this.watchHistoryRepository.findOneByCondition({
				user_id: userId,
				episode_id: episodeId,
			});
			return await this.watchHistoryRepository.delete(watchHistory);
		} catch (error: any) {
			console.log(error);
			throw new Error(error.message);
		}
	};

	findAllWatchHistory = async (userId: number) => {
		try {
			let userMovie = await this.watchHistoryRepository.findAll(userId);
			let watchHistoryDTOList = new MovieDTO(userMovie!, 'WatchHistory');

			for (let history of watchHistoryDTOList.ListMovie || []) {
				history.posterURL = await this.s3Service.getObjectUrl(
					history.posterURL
				);
				history.posterMovieURL = await this.s3Service.getObjectUrl(
					history.posterMovieURL
				);
				history.backgroundMovieURL = await this.s3Service.getObjectUrl(
					'movies/'.concat(history.movieId.toString(), '/background.jpg')
				);
			}
			return watchHistoryDTOList;
		} catch (error: any) {
			throw new Error(error.message);
		}
	};

	saveWatchLater = async (userId: number, movieId: number) => {
		try {
			let watchLater = await this.watchLaterRepository.findOneByCondition({
				user_id: userId,
				movie_id: movieId,
			});
			if (watchLater != null && watchLater.deletedAt != null) {
				return await this.movieFavoriteRepository.restore(watchLater);
			} else if (watchLater != null && watchLater.deletedAt == null) {
				throw new Error('Dữ liệu đã tồn tại');
			}
			return await this.watchLaterRepository.save(
				WatchLater.build({ userId: userId, movieId: movieId })
			);
		} catch (error: any) {
			console.log(error);
			throw new Error(error.message);
		}
	};

	deleteWatchLater = async (userId: number, movieId: number) => {
		try {
			let watchLater = await this.watchLaterRepository.findOneByCondition({
				user_id: userId,
				movie_id: movieId,
			});
			return await this.watchLaterRepository.delete(watchLater);
		} catch (error: any) {
			console.log(error);
			throw new Error(error.message);
		}
	};

	findAllWatchLater = async (userId: number) => {
		try {
			let userMovie = await this.watchLaterRepository.findAll(userId);
			let watchLaterDTOList = new MovieDTO(userMovie!, 'WatchLater');

			for (let watchLaterMovie of watchLaterDTOList.ListMovie || []) {
				watchLaterMovie.posterURL = await this.s3Service.getObjectUrl(
					watchLaterMovie.posterURL
				);
				watchLaterMovie.backgroundMovieURL = await this.s3Service.getObjectUrl(
					'movies/'.concat(watchLaterMovie.id.toString(), '/background.jpg')
				);
			}
			return watchLaterDTOList;
		} catch (error: any) {
			throw new Error(error.message);
		}
	};

	async getPresignUrlToUploadAvatar(userId: number): Promise<string> {
		try {
			const data: Partial<User> = {};
			data.userId = userId;
			data.avatarURL = 'users/' + userId + '/avatar.jpg';
			await this.updateUser(data);
			return await this.s3Service.generatePresignedUrlUpdate(
				data.avatarURL,
				'image/jpeg'
			);
		} catch (error) {
			throw error;
		}
	}

	async getReserveMovieOfUser(userId: number): Promise<Reserve[]> {
		try {
			return this.reserveRepository.getReserveMovieOfUser(userId);
		} catch (error) {
			throw(error);
		}
	}

	async getMoviesReserveOfUser(userId: number): Promise<Movie[]> {
		try {
			const movies =await this.reserveRepository.getMoviesReserveOfUser(userId);
			for (const movie of movies) {
				movie.posterURL = await this.s3Service.getObjectUrl(movie.posterURL);
				movie.trailerURL = await this.s3Service.getObjectUrl(movie.trailerURL);
				movie.backgroundURL = await this.s3Service.getObjectUrl(
					'movies/'.concat(movie.movieId.toString(), '/background.jpg')
				);
			}
			return movies;
		} catch (error) {
			throw(error);
		}
	}
	
	async addReserve(req: express.Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<Reserve> {
		try {
			const userId = req.payload.userId;
			const movieId = req.body.movieId;
			const reserved = await this.reserveRepository.findOneByCondition({
				userId,movieId
			});
			if(reserved){
				return reserved;
			}
			return await this.reserveRepository.addReserve({
				userId, movieId
			});
		} catch (error) {
			throw(error);
		}
	}

	async deleteReserve(req: express.Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<void> {
		try {
			const userId = req.payload.userId;
			const movieId = req.params.movieId;
			const reserve = await this.reserveRepository.findOneByCondition({movieId, userId});
			if(reserve){
				return await this.reserveRepository.delete(reserve,true);
			}
		} catch (error) {
			throw(error);
		}
	}
	async sendMailForReserveMovie(): Promise<any> {
		try {
			const movieIdList = await this.reserveRepository.getListMovieReserve();
			for (let i = 0; i < movieIdList.length; i++) {
    			const movieId = movieIdList[i];
  				const reverseList = await this.reserveRepository.findByCondition({movieId:movieId})	
				let movie = await this.movieRepository.findById(Number(movieId));
				movie.posterURL = await this.s3Service.getObjectUrl(movie.posterURL);
				for (const reserve of reverseList) {
					const user = await this.findOneUser({userId:reserve.userId})
					await this.mail.reserveMovie(user.username,user.email,movie)
					await this.reserveRepository.delete(reserve,true)
				}
			}
		} catch (error) {	
			throw(error);
		}
	}

		async clearCacheCloudFrontAvatarUser(req: Request) :Promise<void>
	{
		try {
			const userId = req.payload.userId;

			const avatarURL = 'users/' + userId + '/avatar.jpg';
			return await this.s3Service.clearCacheCloudFront(avatarURL);
		} catch (error) {
			throw(error);
		}
	}

	async removeAvatar (userId: number): Promise<void>
	{
		try {
			const avatarURL = 'users/' + userId + '/avatar.jpg';
			// const data: Partial<User> = {
			// 	avatarURL: undefined,
			// };
			// await this.updateUser(data);
			await  this.s3Service.deleteObject(avatarURL);
		} catch (error) {
			throw(error);
		}
	}

	async findOneWatchingHistory(userId: number, episodeId: number)
	{
		try {
			const data = await this.watchHistoryRepository.findOneByEpisode(userId,episodeId);
			return data;
		} catch (error) {
			throw(error);
		}
	}

}
