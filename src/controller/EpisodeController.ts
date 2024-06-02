import { Request, Response } from 'express';
import Container from 'typedi';
import { EpisodeService } from '../services/EpisodeService';
import { IEpisodeService } from '../services/Interfaces/IEpisodeService';
import { IMovieService } from '../services/Interfaces/IMovieService';
import { IUserService } from '../services/Interfaces/IUserService';
import { MovieService } from '../services/MovieService';
import { UserService } from '../services/UserService';

export class EpisodeController{
	private episodeService: IEpisodeService;
	private movieService: IMovieService;
	private userService: IUserService;

	constructor() {
		this.episodeService = Container.get(EpisodeService);
		this.movieService = Container.get(MovieService);
		this.userService = Container.get(UserService);

	}

    getEpisode = async (req: Request, res: Response) => {
		const { id } = req.params;
		try {
			const userId = req.payload!.userId!;
			
			const episode = await this.episodeService.getEpisode(Number(id));
			const movieId = episode?.getDataValue('movieId');
			const movie = await this.movieService.getMovieById(Number(movieId));

			if (!episode || !movie) {
				return res.status(404).json({ error: 'Can not find episode.' });
			}
			const watchHistory = await this.userService.findOneWatchingHistory(userId, Number(episode.getDataValue('episodeId')));
			
			if(!userId){
				episode.movieURL = movie!.trailerURL;
			}else{
				if(movie.level===0){
					return res.status(200).json({
						message: 'success',
						watchHistory: watchHistory,
						episode: episode,
					});
				}

				if(movie.level===1){
					const subscriptionTypeId = req.payload!.subscriptionTypeId!;
					if(subscriptionTypeId!==1){
						return res.status(200).json({
							message: 'success',
							watchHistory: watchHistory,
							episode: episode,
						});
					}
					return res.status(403).json({
						message: "Update your subscription to watch movie!"
					});
				}
				
			}


			return res.status(200).json({
				message: 'success',
				watchHistory: watchHistory,
				episode: episode,
			});
		} catch (error) {
			console.log(error);
			
			return res.status(500).json({ error: 'Err while get episode.' });
		}
	};

	getCommentsOfEpisode = async (req: Request, res: Response) => {
		try {
			const episodeId = Number(req.params.id);
			
			const page = Number(req.query.page) || 1;
			const pageSize = Number(req.query.pageSize) || 10;

			const comments = await this.episodeService.getCommentsOfEpisode(episodeId, page, pageSize);
			if (!comments) {
				return res.status(404).json({ error: 'Can not find episode.' });
			}
			return res.status(200).json({
				message: "Successful",
				comments : comments
			});
		} catch (error) {
			return res.status(500).json({ error: 'Err while get comment.' });
		}
	}

	createEpisode = async (req: Request, res: Response) => {
		try {
			const newEpisode = await this.episodeService.createEpisode(req);
			return res.status(200).json({
				message: "Successful",
				data: newEpisode
			})
		} catch (error) {
			res.status(500).json({
				message: "Server error"
			})
		}
	}

	updateEpisode = async (req: Request, res: Response) => {
		try {
			const [rowsAffected, updatedEpisode] = await this.episodeService.updateEpisode(req);
			if(rowsAffected==0){
				return res.status(200).json({ error: 'Nothing to updated'});
			}
			if(!updatedEpisode){
				return res.status(404).json({ error: 'Updated episode failed'});
			}
			return res.status(200).json({
				message: "Successful",
				data:{
					rowsAffected: rowsAffected,
					episodeUpdated: updatedEpisode
				}
			});
		} catch (error) {
			res.status(500).json({
				message: "Server error"
			})
		}
	}

	deleteEpisode = async (req: Request, res: Response) => {
		try {
			const rs = await this.episodeService.deleteEpisode(req);
			if(rs){
				return res.status(204).json();
			}else{
				return res.status(404).json({ 
					status: false,
					message: "Delete failed"
				});
			}
		} catch (error) {
			res.status(500).json({
				message: "Server error"
			})	
		}
	}

	getPresignUrlToUploadPosterAndMovie = async (req: Request, res: Response) => {
		try {
			const rs = await await this.episodeService.getPresignUrlToUploadPosterAndMovie(req);
			res.status(200).json({
				message: "Successful",
                data: rs
            });
		} catch (error) {
			console.log(error);
			res.status(500).json({
				message: "Server error"
			})	
		}
	}

	getQuality = async (req: Request, res: Response) => {
		try {
			const userId = req.payload!.userId!;
			if(!userId){
				res.status(404).json({
					message: "fail, please login",
				});	
			}
			const subscriptionTypeId = req.payload!.subscriptionTypeId!;
			if(subscriptionTypeId===1){
				return res.status(403).json({
					message: "Update your subscription to watch movie!"
				});
			}

			if(subscriptionTypeId===2){
				if(req.query.quality?.toString()==='4k')
				return res.status(403).json({
					message: "Update your subscription to watch movie 4k!"
				});
			}

			const rs = await await this.episodeService.getQualityMovie(req);
			res.status(200).json({
				message: "Successful",
                data: rs
            });
		} catch (error) {
			console.log(error);
			res.status(500).json({
				message: "Server error"
			})	
		}
	}

	clearCacheCloudFrontEpisodes = async(req: Request, res: Response) =>{
		try {
			
			await this.episodeService.clearCacheCloudFrontEpisodes(req);
			res.status(200).json({
				message: "successful",
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({
				message: "Server Error!"
			});
		}
	}

	getPresignUrlToUploadQuality = async (req: Request, res: Response) => {
		try {
			const rs = await this.episodeService.getPresignUrlToUploadQuality(req);
			res.status(200).json({
				message: "Successful",
                data: rs
            });
		} catch (error) {
			console.log(error);
			res.status(500).json({
				message: "Server error"
			})	
		}
	}
 
}