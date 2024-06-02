import { User } from '../../models/User';
import { WatchHistory } from '../../models/WatchHistory';
import { BaseInterface } from './BaseInterface';

export interface IWatchHistoryRepository extends BaseInterface {
	findAll: (userId: number) => Promise<User | null>;
	findOneByEpisode(userId: number, episodeId: number): Promise<WatchHistory| null>;

}
