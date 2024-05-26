import { Genre } from '../models/Genre';
import { Op, QueryTypes, literal, OrderItem, Sequelize } from 'sequelize';
import Container, { Service } from 'typedi';
import { BaseRepository } from './BaseRepository';
import { MovieActor } from '../models/MovieActor';
import { IMovieActorRepository } from './Interfaces/IMovieActorRepository';
import { MovieDirector } from '../models/MovieDirector';
import { IMovieDirectorRepository } from './Interfaces/IMovieDirectorRepository';

@Service()
export class MovieDirectorRepository extends BaseRepository<MovieDirector> implements IMovieDirectorRepository {
	
	constructor(){
		super(MovieDirector);
	}

    async addDirectorsForMovie(movieId: number, directorIds: number[]): Promise<MovieDirector[]> {
        try {
            const movieGenresData = directorIds.map(directorId => ({
                movieID: movieId,
                directorID: directorId,
            }));
            // Kiểm tra xem có bản ghi bị xóa mềm hay không
            const deletedRecords = await this.model.findAll({
                where: {
                    movieID: movieId,
                    directorID: directorIds,
                },
                paranoid: false, // Bật paranoid mode để lấy cả bản ghi đã bị xóa mềm
            });

            // Khôi phục bản ghi đã bị xóa mềm nếu có
            if (deletedRecords.length > 0) {
                await Promise.all(deletedRecords.map(record => record.restore()));
                return [];
            }
            return await this.model.bulkCreate(movieGenresData);
      } catch (error) {
            console.log(error);
            throw(error);
      }
    }
    
    async deleteDirectorsOfMovie(movieId: number, directorIds: number[]): Promise<number> {
        try {
            const deletedRows = await this.model.destroy({
                where: {
                  movieID: movieId,
                  directorID: { [Op.in]: directorIds },
                },
              });
          
              return deletedRows;
        } catch (error) {
            console.log(error);
            throw(error);
        }
    }

}
