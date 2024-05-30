import { Inject, Service } from 'typedi';
import { S3Service } from './S3Service';
import { IGenreService } from './Interfaces/IGenreService';
import { GenreRepository } from '../repository/GenreRepository';
import { IGenreRepository } from '../repository/Interfaces/IGenreRepository';
import { Genre } from '../models/Genre';
import { Request } from 'express';

@Service()
export class GenreService implements IGenreService {
	@Inject(() => GenreRepository)
	private genreRepository!: IGenreRepository;

	@Inject(() => S3Service)
	private s3Service!: S3Service;

    async getAllGenres(): Promise<Genre[]> {
        try {
           return await this.genreRepository.getAllGenre();
        } catch (error) {
            console.log(error);
            throw new Error('Can not get genres.');
        }
    }

    async createGenre(req: Request): Promise<Genre> {
        try {
            const name = req.body.name;
            const genre = await this.genreRepository.findByCondition({
                name: name
            });
          
            if(genre.length !==0){
                return genre;
            }
            return await this.genreRepository.createGenre(name);
        } catch (error) {
            throw(error);
        }
    }
    async updateGenre(req: Request): Promise<Genre> {
        try {
            const name = req.body.name;
            const genreId = Number(req.params.genreId);
            return await this.genreRepository.updateGenre(genreId, name);
        } catch (error) {
            throw(error);
        }
    }
    async deleteGenre(req: Request): Promise<boolean> {
        try {
            const genreId =  Number(req.params.genreId);
            const genre = await this.genreRepository.findById(genreId);
            if (!genre) {
                return false;
            }
            await this.genreRepository.delete(genre);
            return true;
        } catch (error) {
            throw(error);
        }
    }
}