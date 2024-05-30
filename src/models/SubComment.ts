import {
	Model,
	Table,
	Column,
	DataType,
	DeletedAt,
	BelongsTo,
	ForeignKey,
} from 'sequelize-typescript';
import { Comment } from './Comment';
import { User } from './User';

@Table({
	tableName: SubComment.TABLE_NAME,
	timestamps: true,
	paranoid: true,
})
export class SubComment extends Model {
	private static TABLE_NAME = 'sub_comments' as string;
	private static ID = 'id' as string;
	private static PARENT_ID = 'parent_id' as string;
	private static USER_ID = 'user_id' as string;
	private static CONTENT = 'content' as string;
	private static NUM_LIKE = 'num_like' as string;

	@Column({
		type: DataType.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		field: SubComment.ID,
	})
	id!: number;

	@ForeignKey(() => Comment)
	@Column({
		type: DataType.INTEGER,
		field: SubComment.PARENT_ID,
	})
	parentId!: number;

	@ForeignKey(() => User)
	@Column({
		type: DataType.INTEGER,
		field: SubComment.USER_ID,
	})
	userId!: number;

	@Column({
		type: DataType.TEXT,
		field: SubComment.CONTENT,
	})
	content!: string;

	@Column({
		type: DataType.INTEGER,
		field: SubComment.NUM_LIKE,
	})
	numLike!: string;

	@DeletedAt
	deletedAt!: Date;

	@BelongsTo(() => Comment)
	comment!: Comment;

	@BelongsTo(() => User)
	user!: User;
}
