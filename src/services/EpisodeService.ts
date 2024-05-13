import { Inject, Service } from 'typedi';
import { Episode } from '../models/Episode';
import { IEpisodeRepository } from '../repository/Interfaces/IEpisodeRepository';
import { IEpisodeService } from './Interfaces/IEpisodeService';
import { S3Service } from './S3Service';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { MovieRepository } from '../repository/MovieRepository';
import { IMovieRepository } from '../repository/Interfaces/IMovieRepository';
import Redis from 'ioredis';
import { EpisodeRepository } from '../repository/Interfaces/EpisodeRepository';

@Service()
export class EpisodeService implements IEpisodeService {

	@Inject(() => EpisodeRepository)
	private episodeRepository!: IEpisodeRepository;

	@Inject(() => S3Service)
	private s3Service!: S3Service;

	
	@Inject(() => MovieRepository)
	private movieRepository!: IMovieRepository;
	

	private redis: Redis; // Create a Redis client

	constructor() {
		this.redis = new Redis({
			host: 'redis',
			port: 6379,
		}); // Initialize the Redis client
	}

	public clearCache(){
		this.redis.flushall((err, reply) => {
			if (err) {
			  console.error(err);
			} else {
			  console.log('Cache cleared:', reply === 'OK');
			}
		});
	}
	
	hideEmail(email:string) {
		const atIndex = email.indexOf('@');
		
		if (atIndex > 1) {
		  const username = email.substring(0, atIndex);
		  const domain = email.substring(atIndex);
		  
		  // Hiển thị 3 ký tự đầu, sau đó thêm dấu sao và hiển thị 3 ký tự cuối
		  const hiddenUsername = username.substring(0, 4) + '*'.repeat(username.length - 3);
		  
		  return hiddenUsername + domain;
		}
		
		// Trường hợp không có ký tự @ trong email
		return email;
	  }

	/**
	 * Get details a episode of movie by episode_id
	 *
	 * @param id number
	 * @returns Promise<Episode|null>
	 */
	async getEpisode(id: number): Promise<Episode | null> {
		try {
			let episode = await this.episodeRepository.getEpisode(id);
			if (episode) {
				if (episode.posterURL) {
					episode.posterURL = await this.s3Service.getObjectUrl(
						episode.posterURL
					);
				} else {
					episode.posterURL = await this.s3Service.getObjectUrl(
						'default/poster_default.jpg'
					);
				}

				if (episode.movieURL) {
					episode.movieURL = await this.s3Service.getObjectUrl(
						episode.movieURL
					);
				} else {
					episode.movieURL = await this.s3Service.getObjectUrl(
						'default/movie_default.mp4'
					);
				}
			}
			return episode;
		} catch (error) {
			console.log(error);
			throw(error);
		}
	}

	

	async createEpisode(req: Request): Promise<Episode> {
		try {
			const {
				movieId,
				title,
				description,
				releaseDate,
			} = req.body;
			const lastEpisode =await this.episodeRepository.getTheLastEpisodeOfMovie(movieId);
			let episodeNo = 1;
			if(lastEpisode.length !==0){
				episodeNo = lastEpisode[0].episodeNo+1
			}
			// const formattedPosterURL = `movies/${movieId}/episodes/${episodeNo}/poster.jpg`;
			const formattedPosterURL = `movies/${movieId}/background.jpg`;
			const formattedMovieURL = `movies/${movieId}/episodes/${episodeNo}/movie.mp4`;
			
			const episodeData = {
				movieId : movieId,
				title: title,
				description: description,
				releaseDate: releaseDate,
				duration: 0,
				episodeNo: episodeNo,
				numView:0,
				posterURL: formattedPosterURL,
				movieURL: formattedMovieURL,
			}
			const newEpisode = await this.episodeRepository.createEpisode(episodeData);
			

			return newEpisode;
		} catch (error) {
			console.log(error);
			
			throw(error);
		}
	}
	
	async checkMovieIsSeries(movieId: number): Promise<boolean> {
		try {

			const movie = await this.movieRepository.findOneByCondition({
				movieId: movieId
			});
			
			return movie.isSeries;
		} catch (error) {
			console.log(error);
			throw(error);			
		}
	}

	async  updateEpisode(req: Request): Promise<[number, Episode[]]>
	{
		try {
			const episodeId = Number(req.params.episodeId);
			const updatedData = req.body;
			const result = await this.episodeRepository.updateEpisode(episodeId, updatedData);
			this.clearCache();
			return result;
		} catch (error) {
			console.log(error);
			throw(error);			
		}
	}

	async deleteEpisode(req: Request): Promise<boolean>
	{
		try {
			const episodeId = req.params.episodeId;
			const episode = await this.episodeRepository.findById(Number(episodeId));
			if(episode){
				await this.episodeRepository.delete(episode);
				await this.episodeRepository.updateNumEpisodeInMovie(episode.movieId,-1);
				this.clearCache();
				return true;
			}
			return false;
		} catch (error) {
			console.log(error);
			throw(error);
		}
	}


}
