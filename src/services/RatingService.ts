import { Inject, Service } from "typedi";
import { IRatingService } from "./Interfaces/IRatingSerivce";
import { IRatingRepository } from "../repository/Interfaces/IRatingRepository";
import { RatingRepository } from "../repository/RatingRepository";
import { Rating } from "../models/Rating";
import { Request } from "express";


@Service()
export class RatingService implements IRatingService {

	@Inject(() => RatingRepository)
	private ratingRepository!: IRatingRepository;
        
    async addRating(userId: number, movieId: number, rating: number): Promise<boolean> {
        try {
            const ratingRs = await this.ratingRepository.findByCondition({
                user_id: userId,
                movie_id: movieId
            });
            
            // if rating is already exist
            if(Array.isArray(ratingRs) && ratingRs.length > 0){
                return false;
            }
            
            await this.ratingRepository.addRating({
                userId: userId,
                movieId: movieId,
                rating: rating
            });

            return true;
        } catch (error) {
            throw(error);
        }
    }

    async getRatingMovieOfUser(userId: number, movieId: number): Promise<number> {
        try{
            const rating = await this.ratingRepository.getRatingMovieOfUser(userId,movieId);
            return rating || 0;
        }catch(error){
          throw(error);
        }    
    }

    async updateRating(req: Request): Promise<Rating | null> {
        try{
            const userId = Number(req.body.userId);
            const movieId = Number(req.body.movieId);
            const rating = Number(req.body.rating);
            
            const ratingToUpdate = await this.ratingRepository.findOneByCondition({
                userId,
                movieId
            });

            if(!ratingToUpdate){
                return null;
            }
            ratingToUpdate.rating = rating;
            await this.ratingRepository.save(ratingToUpdate);
            return ratingToUpdate;
        }catch(error){
            console.log(error);
            
          throw(error);
        }       
    }

    async deleteRating(req: Request): Promise<boolean> {
        try{
            const userId = Number(req.body.userId);
            const movieId = Number(req.body.movieId);

            const rating = await this.ratingRepository.findOneByCondition({
                userId,
                movieId
            });
            if(rating) {
                 await this.ratingRepository.delete(rating,true);
                 return true;
            }
            return false;
        }catch(error){
          throw(error);
        }       
    }
}