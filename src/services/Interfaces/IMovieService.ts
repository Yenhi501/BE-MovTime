import { Movie } from '../../models/Movie';
import express, { Request, Response, Router } from 'express';
import { MovieDirector } from '../../models/MovieDirector';
import { MovieGenre } from '../../models/MovieGenre';

export interface IMovieService {
	searchMovies(
		searchConditions: any,
		page: number,
		pageSize: number
	): Promise<{
		movies: Movie[];
		totalCount: number;
	  }>;
	getMovieById(id: number): Promise<Movie | null>;
	getAllMovies(): Promise<Movie[]>;
	deleteMovieById(id: number): Promise<void>;
	createMovie(req: Request): Promise<Movie>;
	updateMovie(req: Request, res: Response): Promise<Movie | null>;
	getMoviesTrending(): Promise<Movie[]>;
	getMoviesRecommender(): Promise<Movie[]>;
	getMoviesUpcoming(): Promise<Movie[]>;
	getMoviesForVip(): Promise<Movie[]>;
	getAllNations(): Promise<string[]>;
	getAllReleaseYears(): Promise<number[]>;
	getPresignUrlToUploadMovie(idMovie: number, option: string): Promise<{ key: string, value: string }[]>;
	
	addActorForMovie(req: Request): Promise<MovieActor[]>;
	deleteActorOfMovie(req: Request): Promise<number>;

	addDirectorsForMovie(req: Request): Promise<MovieDirector[]>;
	deleteDirectorsOfMovie(req: Request): Promise<number>;

	addGenresForMovie(req: Request): Promise<MovieGenre[]>;
	deleteGenresOfMovie(req: Request): Promise<number>;

	clearCacheCloudFrontMovie(req: Request) :Promise<void>;
}
