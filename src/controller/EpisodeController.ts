import express, { Request, Response, Router } from 'express';
import Container from 'typedi';
import { IMovieService } from '../services/Interfaces/IMovieService';
import { MovieService } from '../services/MovieService';
import { IEpisodeService } from '../services/Interfaces/IEpisodeService';
import { EpisodeService } from '../services/EpisodeService';

export class EpisodeController{
	private episodeService: IEpisodeService;
	private movieService: IMovieService;



	constructor() {
		this.episodeService = Container.get(EpisodeService);
		this.movieService = Container.get(MovieService);

	}

    getEpisode = async (req: Request, res: Response) => {
		const { id } = req.params;
		try {
			
			const episode = await this.episodeService.getEpisode(Number(id));
			const movieId = episode?.getDataValue('movieId');
			const movie = await this.movieService.getMovieById(Number(movieId));

			if (!episode || !movie) {
				return res.status(404).json({ error: 'Can not find episode.' });
			}
			
		} catch (error) {
			console.log(error);
			
			return res.status(500).json({ error: 'Err while get episode.' });
		}
	};

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

	

	
 
}