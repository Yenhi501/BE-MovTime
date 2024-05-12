import {
	Model,
	Table,
	Column,
	DataType,
	BelongsToMany,
	DeletedAt,
} from 'sequelize-typescript';
import { Movie } from './Movie';
import { MovieGenre } from './MovieGenre';

@Table({
	tableName: Genre.GENRE_TABLE_NAME,
	timestamps: true,
	paranoid: true,
})
export class Genre extends Model {
	private static GENRE_TABLE_NAME = 'genres' as string;
	private static GENRE_ID = 'genre_id' as string;
	private static GENRE_NAME = 'name' as string;

	@Column({
		type: DataType.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		field: Genre.GENRE_ID,
	})
	genreId!: number;

	@Column({
		type: DataType.STRING(100),
		field: Genre.GENRE_NAME,
	})
	name!: string;

	@DeletedAt
	deletedAt!: Date;

	@BelongsToMany(() => Movie, () => MovieGenre)
	movies!: Movie[];
}
