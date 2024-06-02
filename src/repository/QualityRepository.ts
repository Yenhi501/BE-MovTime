import Container, { Service } from 'typedi';
import { BaseRepository } from './BaseRepository';
import { IRecommenderRepository } from './Interfaces/IRecommenderRepository';
import { WatchHistory } from '../models/WatchHistory';
import { WatchLater } from '../models/WatchLater';
import { MovieFavorite } from '../models/MovieFavorite';
import { IGenreRepository } from './Interfaces/IGenreRepository';
import { Quality } from '../models/Quality';
import { IQualityRepository } from './Interfaces/IQualityRepository';

@Service()
export class QualityRepository extends BaseRepository<Quality> implements IQualityRepository {
	
	constructor(){
		super(Quality);
	}
	async getQualityMovie(episodeId: number, videoQuality: string): Promise<Quality|null> {
		try{
			const quality = await this.model.findOne({
				attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] },
				where:{episodeId: episodeId, videoQuality: videoQuality }
			});
			return quality;
		}catch(error){
			console.log(error);
			throw(error);
		}
	}
}