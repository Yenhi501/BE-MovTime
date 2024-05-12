import { Movie } from '../../models/Movie';
import { BaseInterface } from './BaseInterface';

export interface IMovieRepository extends BaseInterface {
	searchMovies(	
		whereCondition: any,
		whereConditionGenre: any,
		page: number,
		pageSize: number,
		sortField: string,
		sortBy: string
	): Promise<{
		movies: Movie[];
		totalCount: number;
	  }>;
	getMovieById(id: number): Promise<Movie | null>;
	getAllMovies(): Promise<Movie[]>;
	deleteMovieById(id: number): Promise<void>;
	createMovie(
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
	): Promise<Movie>;
	updateMovie(movieId: number, updatedData: Partial<Movie>): Promise<[number, Movie[]]>;
	getMoviesTrending(): Promise<Movie[]>;
	getMoviesRecommender(): Promise<Movie[]>;
	getMoviesUpcoming(): Promise<Movie[]>;
	getMoviesForVip(): Promise<Movie[]>;
	getAllNations(): Promise<string[]>;
	getAllReleaseDates(): Promise<number[]>;
}
