import { Movie } from '../../models/Movie';
import { Rating } from '../../models/Rating';
import { Reserve } from '../../models/Reserve';
import { User } from '../../models/User';
import { BaseInterface } from './BaseInterface';

export interface IReserveRepository extends BaseInterface {

    getReserveMovieOfUser(userId: number): Promise<Reserve[]>;
    getMoviesReserveOfUser(userId: number): Promise<Movie[]>;
    getReservesToSendMail(userId: number): Promise<Reserve[]>;
    getListMovieReserve(): Promise<Number[]>;
    addReserve(data: any): Promise<Reserve>;
}
