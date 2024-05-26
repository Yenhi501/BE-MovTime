import { MovieDTO } from '../../dto/MovieDTO';
import { UserDTO } from '../../dto/UserDTO';
import { Movie } from '../../models/Movie';
import { MovieFavorite } from '../../models/MovieFavorite';
import { Reserve } from '../../models/Reserve';
import { User } from '../../models/User';
import { WatchHistory } from '../../models/WatchHistory';
import { WatchLater } from '../../models/WatchLater';
import express, { Request, Response, Router } from 'express';

export interface IUserService {
	findOneUser: (searchConditions: any) => Promise<UserDTO>;
	searchUsers: (
		searchConditions: any,
		page: number,
		pageSize: number
	) => Promise<{ users: User[]; count: number }>;
	updateUser: (userData: Partial<User>) => Promise<void>;
	deleteUser: (userId: number) => Promise<void>;
	activeUser: (userId: number) => Promise<void>;
	findOneUserByEmail: (email: string) => Promise<User | undefined>;
	saveMovieFavorite: (userId: number, movieId: number) => Promise<void>;
	deleteMovieFavorite: (userId: number, movieId: number) => Promise<void>;
	findAllMovieFavorite: (userId: number) => Promise<MovieDTO>;
	saveWatchHistory: (
		userId: number,
		episodeId: number,
		duration: number
	) => Promise<void>;
	getWatchHistory: (
		userId: number,
		episodeId: number
	) => Promise<WatchHistory | null>;
	deleteWatchHistory: (userId: number, episodeId: number) => Promise<void>;
	findAllWatchHistory: (userId: number) => Promise<MovieDTO>;
	saveWatchLater: (userId: number, movieId: number) => Promise<void>;
	deleteWatchLater: (userId: number, movieId: number) => Promise<void>;
	findAllWatchLater: (userId: number) => Promise<MovieDTO>;
	getPresignUrlToUploadAvatar: (userId: number) => Promise<string>;
	sendMailForReserveMovie(): Promise<any>
	getReserveMovieOfUser(userId: number): Promise<Reserve[]>;
	getMoviesReserveOfUser(userId: number): Promise<Movie[]>;
    addReserve(req: Request): Promise<Reserve>;
	deleteReserve(req: Request): Promise<void>;
	clearCacheCloudFrontAvatarUser(req: Request) :Promise<void>;
	removeAvatar: (userId: number) => Promise<void>;
	findOneWatchingHistory: (userId: number, episodeId: number) => Promise<WatchHistory| null>;
}
