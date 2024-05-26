import { Genre } from '../../models/Genre';
import { Home } from '../../models/Home';
import { Movie } from '../../models/Movie';

export interface IHomeRepository {
	getHomePoster(): Promise<Home[]>;
	getMoviesByGenre(page: number, pageSize: number): Promise<Genre[]>;
	getMoviesOfGenre(genreId: number ,page: number, pageSize: number): Promise<Genre[]>;
}
