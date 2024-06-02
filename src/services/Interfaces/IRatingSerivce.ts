import { Rating } from "../../models/Rating";
import { Request } from "express";


export interface IRatingService{
    addRating(userId: number, movieId: number, rating: number): Promise<boolean>;
    getRatingMovieOfUser(userId: number, movieId: number): Promise<number>;
    updateRating(req: Request): Promise<Rating|null>;
    deleteRating(req: Request): Promise<boolean>;
}