import { MovieFavorite } from './../models/MovieFavorite';
import { User } from '../models/User';
import { Movie } from '../models/Movie';
import { Genre } from '../models/Genre';
import { Episode } from '../models/Episode';

export class MovieDTO {
	userId: number;
	ListMovie: MovieItem[] | null;

	constructor(user: User, type: string) {
		this.userId = user.userId;
		this.ListMovie = MovieItem.sortMoviesByUpdatedAt(
			MovieItem.movieListToMovieItemList(user, type)
		);
	}

	public static movieToMovieDTO(user: User, type: string): MovieDTO {
		return new MovieDTO(user, type);
	}
}

export class MovieItem {
	id!: number;
	movieId!: number;
	title!: string;
	movieTitle!: string;
	posterURL!: string;
	posterMovieURL!: string;
	backgroundMovieURL!: string;
	averageRating!: string;
	episodeNum!: number;
	level: number;
	numFavorite!: number;
	genres: Genre[] | null;
	duration!: number | null;
	updatedAt: Date;

	constructor(
		movie: Movie,
		updatedAt: Date,
		episode: Episode | null = null,
		duration: number | null = null
	) {
		if (episode === null) {
			this.id = movie.movieId;
			this.title = movie.title;
			this.posterURL = movie.posterURL;
			this.backgroundMovieURL = movie.backgroundURL;
			this.averageRating = movie.averageRating;
			this.episodeNum = movie.episodeNum;
			this.numFavorite = movie.numFavorite;
		} else {
			this.id = episode.episodeId;
			this.movieId = episode.movie.movieId;
			this.posterMovieURL = episode.movie.posterURL;
			this.backgroundMovieURL = episode.movie.backgroundURL;
			this.title = episode.title;
			this.movieTitle = episode.movie.title;
			this.posterURL = episode.posterURL;
			this.duration = duration;
		}
		this.level = movie.level;
		this.genres = movie.genres;
		this.updatedAt = updatedAt;
	}

	public static movieListToMovieItemList(
		user: User,
		type: string
	): MovieItem[] {
		const movieItemList: MovieItem[] = [];
		let user_movie_list: any[] = [];
		if (type === 'MovieFavorite') {
			user_movie_list = user.movieFavoriteList;
		} else if (type === 'WatchHistory') {
			for (const episode of user.watchHistoryList) {
				const episodeJson = episode.toJSON();
				const movieItem = new MovieItem(
					episodeJson.movie,
					episodeJson[type]?.updatedAt,
					episodeJson,
					episodeJson[type]?.duration!
				);
				movieItemList.push(movieItem);
			}
			return movieItemList;
		} else if (type === 'WatchLater') {
			user_movie_list = user.watchLaterList;
		}
		for (const movie of user_movie_list) {
			const movieJson = movie.toJSON();
			const movieItem = new MovieItem(movie, movieJson[type]?.updatedAt);
			movieItemList.push(movieItem);
		}

		return movieItemList;
	}

	public static sortMoviesByUpdatedAt(movies: MovieItem[]): MovieItem[] {
		return movies.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
	}
}
