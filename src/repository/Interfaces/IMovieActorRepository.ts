import { Actor } from '../../models/Actor';
import { MovieActor } from '../../models/MovieActor';
import { BaseInterface } from './BaseInterface';

export interface IMovieActorRepository extends BaseInterface {
    addActorsForMovie(movieId: number, actorIds: number[]): Promise<MovieActor[]>;
    deleteActorsOfMovie(movieId: number, actorIds: number[]): Promise<number>;
}
