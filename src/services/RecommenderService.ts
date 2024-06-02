import { Inject, Service } from 'typedi';
import { Movie } from '../models/Movie';
import { IMovieService } from './Interfaces/IMovieService';
import { ISearchMovieOption } from '../repository/Interfaces/ISearchMovieOption';
import { S3Service } from './S3Service';
import { Op } from 'sequelize';
import Redis from 'ioredis';
import crypto from 'crypto'; // Import the built-in crypto library
import express, { Request, Response } from 'express';
import { IRecommenderService } from './Interfaces/IRecommenderService';
import { RecommenderRepository } from '../repository/RecommenderRepository';
import { IRecommenderRepository } from '../repository/Interfaces/IRecommenderRepository';
import { MovieGenre } from '../models/MovieGenre';
import { User } from '../models/User';

@Service()
export class RecommenderSerivce implements IRecommenderService {

    private favoritePoint = 4.5;
    private viewedPoint = 4;


	@Inject(() => RecommenderRepository)
	private recommenderRepo!: IRecommenderRepository;

	@Inject(() => S3Service)
	private s3Service!: S3Service;

	private redis: Redis; // Create a Redis client

	constructor() {
		this.redis = new Redis({
			host: 'redis',
			port: 6379,
		}); // Initialize the Redis client
	}
    
    async testData(userId: number){
        try{
            const movieId=1;
            // const dataUser = await this.recommenderRepo.getDataMoviesOfUser(userId);
            const matrix = await this.createMatrix();
            const currentMovieMatrix =matrix[movieId];
            const rowKey = Object.keys(currentMovieMatrix)[0];
            const rowArray = currentMovieMatrix[Number(rowKey)] as number[]; // Lấy mảng từ hàng
            const multipliedArray = rowArray.map((value, index) => value * 5);
            const moviesId =[1];
            const restMatrix = await this.getTheRestMatrix(matrix,moviesId);
            const matrixRecommend = await this.getUserMatrixRecommend(restMatrix,multipliedArray);
            console.log(matrixRecommend);
            const movieIdsArr: number[] = matrixRecommend.map(([firstElement]) => firstElement);
            console.log(movieIdsArr);
            
            return matrix;
        }catch(error){
            console.log(error);
            throw(error);
        }
    }

    async getRelatedIdMovies(movieId: number){
        try{
            const matrix = await this.createMatrix(); // Full matrix
            const currentMovieMatrix =matrix[movieId]; // Vector matrix of current movie
            const rowKey = Object.keys(currentMovieMatrix)[0];
            const rowArray = currentMovieMatrix[Number(rowKey)] as number[]; // Lấy mảng từ hàng
            const multipliedArray = rowArray.map((value, index) => value * 5);
            const moviesId =[movieId];
            const restMatrix = await this.getTheRestMatrix(matrix,moviesId);
            const matrixRecommend = await this.getUserMatrixRecommend(restMatrix,multipliedArray);
            const movieIdsArr: number[] = matrixRecommend.map(([firstElement]) => firstElement);
            
            return movieIdsArr;
        }catch(error){
            console.log(error);
            throw(error);
        }
    }

    async getMovieIdsRecommend(userId: number): Promise<number[]> {
        try {
            const userRateMap = new Map<number, number>();
            const matrix = await this.createMatrix();
            const dataUser = await this.recommenderRepo.getDataMoviesOfUser(userId);
            if(dataUser){
                for(const item of dataUser.ratings){
                    const ratingObj = item.getDataValue('Rating');
                    userRateMap.set(ratingObj.getDataValue('movie_id'), ratingObj.getDataValue('rating'));
                }

                for(const item of dataUser.watchHistoryList){
                    const movieID = item.getDataValue('movie_id');
                    if(!userRateMap.has(movieID)){
                        userRateMap.set(movieID, this.viewedPoint)
                    }
                }

                for(const item of dataUser.movieFavoriteList){
                    const movieID = item.getDataValue('movie_id');
                    if(!userRateMap.has(movieID)){
                        userRateMap.set(movieID, this.favoritePoint)
                    }
                }
            }
            const restMatrix = await this.getTheRestMatrix(matrix,Array.from(userRateMap.keys()))
            const maxtrixWeight = await  this.getUserRateMatrixWeight(matrix,userRateMap);
            const vectorWeight = this.sumColumns(maxtrixWeight);
            const matrixRecommend = this.getUserMatrixRecommend(restMatrix,vectorWeight);
            const movieIdsArr: number[] = matrixRecommend.map(([firstElement]) => firstElement);
            return movieIdsArr;
        } catch (error) {
            console.log("Err in Recommender Service");
            throw new Error('Err in Recommender Service.');
        }
    }

