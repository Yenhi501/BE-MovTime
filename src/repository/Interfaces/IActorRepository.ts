import { Actor } from '../../models/Actor';
import { BaseInterface } from './BaseInterface';

export interface IActorRepository extends BaseInterface {
	findActorInfomation: (actorId: number) => Promise<Actor | null>;
	searchAllActor: (
		search: string,
		page: number,
		pageSize: number
	) => Promise<{ rows: Actor[]; count: number }>;
}
