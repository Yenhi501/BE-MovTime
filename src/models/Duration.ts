import { Subscription } from './Subscription';
import {
	Model,
	Table,
	Column,
	DataType,
	DeletedAt,
	HasMany,
} from 'sequelize-typescript';
import { SubscriptionInfo } from './SubscriptionInfo';

@Table({
	tableName: Duration.DURATION_TABLE_NAME,
	timestamps: true,
	paranoid: true,
})
export class Duration extends Model {
	private static DURATION_TABLE_NAME = 'durations' as string;
	private static DURATION_ID = 'duration_id' as string;
	private static DURATION_TIME = 'time' as string;

	@Column({
		type: DataType.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		field: Duration.DURATION_ID,
	})
	durationId!: number;

	@Column({
		type: DataType.INTEGER,
		field: Duration.DURATION_TIME,
		allowNull: true,
	})
	time!: number;

	@HasMany(() => SubscriptionInfo)
	SubscriptionInfos!: SubscriptionInfo[];

	@DeletedAt
	deletedAt!: Date;
}
