import { MovieGenre } from '../../models/MovieGenre';
import { BaseInterface } from './BaseInterface';

export interface IMovieGenreRepository extends BaseInterface {
    addGenresForMovie(movieId: number, genreIds: number[]): Promise<MovieGenre[]>;
    deleteGenresOfMovie(movieId: number, genreIds: number[]): Promise<number>;
}
