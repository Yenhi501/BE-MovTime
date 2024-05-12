import { Genre } from '../../models/Genre';
import { Movie } from '../../models/Movie';
import { BaseInterface } from './BaseInterface';

export interface IGenreRepository extends BaseInterface {

	getAllGenre(): Promise<Genre[]>;
	createGenre(name: string): Promise<Genre> ;
    updateGenre(genreId: number, name: string): Promise<Genre>;
}
