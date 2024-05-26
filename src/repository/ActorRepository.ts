import { Service } from 'typedi';
import { Actor } from '../models/Actor';
import { Movie } from '../models/Movie';
import { BaseRepository } from './BaseRepository';
import { Op, Sequelize, QueryTypes } from 'sequelize';
import { MovieActor } from '../models/MovieActor';
import { IActorRepository } from './Interfaces/IActorRepository';

@Service()
export class ActorRepository
	extends BaseRepository<Actor>
	implements IActorRepository
{
	constructor() {
		super(Actor);
	}
	
	findActorInfomation = async (actorId: number) => {
		try {
			let data = await Actor.findOne({
				where: { actorId: actorId },
				attributes: {
					exclude: ['createdAt', 'updatedAt', 'deletedAt'],
				},
				include: [
					{
						model: Movie,
						attributes: {
							exclude: ['createdAt', 'updatedAt', 'deletedAt'],
						},
						through: { attributes: [] },
					},
				],
			});
			return data;
		} catch (error: any) {
			throw new Error(error.message);
		}
	};

	searchAllActor = async (search: string, page: number, pageSize: number) => {
		try {
			const data = await Actor.findAndCountAll({
				where: {
					name: {
						[Op.iLike]: `%${search}%`,
					},
				},
				offset: (page - 1) * pageSize,
				limit: pageSize,
				attributes: {
					exclude: ['createdAt', 'updatedAt', 'deletedAt'],
				},
			});

			return data;
		} catch (error: any) {
			throw error;
		}
	};
}
