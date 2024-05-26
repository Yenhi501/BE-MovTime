import { Inject, Service } from 'typedi';
import { S3Service } from './S3Service';
import { HomeRepository } from '../repository/HomeRepository';
import { IHomeRepository } from '../repository/Interfaces/IHomeRepository';
import { IHomeService } from './Interfaces/IHomeService';
import { Home } from '../models/Home';
import { Movie } from '../models/Movie';
import { Genre } from '../models/Genre';

@Service()
export class HomeService implements IHomeService {

	@Inject(() => HomeRepository)
	private homeRepository!: IHomeRepository;

	@Inject(() => S3Service)
	private s3Service!: S3Service;

    public async getMoviesByGenre(page: number, pageSize: number) {
        try {

            let genres = await this.homeRepository.getMoviesByGenre(page, pageSize);
            for (const genre of genres) {
                for(const movie of genre.movies){
                    movie.posterURL = await this.s3Service.getObjectUrl(movie.posterURL);
                    movie.backgroundURL = await this.s3Service.getObjectUrl('movies/'.concat((movie.movieId).toString(),'/background.jpg'));
                }
            }
            return genres;
        } catch (error) {
			console.log(error);
            throw new Error('Error while get movies by genres.');
        }
    }

    public async getHomePoster(): Promise<Home[]> {
        try {
            let homeMovies = await this.homeRepository.getHomePoster();
            for(const homeMovie of homeMovies){
                homeMovie.rmBackground = await this.s3Service.getObjectUrl(homeMovie.rmBackground);
                if(homeMovie.movie.backgroundURL){
                    homeMovie.movie.backgroundURL = await this.s3Service.getObjectUrl(homeMovie.movie.backgroundURL);
                }else{
                    homeMovie.movie.backgroundURL = await this.s3Service.getObjectUrl('movies/'.concat((homeMovie.movieId).toString(),'/background.jpg'));
                }
                homeMovie.movie.posterURL = await this.s3Service.getObjectUrl(homeMovie.movie.posterURL);
            }
            return homeMovies;
        } catch (error) {
			console.log(error);
            throw(error);
        }
    }

    async getMoviesOfGenre(genreId: number, page: number, pageSize: number, sortMovie?: string | undefined): Promise<Genre[]> {
        try {
            const sortFieldMap: { [key: string]: string } = {
                highRated: 'average_rating',
                newest: 'release_date',
                highFavorited: 'num_favorite',
            };
            if (sortMovie && sortFieldMap[sortMovie]) {
                sortMovie = sortFieldMap[sortMovie];
            } else {
                sortMovie = 'movie_id';
            }
            let genre = await this.homeRepository.getMoviesOfGenre(genreId, page, pageSize);
            for(const movie of genre[0].movies){
                if(movie.posterURL){
                    movie.posterURL = await this.s3Service.getObjectUrl(movie.posterURL);
                }else{
                    movie.posterURL = await this.s3Service.getObjectUrl('default/movies/poster_default.jpg');
                }
                if(movie.backgroundURL){
                    movie.backgroundURL = await this.s3Service.getObjectUrl('movies/'.concat((movie.movieId).toString(),'/background.jpg'));
                }else{
                    movie.backgroundURL = await this.s3Service.getObjectUrl('default/movies/background_default.jpg');
                }
            }
            return genre;
            
        } catch (error) {
            throw(error);
        }
    }
}