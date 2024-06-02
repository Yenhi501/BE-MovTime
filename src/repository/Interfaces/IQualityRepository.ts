import { Quality } from '../../models/Quality';
import { BaseInterface } from './BaseInterface';

export interface IQualityRepository extends BaseInterface{
	getQualityMovie(episodeId: number, videoQuality: string): Promise<Quality|null>;
}
