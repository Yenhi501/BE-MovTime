import { Actor } from '../models/Actor';
import { ActorRepository } from './../repository/ActorRepository';
import { Inject, Service } from 'typedi';
import { S3Service } from './S3Service';
import { Request } from 'express';
import { IActorRepository } from '../repository/Interfaces/IActorRepository';
import { IActorService } from './Interfaces/IActorService';

@Service()
export class ActorService implements IActorService {
	@Inject(() => ActorRepository)
	private actorRepository!: IActorRepository;

	@Inject(() => S3Service)
	private s3Service!: S3Service;

	findActorInfomation = async (actorId: number) => {
		try {
			let actor = await this.actorRepository.findActorInfomation(actorId);
			if (actor!.avatar) {
				actor!.avatar = await this.s3Service.getObjectUrl(actor!.avatar);
			} else {
				actor!.avatar = await this.s3Service.getObjectUrl(
					'default/actor/default_avatar.jpg'
				);
			}
			if (actor!.poster) {
				actor!.poster = await this.s3Service.getObjectUrl(actor!.poster);
			} else {
				actor!.poster = await this.s3Service.getObjectUrl(
					'default/actor/default_poster.jpg'
				);
			}

			for (const movie of actor!.movies) {
				movie.posterURL = await this.s3Service.getObjectUrl(movie.posterURL);
				movie.trailerURL = await this.s3Service.getObjectUrl(movie.trailerURL);
				movie.backgroundURL = await this.s3Service.getObjectUrl(
					'movies/'.concat(movie.movieId.toString(), '/background.jpg')
				);
			}
			return actor;
		} catch (error) {
			console.log(error);
			throw new Error('Cannot get all movie');
		}
	};

	createActor = async (req: Request) => {
		try {
			const { name, gender, dateOfBirth, description } = req.body;
			const actorData: Partial<Actor> = {
				name,
				gender,
				dateOfBirth,
				description,
			};

			return await this.actorRepository.save(Actor.build(actorData));
		} catch (error: any) {
			throw error;
		}
	};

	updateActor = async (req: Request) => {
		const { name, gender, dateOfBirth, description } = req.body;
		const actorId = Number(req.params.actorId);
		const actorData: Partial<Actor> = {
			name,
			gender,
			dateOfBirth,
			description,
		};

		const actorToUpdate = await this.actorRepository.findById(actorId);

		if (actorToUpdate) {
			await actorToUpdate.update(actorData);
			await this.actorRepository.save(actorToUpdate);
			return actorToUpdate;
		} else {
			return null;
		}
	};

	findByActorId = async (actorId: number) => {
		try {
			return this.actorRepository.findById(actorId);
		} catch (error: any) {
			throw new Error(error.message);
		}
	};

	deleteActorByActorId = async (actorId: number) => {
		try {
			const actor = await this.actorRepository.findById(actorId);
			if (!actor) {
				return false;
			}
			await this.actorRepository.delete(actor);
			return true;
		} catch (error: any) {
			throw new Error(error.message);
		}
	};

	getActors = async (search: string, page: number, pageSize: number) => {
		try {
			const actors = await this.actorRepository.searchAllActor(
				search,
				page,
				pageSize
			);
			for (const actor of actors.rows) {
				if (actor!.avatar) {
					actor!.avatar = await this.s3Service.getObjectUrl(actor!.avatar);
				} else {
					actor!.avatar = await this.s3Service.getObjectUrl(
						'default/actor/default_avatar.jpg'
					);
				}
				if (actor!.poster) {
					actor!.poster = await this.s3Service.getObjectUrl(actor!.poster);
				} else {
					actor!.poster = await this.s3Service.getObjectUrl(
						'default/actor/default_poster.jpg'
					);
				}
			}
			return actors;
		} catch (error: any) {
			throw new Error(error.message);
		}
	};

	async getPresignUrlToUploadAvatar(actorId: number): Promise<string|null> {
        try{
			const actorData: Partial<Actor> = {};
			actorData.actorId = actorId;
			actorData.avatar = 'actors/'+actorId+'/avatar.jpg';
			const actorToUpdate = await this.actorRepository.findById(actorId);

			if (actorToUpdate) {
				await actorToUpdate.update(actorData);
				await this.actorRepository.save(actorToUpdate);
				return await this.s3Service.generatePresignedUrlUpdate(actorData.avatar,'image/jpeg');
			} else {
				return null;
			}
        }catch(error) {
            throw(error);
        }
    }

	// getPopularActors = async (page: number, pageSize: number) => {
	// 	try{
	// 		return this.actorRepository.getPopularActors(1,5);
	// 	}catch(error){
	// 		throw(error);
	// 	}
	// }
}
