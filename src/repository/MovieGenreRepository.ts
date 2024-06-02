import { Genre } from '../models/Genre';
import { Op, QueryTypes, literal, OrderItem, Sequelize } from 'sequelize';
import Container, { Service } from 'typedi';
import { BaseRepository } from './BaseRepository';
import { MovieActor } from '../models/MovieActor';
import { IMovieActorRepository } from './Interfaces/IMovieActorRepository';
import { MovieDirector } from '../models/MovieDirector';
import { IMovieDirectorRepository } from './Interfaces/IMovieDirectorRepository';
import { MovieGenre } from '../models/MovieGenre';
import { IMovieGenreRepository } from './Interfaces/IMovieGenreRepository';

@Service()
export class MovieGenreRepository extends BaseRepository<MovieGenre> implements IMovieGenreRepository {
	
	constructor(){
		super(MovieGenre);
	}

    async addGenresForMovie(movieId: number, genreIds: number[]): Promise<MovieGenre[]> {
        try {
            const movieGenresData = genreIds.map(genreId => ({
                movieId: movieId,
                genreId: genreId,
            }));
            // Kiểm tra xem có bản ghi bị xóa mềm hay không
            const deletedRecords = await this.model.findAll({
                where: {
                    movieId: movieId,
                    genreId: genreIds,
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
    
      async deleteGenresOfMovie(movieId: number, genreIds: number[]): Promise<number> {
        try {
            const deletedRows = await this.model.destroy({
                where: {
                  movieId,
                  genreId: { [Op.in]: genreIds },
                },
              });
          
              return deletedRows;
        } catch (error) {
            console.log(error);
            throw(error);
        }
      }

}
