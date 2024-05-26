import { Genre } from '../models/Genre';
import { Op, QueryTypes, literal, OrderItem, Sequelize } from 'sequelize';
import Container, { Service } from 'typedi';
import { BaseRepository } from './BaseRepository';
import { MovieActor } from '../models/MovieActor';
import { IMovieActorRepository } from './Interfaces/IMovieActorRepository';

@Service()
export class MovieActorRepository extends BaseRepository<MovieActor> implements IMovieActorRepository {
	
	constructor(){
		super(MovieActor);
	}
    async addActorsForMovie(movieId: number, actorIds: number[]): Promise<MovieActor[]> {
        try {
            const movieActorsData = actorIds.map(actorId => ({
                movieId: movieId,
                actorId: actorId,
            }));
            // Kiểm tra xem có bản ghi bị xóa mềm hay không
            const deletedRecords = await this.model.findAll({
                where: {
                    movieId: movieId,
                    actorId: actorIds,
                },
                paranoid: false, // Bật paranoid mode để lấy cả bản ghi đã bị xóa mềm
            });

            // Khôi phục bản ghi đã bị xóa mềm nếu có
            if (deletedRecords.length > 0) {
                await Promise.all(deletedRecords.map(record => record.restore()));
                return [];
            }
            return await this.model.bulkCreate(movieActorsData);
        } catch (error) {
            throw(error);
        }
    }

    async deleteActorsOfMovie(movieId: number, actorIds: number[]): Promise<number> {
        try {
            return await this.model.destroy({
                where:{
                    movieId: movieId,
                    actorId: {
                        [Op.in]: actorIds
                    }
                }
            });
        } catch (error) {
            console.log(error);
            throw(error);
        }
    }
}
