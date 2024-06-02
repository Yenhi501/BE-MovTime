import { User } from '../../models/User';
import { BaseInterface } from './BaseInterface';

export interface IWatchLaterRepository extends BaseInterface {
	findAll: (userId: number) => Promise<User | null>;
}
