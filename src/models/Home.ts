import {
	Model,
	Table,
	Column,
	DataType,
	BelongsToMany,
	DeletedAt,
    HasOne,
    BelongsTo,
    ForeignKey,
} from 'sequelize-typescript';
import { Movie } from './Movie';

@Table({
	tableName: Home.HOME_TABLE_NAME,
	timestamps: true,
	paranoid: true,
})
export class Home extends Model {
	private static HOME_TABLE_NAME = 'home' as string;
	private static ID = 'id' as string;
	private static ID_MOVIE = 'id_movie' as string;
	private static REMOVE_BG = 'rm_background' as string;


	@Column({
		type: DataType.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		field: Home.ID,
	})
	Id!: number;

	@ForeignKey(() => Movie)
	@Column({
		type: DataType.INTEGER,
		field: Home.ID_MOVIE,
	})
	movieId!: number;

	@Column({
		type: DataType.TEXT,
		field: Home.REMOVE_BG,
	})
	rmBackground!: string;

	@DeletedAt
	deletedAt!: Date;
	
    @BelongsTo(() => Movie)
	movie!: Movie;
}
