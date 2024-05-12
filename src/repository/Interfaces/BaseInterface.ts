import { Model } from 'sequelize';

export interface BaseInterface {
	save(data: any): Promise<void>;
	findById(id: number): Promise<any | null>;
	delete(model: Model<any>, force?: boolean): Promise<void>;
	findMany(): Promise<any[]>;
	restore(model: Model<any>): Promise<void>;
	findOneByCondition(searchConditions: any): Promise<any | null>;
	findByCondition(searchConditions: any): Promise<any | null>;
}
