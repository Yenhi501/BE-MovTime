import { Genre } from "../../models/Genre";
import { Home } from "../../models/Home";
import { Movie } from "../../models/Movie";

export interface IHomeService {
	getMoviesByGenre(page: number, pageSize: number):Promise<Genre[]>;
	getHomePoster(): Promise<Home[]>;
	getMoviesOfGenre(genreId: number ,page: number, pageSize: number, sortMovie?: string):Promise<Genre[]>;
}
