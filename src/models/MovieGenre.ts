import {
	Table,
	Column,
	Model,
	ForeignKey,
	DataType,
	DeletedAt,
} from 'sequelize-typescript';
import { Movie } from './Movie';
import { Genre } from './Genre';

@Table({
	tableName: MovieGenre.MOVIEGENRE_TABLE_NAME,
	timestamps: true,
	paranoid: true,
})
export class MovieGenre extends Model {
	private static MOVIEGENRE_TABLE_NAME = 'movie_genres' as string;
	private static MOVIEGENRE_MOVIE_ID = 'movie_id' as string;
	private static MOVIEGENRE_GENRE_ID = 'genre_id' as string;

	@ForeignKey(() => Movie)
	@Column({
		type: DataType.INTEGER(),
		field: MovieGenre.MOVIEGENRE_MOVIE_ID,
	})
	movieId!: number;

	@ForeignKey(() => Genre)
	@Column({
		type: DataType.INTEGER(),
		field: MovieGenre.MOVIEGENRE_GENRE_ID,
	})
	genreId!: number;

	@DeletedAt
	deletedAt!: Date;
}
