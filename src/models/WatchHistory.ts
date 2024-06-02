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
import { Episode } from './Episode';

@Table({
	tableName: WatchHistory.WATCHHISTORY_TABLE_NAME,
	timestamps: true,
	paranoid: true,
})
export class WatchHistory extends Model {
	private static WATCHHISTORY_TABLE_NAME = 'watch_histories' as string;
	private static WATCHHISTORY_USER_ID = 'user_id' as string;
	private static WATCHHISTORY_EPISODE_ID = 'episode_id' as string;
	private static WATCHHISTORY_DURATION = 'duration' as string;

	@ForeignKey(() => User)
	@Column({
		type: DataType.INTEGER(),
		field: WatchHistory.WATCHHISTORY_USER_ID,
	})
	userId!: number;

	@ForeignKey(() => Episode)
	@Column({
		type: DataType.INTEGER(),
		field: WatchHistory.WATCHHISTORY_EPISODE_ID,
	})
	episodeId!: number;

	@Column({
		type: DataType.INTEGER(),
		field: WatchHistory.WATCHHISTORY_DURATION,
	})
	duration!: number;

	@DeletedAt
	deletedAt!: Date;
}
