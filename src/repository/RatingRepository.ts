import { Movie } from '../models/Movie';
import { Genre } from '../models/Genre';
import Database from '../config/database';
import { Op, QueryTypes, literal, OrderItem, Sequelize } from 'sequelize';
import Container, { Service } from 'typedi';
import { BaseRepository } from './BaseRepository';
import { IRatingRepository } from './Interfaces/IRatingRepository';
import { Rating } from '../models/Rating';

const db = Database.getInstance();


@Service()
export class RatingRepository extends BaseRepository<Rating> implements IRatingRepository {
	
	constructor(){
		super(Rating);
	}

    getRatingOfMovie(movieId: number): Promise<Rating[]> {
        try {
           const ratings = this.model.findAll({
                where: {
                    movie_id: movieId,
                },
                attributes: {exclude: ['deletedAt']},
                order: [['createdAt', 'ASC']]
           }); 
           return ratings;
        } catch (error) {
            throw (error);
        }
    }

    async addRating(data: any): Promise<Rating> {
        try {
            const rs = await this.model.create(data);
            
            await this.updateAvgRatingMovie(data.movieId);
            return rs;
        } catch (error) {
            throw (error);
        }
    }

    async updateAvgRatingMovie(movieId: number): Promise<void>
    {
        try {
            const result = await Rating.findOne({
              attributes: [[Sequelize.fn('AVG', Sequelize.col('rating')), 'averageRating']],
              where: {
                movie_id: movieId
              }
            });
        
            const averageRating = result?.getDataValue('averageRating');
            await Movie.update(
                { averageRating: averageRating },
                {
                  where: {
                    movie_id: movieId,
                  },
                }
            );
          } catch (error) {
            console.error('Error calculating average rating:', error);
            throw error;
          }
    }

    async getRatingMovieOfUser(userId: number, movieId: number): Promise<number> {
      try{
          const rating = await this.model.findOne({
            where: {
              movie_id: movieId,
              user_id: userId
            }
          });
          return rating?.rating || 0;
      }catch(error){
        throw(error);
      }
    }
}