import { Service } from 'typedi';
import { BaseRepository } from './BaseRepository';
import { User } from '../models/User';
import { Movie } from '../models/Movie';
import { WatchHistory } from '../models/WatchHistory';
import { Genre } from '../models/Genre';
import { Episode } from '../models/Episode';
import { IWatchHistoryRepository } from './Interfaces/IWatchHistorRepository';

@Service()
export class WatchHistoryRepository
	extends BaseRepository<WatchHistory>
	implements IWatchHistoryRepository
{
	constructor() {
		super(WatchHistory);
	}

	async findAll(userId: number) {
		try {
			const movieHistoryList = await User.findOne({
				where: { userId: userId },
				attributes: ['userId'],
				include: [
					{
						model: Episode,
						as: 'watchHistoryList',
						attributes: {
							exclude: ['createdAt', 'updatedAt', 'deletedAt'],
						},
						through: { attributes: ['updatedAt', 'duration'] },
						include: [
							{
								model: Movie,
								include: [
									{
										model: Genre,
										attributes: ['genre_id', 'name'],
										as: 'genres',
										through: { attributes: [] },
									},
								],
							},
						],
					},
				],
			});
			return movieHistoryList;
		} catch (error) {
			console.log(error);
			throw new Error('Cannot get all movie history');
		}
	}

	async findOneByEpisode(userId: number, episodeId: number): Promise<WatchHistory|null> {
		try {
			const movieHistoryList = await WatchHistory.findOne({
				where: { 
					userId: userId ,
					episodeId: episodeId
				},

			});
			return movieHistoryList;
		} catch (error) {
			console.log(error);
			throw (error);
		}
	}
}
