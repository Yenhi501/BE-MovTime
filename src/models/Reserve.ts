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
	tableName: Reserve.TABLE_NAME,
	timestamps: true,
	paranoid: true,
})
export class Reserve extends Model {
	private static TABLE_NAME = 'reserves' as string;
	private static USER_ID = 'user_id' as string;
	private static MOVIE_ID = 'movie_id' as string;

	@ForeignKey(() => User)
	@Column({
		type: DataType.INTEGER(),
		field: Reserve.USER_ID,
	})
	userId!: number;

	@ForeignKey(() => Movie)
	@Column({
		type: DataType.INTEGER(),
		field: Reserve.MOVIE_ID,
	})
	movieId!: number;

	@DeletedAt
	deletedAt!: Date;
}
