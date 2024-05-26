import { Director } from '../../models/Director';
import { BaseInterface } from './BaseInterface';

export interface IDirectorRepository extends BaseInterface {
	findDirectorInfomation: (directorId: number) => Promise<Director | null>;
	searchAllDirector: (
		search: string,
		page: number,
		pageSize: number
	) => Promise<{ rows: Director[]; count: number }>;
}
