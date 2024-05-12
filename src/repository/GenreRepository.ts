import { Genre } from '../models/Genre';
import Database from '../config/database';
import { Op, QueryTypes, literal, OrderItem, Sequelize } from 'sequelize';
import Container, { Service } from 'typedi';
import { BaseRepository } from './BaseRepository';
import { IGenreRepository } from './Interfaces/IGenreRepository';

@Service()
export class GenreRepository extends BaseRepository<Genre> implements IGenreRepository {
	
	constructor(){
		super(Genre);
	}

    async updateGenre(genreId: number, name: string): Promise<Genre> {
        try {
            const [rowEffected,genre] = await this.model.update({
                name: name
            }, {
				where: { genreId },
				returning: true, // Return the updated records
			  });
            return genre[0];
        } catch (error) {
            throw(error);
        }
    }

    async createGenre(name: string): Promise<Genre> {
        try {
            return await this.model.create({
                name: name
            });
        } catch (error) {
            throw(error);
        }
    }

    async getAllGenre(): Promise<Genre[]> {
        return await this.model.findAll({
            attributes: ['genre_id', 'name'],
            order: [['genre_id', 'ASC']]
        });
    }
}
