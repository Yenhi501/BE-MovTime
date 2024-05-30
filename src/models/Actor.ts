import {
	BelongsToMany,
	Column,
	DataType,
	DeletedAt,
	Model,
	Table,
} from 'sequelize-typescript';
import { Movie } from './Movie';
import { MovieActor } from './MovieActor';

@Table({
	tableName: Actor.ACTOR_TABLE_NAME,
	timestamps: true,
	paranoid: true,
})
export class Actor extends Model {
	private static ACTOR_TABLE_NAME = 'actors' as string;
	private static ACTOR_ID = 'actor_id' as string;
	private static ACTOR_NAME = 'name' as string;
	private static ACTOR_DESCRIPTION = 'description' as string;
	private static ACTOR_GENDER = 'gender' as string;
	private static ACTOR_DATE_OF_BIRTH = 'date_of_birth' as string;
	private static ACTOR_AVARTAR_URL = 'avatar' as string;
	private static ACTOR_POSTER_URL = 'poster' as string;

	@Column({
		type: DataType.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		field: Actor.ACTOR_ID,
	})
	actorId!: number;

	@Column({
		type: DataType.STRING(100),
		field: Actor.ACTOR_NAME,
	})
	name!: string;

	@Column({
		type: DataType.STRING(10),
		field: Actor.ACTOR_GENDER,
	})
	gender!: string;

	@Column({
		type: DataType.DATE,
		field: Actor.ACTOR_DATE_OF_BIRTH,
	})
	dateOfBirth!: Date;

	@Column({
		type: DataType.TEXT,
		field: Actor.ACTOR_DESCRIPTION,
	})
	description!: string;

	@Column({
		type: DataType.TEXT,
		field: Actor.ACTOR_AVARTAR_URL,
	})
	avatar!: string;

	@Column({
		type: DataType.TEXT,
		field: Actor.ACTOR_POSTER_URL,
	})
	poster!: string;

	@DeletedAt
	deletedAt!: Date;

	@BelongsToMany(() => Movie, () => MovieActor)
	movies!: Movie[];
}