    async getMoviesRecommend(userId: number,page:number, pageSize: number): Promise<Movie[]> {
        try {
            const movieIds =await this.getMovieIdsRecommend(userId);
            const newMovieIds = movieIds.filter(value => value !== 0);;
            const movies = await this.recommenderRepo.getMoviesRecommendByIds(newMovieIds, page, pageSize);
            for (const movie of movies) {
				movie.posterURL = await this.s3Service.getObjectUrl(movie.posterURL);
				movie.trailerURL = await this.s3Service.getObjectUrl(movie.trailerURL);
				movie.backgroundURL = await this.s3Service.getObjectUrl(movie.backgroundURL);
			}
            return movies;

        } catch (error) {
            console.log("Err in test Service");
            
            throw new Error('Method not implemented.');
        }
    }

    async getRelatedMovies(movieId: number,page:number, pageSize: number): Promise<Movie[]> {
        try {
            const movieIds =await this.getRelatedIdMovies(movieId);
            const newMovieIds = movieIds.filter(value => value !== 0);;
            const movies = await this.recommenderRepo.getMoviesRecommendByIds(newMovieIds, page, pageSize);
            for (const movie of movies) {
				movie.posterURL = await this.s3Service.getObjectUrl(movie.posterURL);
				movie.trailerURL = await this.s3Service.getObjectUrl(movie.trailerURL);
				movie.backgroundURL = await this.s3Service.getObjectUrl(movie.backgroundURL);
			}
            return movies;

        } catch (error) {
            console.log(error);
            
            throw(error);
        }
    }

    /**
     * Create full matrix between movies and genres
     */
    public async createMatrix(): Promise<{ [x: number]: number[]; }[]> {
        try {
            const matrix: number[][] = [];
            const movieGenres: MovieGenre[] =  await this.recommenderRepo.getMovieGenre();
            // Sử dụng Set để lưu trữ các giá trị không trùng nhau
            const uniqueMovieIds = new Set<number>();
            const uniqueGenreIds = new Set<number>();
            // Lặp qua mảng và thêm giá trị vào Set
            movieGenres.forEach((movieGenre: MovieGenre) => {
                uniqueMovieIds.add(movieGenre.getDataValue('movie_id'));
                uniqueGenreIds.add(movieGenre.getDataValue('genre_id'));
            });
            
            // Chuyển Set thành mảng
            const uniqueMovieIdsArray = Array.from(uniqueMovieIds);
            const uniqueGenreIdsArray = Array.from(uniqueGenreIds);
            uniqueMovieIdsArray.sort((a, b) => a - b);
            uniqueGenreIdsArray.sort((a, b) => a - b);

            // console.log(uniqueMovieIdsArray);
            // console.log(uniqueGenreIdsArray);
            const maxMovieId = Math.max(...uniqueMovieIdsArray);
            const maxGenreId = Math.max(...uniqueGenreIdsArray);
    
            // for(const movie of movies){

            // }
            const rows = maxMovieId+1;
            const cols = maxGenreId+1;

            for (let i = 0; i < rows; i++) {
                const row: number[] = [];
                for (let j = 0; j < cols; j++) {
                    row.push(0);
                }
                // Thêm hàng vào mảng 2 chiều
                matrix.push(row);
            }
            movieGenres.forEach((movieGenre: MovieGenre) => {
                const movie_id = movieGenre.getDataValue('movie_id');
                const genre_id = movieGenre.getDataValue('genre_id');
                matrix[movie_id][genre_id] = 1;
            });
            // Convert array to arr have key and value
            const array2DWithCustomKeys = matrix.map((subArray, index) => ({
                [index]: subArray
              }));
            // In mảng 2 chiều đã tạo
            // console.log(matrix);
            // const matrix2D: number[][] = [];
            // matrix2D.push(matrix[1]);
            // matrix2D.push(matrix[2]);
            // console.log(matrix2D);
 
            return array2DWithCustomKeys;
        } catch (error) {
            throw new Error('Method not implemented.');
        }
    }

    // public async getUserMatrix(matrix: { [x: number]: number[] }[],movieIds:number[]):Promise<{ [x: number]: number[] }[]> 
    // {
    //     try {
    //         const matrix2D:{ [x: number]: number[] }[] = [];
    //         for(const id of movieIds){
    //             matrix2D.push(matrix[id]);
    //         }

    //         return matrix2D;
    //     } catch (error) {
    //         throw new Error('Method not implemented.');
    //     }
    // }

