import {
	Model,
	Table,
	Column,
	DataType,
	DeletedAt,
	BelongsTo,
	ForeignKey,
} from 'sequelize-typescript';
import { Episode } from './Episode';

@Table({
	tableName: Quality.HOME_TABLE_NAME,
	timestamps: true,
	paranoid: true,
})
export class Quality extends Model {
	private static HOME_TABLE_NAME = 'qualities' as string;
	private static ID = 'id' as string;
	private static ID_EPISODE = 'episode_id' as string;
	private static VIDEO_QUALITY = 'video_quality' as string;
	private static VIDEO_URL = 'video_url' as string;

	@Column({
		type: DataType.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		field: Quality.ID,
	})
	Id!: number;

	@ForeignKey(() => Episode)
	@Column({
		type: DataType.INTEGER,
		field: Quality.ID_EPISODE,
	})
	episodeId!: number;

	@Column({
		type: DataType.TEXT,
		field: Quality.VIDEO_QUALITY,
	})
	videoQuality!: string;

    @Column({
		type: DataType.TEXT,
		field: Quality.VIDEO_URL,
	})
	videoUrl!: string;

	@DeletedAt
	deletedAt!: Date;

	@BelongsTo(() => Episode)
	episode!: Episode;
}
