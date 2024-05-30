import { Request, Response } from 'express';
import Container from 'typedi';
import { GenreService } from '../services/GenreService';
import { IGenreService } from '../services/Interfaces/IGenreService';

export class GenreController{
	private genreService: IGenreService;

	constructor() {
		this.genreService = Container.get(GenreService);
	}

    getAllGenres = async (req: Request, res: Response) => {
		try {
            const genres = await this.genreService.getAllGenres();
			return res.status(200).json(genres);
		} catch (error) {
			return res.status(500).json({ error: 'Err while get genres.' });
		}
	};

	createGenre = async (req: Request, res: Response) => {
		try {
            const newGenre = await this.genreService.createGenre(req);
			if(newGenre){
				return res.status(200).json({
					message: "successful",
					data: newGenre
				});
			}else{
				return res.status(404).json({
					message: "failed",
				});
			}
		} catch (error) {
			return res.status(500).json({ error: 'Server Error!' });
		}
	};

	updateGenre = async (req: Request, res: Response) => {
		try {
            const updateGenre = await this.genreService.updateGenre(req);
			if(updateGenre){
				return res.status(200).json({
					message: "successful",
					data: updateGenre
				});
			}else{
				return res.status(404).json({
					message: "failed to updated",
				});
			}

		} catch (error) {
			return res.status(500).json({ error: 'Server Error!.' });
		}
	};

	deleteGenre = async (req: Request, res: Response) => {
		try {
			const rs = await this.genreService.deleteGenre(req);
			if(rs){
				return res.status(204).json();
			}else{
				return res.status(404).json({ 
					status: false,
					message: "Delete failed"
				});
			}
		} catch (error) {
			return res.status(500).json({ error: 'Server Error!' });
		}
	};

}