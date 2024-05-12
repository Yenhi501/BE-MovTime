import { Model, ModelCtor } from 'sequelize-typescript';
import { BaseInterface } from './Interfaces/BaseInterface';
import sequelize from 'sequelize/types/sequelize';
import { Op, WhereOptions } from 'sequelize';
import Database from '../config/database';

export abstract class BaseRepository<T extends Model<T>>
	implements BaseInterface
{
	protected db;
	protected model: ModelCtor<T>;

	constructor(model: ModelCtor<T>) {
		this.model = model;
		this.db = Database.getInstance();
	}

	async save(model: T): Promise<void> {
		try {
			await model.save();
		} catch (error) {
			throw new Error('Không thể save' + error);
		}
	}

	async findById(id: number): Promise<any | null> {
		try {
			return await this.model.findByPk(id);
		} catch (error) {
			throw new Error('Không thể tìm thấy' + error);
		}
	}

	async findOneByCondition(searchConditions: any): Promise<any | null> {
		try {
			return await this.model.findOne({
				where: searchConditions,
				paranoid: false,
			});
		} catch (error) {
			throw new Error('Không thể tìm thấy: ' + error);
		}
	}

	async findByCondition(searchConditions: any): Promise<any | null> {
		try {
			return await this.model.findAll({
				where: searchConditions,
				paranoid: true,
			});
		} catch (error) {
			throw new Error('Không thể tìm thấy: ' + error);
		}
	}

	async delete(model: T, force: boolean = false): Promise<void> {
		try {
			await model.destroy({ force: force });
		} catch (error) {
			throw new Error('Không thể delete' + error);
		}
	}

	async restore(model: T): Promise<void> {
		try {
			await model.restore();
		} catch (error) {
			throw new Error('Không thể restore' + error);
		}
	}

	async findMany(): Promise<any[]> {
		try {
			const result = await this.model.findAll();
			return result;
		} catch (error) {
			throw new Error('Không thể lấy danh sách' + error);
		}
	}
}
