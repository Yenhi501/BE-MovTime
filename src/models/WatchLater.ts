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
	tableName: WatchLater.WATCHLATER_TABLE_NAME,
	timestamps: true,
	paranoid: true,
})
export class WatchLater extends Model {
	private static WATCHLATER_TABLE_NAME = 'watch_laters' as string;
	private static WATCHLATER_USER_ID = 'user_id' as string;
	private static WATCHLATER_MOVIE_ID = 'movie_id' as string;

	@ForeignKey(() => User)
	@Column({
		type: DataType.INTEGER(),
		field: WatchLater.WATCHLATER_USER_ID,
	})
	userId!: number;

	@ForeignKey(() => Movie)
	@Column({
		type: DataType.INTEGER(),
		field: WatchLater.WATCHLATER_MOVIE_ID,
	})
	movieId!: number;

	@DeletedAt
	deletedAt!: Date;
}
