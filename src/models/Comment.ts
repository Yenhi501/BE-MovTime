import {
	Model,
	Table,
	Column,
	DataType,
	DeletedAt,
	HasMany,
	BelongsTo,
	ForeignKey,
} from 'sequelize-typescript';
import { User } from './User';
import { Episode } from './Episode';
import { SubComment } from './SubComment';

@Table({
	tableName: Comment.TABLE_NAME,
	timestamps: true,
	paranoid: true,
})
export class Comment extends Model {
	private static TABLE_NAME = 'comments' as string;
	private static ID = 'id' as string;
	private static EPISODE_ID = 'episode_id' as string;
	private static USER_ID = 'user_id' as string;
	private static CONTENT = 'content' as string;
	private static NUM_LIKE = 'num_like' as string;

	@Column({
		type: DataType.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		field: Comment.ID,
	})
	id!: number;

	@ForeignKey(() => Episode)
	@Column({
		type: DataType.INTEGER,
		field: Comment.EPISODE_ID,
	})
	episodeId!: number;

	@ForeignKey(() => User)
	@Column({
		type: DataType.INTEGER,
		field: Comment.USER_ID,
	})
	userId!: number;

	@Column({
		type: DataType.TEXT,
		field: Comment.CONTENT,
	})
	content!: string;

	@Column({
		type: DataType.INTEGER,
		field: Comment.NUM_LIKE,
	})
	numLike!: string;

	@DeletedAt
	deletedAt!: Date;

	@HasMany(() => SubComment)
	subcomments!: SubComment[];

	@BelongsTo(() => User)
	user!: User;

	@BelongsTo(() => Episode)
	episode!: Episode;
}
