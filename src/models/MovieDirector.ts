import {
	Model,
	Column,
	Table,
	ForeignKey,
	DataType,
	DeletedAt,
} from 'sequelize-typescript';
import { Movie } from './Movie';
import { Director } from './Director';

@Table({
	tableName: MovieDirector.TABLE_NAME,
	timestamps: true,
	paranoid: true,
})
export class MovieDirector extends Model {
	private static TABLE_NAME = 'movie_directors' as string;
	private static MOVIE_ID = 'movie_id' as string;
	private static DIRECTOR_ID = 'director_id' as string;

	@ForeignKey(() => Movie)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
		field: MovieDirector.MOVIE_ID,
	})
	movieID!: number;

	@ForeignKey(() => Director)
	@Column({
		type: DataType.INTEGER,
		allowNull: false,
		field: MovieDirector.DIRECTOR_ID,
	})
	directorID!: number;

	@DeletedAt
	deletedAt!: Date;
}
