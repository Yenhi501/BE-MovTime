import { Movie } from '../../models/Movie';
import express, { Request, Response, Router } from 'express';
import { MovieGenre } from '../../models/MovieGenre';
import { User } from '../../models/User';

export interface IRecommenderService {
    createMatrix(): Promise<{ [x: number]: number[]; }[]>;
    getMoviesRecommend(userId: number,page:number, pageSize: number): Promise<Movie[]>;
    getMovieIdsRecommend(userId: number): Promise<number[]>;
    testData(userId: number): Promise<any>;
    getRelatedMovies(userId: number,page:number, pageSize: number): Promise<Movie[]> 

}