    /**
     * Get the rest matrix from the matrix and movieIds
     * Function will remove movies with movie_id in movieIds array 
     */
    public async getTheRestMatrix(matrix: { [x: number]: number[] }[], movieIds: number[]): Promise<{ [x: number]: number[] }[]> {
        try {
          const userMatrix: { [x: number]: number[] }[] = [];
          const excludedMovieIdsSet = new Set(movieIds);
      
          for (const row of matrix) {
            const rowKey = Object.keys(row)[0]; // Lấy key của hàng
            const rowId = parseInt(rowKey, 10);
      
            if (!excludedMovieIdsSet.has(rowId)) {
              userMatrix.push(row);
            }
          }
      
          return userMatrix;
        } catch (error) {
          throw new Error('Method not implemented.');
        }
    }

    public async getUserRateMatrixWeight(matrix: { [x: number]: number[] }[], userRateMap: Map<number, number>): Promise<{ [x: number]: number[] }[]>
    {
        try {
            const matrixWeight: { [x: number]: number[] }[] = [];

            userRateMap.forEach((value, key)=>{
                const multiplier = value;
                const numbersArray =matrix[key];
                numbersArray[key] = numbersArray[key].map(value => value * multiplier);
                matrixWeight.push(numbersArray);
                
            });
            // console.log(this.sumColumns(matrixWeight));
            // console.log(matrixWeight);
            return matrixWeight;
        } catch (error) {
            throw new Error('Err in getUserRateMatrix.');
        }
    }

    /**
     * Multiply the rest movies matrix by the user weight matrix
     * 
     * @param matrix the rest matrix (without movies favorite of user, movies user rated, movies user watched)
     * @param userWeight vector user weight matrix (by genres)
     * @returns [number, number][]
     */
    public getUserMatrixRecommend(matrix: { [x: number]: number[] }[], userWeight: number[]): [number, number][]
    {
        try {
            const recommendedMatrix: { [x: number]: number[] }[] = [];

            for (const row of matrix) {
                const rowKey = Object.keys(row)[0];
                const rowArray = row[Number(rowKey)] as number[]; // Lấy mảng từ hàng
                const multipliedArray = rowArray.map((value, index) => value * userWeight[index]);
          
                const updatedRow = { [rowKey]: multipliedArray };
                recommendedMatrix.push(updatedRow);

              }
              const sumByKey: { [x: number]: number } = {};

              for (const row of recommendedMatrix) {
                const rowKey = Object.keys(row)[0];
                const rowArray = row[Number(rowKey)] as number[];
            
                if (!sumByKey[Number(rowKey)]) {
                  sumByKey[Number(rowKey)] = 0;
                }
            
                sumByKey[Number(rowKey)] += rowArray.reduce((acc, value) => acc + value, 0);
              }
              
            return this.sortArrayByValue(sumByKey);
        } catch (error) {
            throw new Error('Err in getUserRateMatrix.');
        }
    }
    
    /**
     * Sum colum, output is a vector normalized
     * 
     * @param matrixWeight 
     * @returns number[]
     */
    private sumColumns(matrixWeight: { [x: number]: number[] }[]): number[] {
        const result: number[] = [];
      
        // Tìm số lượng cột của ma trận
        const numColumns = Math.max(...Object.values(matrixWeight[0] || {}).map(arr => arr.length));
        
        // Khởi tạo mảng result với giá trị 0 cho mỗi cột
        for (let i = 0; i < numColumns; i++) {
          result[i] = 0;
        }
        // Cộng giá trị của mỗi cột từ mỗi đối tượng trong mảng
        matrixWeight.forEach(obj => {
            Object.keys(obj).forEach((key: string) => { // Chỉ định rõ kiểu cho key là string
            const columnArray = obj[Number(key)];
            columnArray.forEach((value: number, columnIndex: number) => { // Chỉ định rõ kiểu cho value và columnIndex là number
                result[columnIndex] += value;
            });
            });
        });
      
        return this.normalizeArray(result);
    }

    /**
     * matrix normalization ( devide the total )
     * 
     * @param array 
     * @returns number[]
     */
    private normalizeArray(array: number[]): number[] {
        const sum = array.reduce((acc, value) => acc + value, 0);
        return array.map(value => value / sum);
    }

    /**
     * Sort array by value
     * 
     * @param sumByKey 
     * @returns [number, number][]
    */   
    private sortArrayByValue(sumByKey: { [x: number]: number }): [number, number][] {
        // Chuyển đối tượng thành mảng các cặp key-value
        const keyValueArray: [number, number][] = Object.entries(sumByKey)
          .map(([key, value]) => [Number(key), value]); // Chuyển đổi key thành số
      
        // Sắp xếp mảng theo giá trị (value)
        keyValueArray.sort((a, b) => b[1] - a[1]);
      
        return keyValueArray;
    }
}
