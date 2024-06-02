import { Movie } from '../../models/Movie';
import { MovieGenre } from '../../models/MovieGenre';
import { User } from '../../models/User';
import { BaseInterface } from './BaseInterface';
import { ISearchMovieOption } from './ISearchMovieOption';

export interface IRecommenderRepository extends BaseInterface {

	getAllMovie(): Promise<any>;
    getDataMoviesOfUser(userId: number): Promise<User|null>;
    getMovieGenre(): Promise<MovieGenre[]>;
    getMoviesRecommendByIds(movieIds: number[], page: number, pageSize: number): Promise<Movie[]>;
}
