import {
	Model,
	Column,
	Table,
	DataType,
	BelongsToMany,
	DeletedAt,
} from 'sequelize-typescript';
import { Movie } from './Movie';
import { MovieDirector } from './MovieDirector';

@Table({
	tableName: Director.TABLE_NAME,
	timestamps: true,
	paranoid: true,
})
export class Director extends Model {
	private static TABLE_NAME = 'directors' as string;
	private static DIRECTOR_ID = 'director_id' as string;
	private static DIRECTOR_NAME = 'name' as string;
	private static DIRECTOR_DESCRIPTION = 'description' as string;
	private static DIRECTOR_GENDER = 'gender' as string;
	private static DIRECTOR_DATE_OF_BIRTH = 'date_of_birth' as string;
	private static DIRECTOR_AVARTAR_URL = 'avatar' as string;
	private static DIRECTOR_POSTER_URL = 'poster' as string;

	@Column({
		type: DataType.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		field: Director.DIRECTOR_ID,
	})
	directorId!: number;

	@Column({
		type: DataType.STRING(50),
		allowNull: false,
		field: Director.DIRECTOR_NAME,
	})
	name!: string;

	@Column({
		type: DataType.STRING(10),
		field: Director.DIRECTOR_GENDER,
	})
	gender!: string;

	@Column({
		type: DataType.DATE,
		field: Director.DIRECTOR_DATE_OF_BIRTH,
	})
	dateOfBirth!: Date;

	@Column({
		type: DataType.TEXT,
		field: Director.DIRECTOR_DESCRIPTION,
	})
	description!: string;

	@Column({
		type: DataType.TEXT,
		field: Director.DIRECTOR_AVARTAR_URL,
	})
	avatar!: string;

	@Column({
		type: DataType.TEXT,
		field: Director.DIRECTOR_POSTER_URL,
	})
	poster!: string;

	@DeletedAt
	deletedAt!: Date;

	@BelongsToMany(() => Movie, () => MovieDirector)
	movies!: Movie[];
}
