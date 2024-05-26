import {
	Table,
	Column,
	Model,
	ForeignKey,
	DataType,
	DeletedAt,
} from 'sequelize-typescript';
import { Movie } from './Movie';
import { User } from './User';

@Table({
	tableName: MovieFavorite.MOVIEFAVORITE_TABLE_NAME,
	timestamps: true,
	paranoid: true,
})
export class MovieFavorite extends Model {
	private static MOVIEFAVORITE_TABLE_NAME = 'movie_favorites' as string;
	private static WMOVIEFAVORITE_USER_ID = 'user_id' as string;
	private static WMOVIEFAVORITE_MOVIE_ID = 'movie_id' as string;

	@ForeignKey(() => User)
	@Column({
		type: DataType.INTEGER(),
		field: MovieFavorite.WMOVIEFAVORITE_USER_ID,
	})
	userId!: number;

	@ForeignKey(() => Movie)
	@Column({
		type: DataType.INTEGER(),
		field: MovieFavorite.WMOVIEFAVORITE_MOVIE_ID,
	})
	movieId!: number;

	@DeletedAt
	deletedAt!: Date;
}
