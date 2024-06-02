import {
	Table,
	Column,
	Model,
	ForeignKey,
	DataType,
	DeletedAt,
} from 'sequelize-typescript';
import { Movie } from './Movie';
import { Actor } from './Actor';

@Table({
	tableName: MovieActor.MOVIEACTOR_TABLE_NAME,
	timestamps: true,
	paranoid: true,
})
export class MovieActor extends Model {
	private static MOVIEACTOR_TABLE_NAME = 'movie_actors' as string;
	private static MOVIEACTOR_MOVIE_ID = 'movie_id' as string;
	private static MOVIEACTOR_ACTORP_ID = 'actor_id' as string;

	@ForeignKey(() => Movie)
	@Column({
		type: DataType.INTEGER(),
		field: MovieActor.MOVIEACTOR_MOVIE_ID,
	})
	movieId!: number;

	@ForeignKey(() => Actor)
	@Column({
		type: DataType.INTEGER(),
		field: MovieActor.MOVIEACTOR_ACTORP_ID,
	})
	actorId!: number;

	@DeletedAt
	deletedAt!: Date;
}
