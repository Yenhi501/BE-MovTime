import { MovieDirector } from '../../models/MovieDirector';
import { BaseInterface } from './BaseInterface';

export interface IMovieDirectorRepository extends BaseInterface {
    addDirectorsForMovie(movieId: number, directorIds: number[]): Promise<MovieDirector[]>;
    deleteDirectorsOfMovie(movieId: number, directorIds: number[]): Promise<number>;
}
