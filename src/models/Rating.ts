import {
	Table,
	Column,
	Model,
	ForeignKey,
	DataType,
	DeletedAt,
	BelongsTo,
} from 'sequelize-typescript';
import { User } from './User';
import { Movie } from './Movie';

@Table({
	tableName: Rating.TABLE_NAME,
	timestamps: true,
	paranoid: true,
})
export class Rating extends Model {
	private static TABLE_NAME = 'ratings' as string;
	private static USER_ID = 'user_id' as string;
	private static MOVIE_ID = 'movie_id' as string;
	private static RATING = 'rating' as string;

	@ForeignKey(() => User)
	@Column({
		type: DataType.INTEGER(),
		field: Rating.USER_ID,
	})
	userId!: number;

	@ForeignKey(() => Movie)
	@Column({
		type: DataType.INTEGER(),
		field: Rating.MOVIE_ID,
	})
	movieId!: number;

	@Column({
		type: DataType.FLOAT(),
		field: Rating.RATING,
	})
	rating!: number;

	@DeletedAt
	deletedAt!: Date;

	// @BelongsTo(() => User)
	// user!: User;

	// @BelongsTo(() => Movie)
	// movie!: Movie;
}
