import { Duration } from './Duration';
import { Subscription } from './Subscription';
import {
	Model,
	Table,
	Column,
	DataType,
	ForeignKey,
	BelongsTo,
	HasMany,
	DeletedAt,
	HasOne,
} from 'sequelize-typescript';
import { SubscriptionType } from './SubscriptionType';
import { Payment } from './Payment';

@Table({
	tableName: SubscriptionInfo.SUBSCRIPTION_INFO_TABLE_NAME,
	timestamps: true,
	paranoid: true,
})
export class SubscriptionInfo extends Model {
	private static SUBSCRIPTION_INFO_TABLE_NAME = 'subscription_infos' as string;
	private static SUBSCRIPTION_INFO_ID = 'subscription_info_id' as string;
	private static SUBSCRIPTION_INFO_DISCOUNT = 'discount' as string;
	private static SUBSCRIPTION_TYPE_ID = 'subscription_type_id' as string;
	private static DURATION_ID = 'duration_id' as string;

	@Column({
		type: DataType.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		field: SubscriptionInfo.SUBSCRIPTION_INFO_ID,
	})
	subscriptionInfoId!: number;

	@Column({
		type: DataType.FLOAT,
		field: SubscriptionInfo.SUBSCRIPTION_INFO_DISCOUNT,
		allowNull: true,
	})
	discount!: number;

	@ForeignKey(() => SubscriptionType)
	@Column({
		type: DataType.INTEGER(),
		field: SubscriptionInfo.SUBSCRIPTION_TYPE_ID,
	})
	subscriptionTypeId!: number;

	@BelongsTo(() => SubscriptionType)
	subscriptionType!: SubscriptionType;

	@ForeignKey(() => Duration)
	@Column({
		type: DataType.INTEGER(),
		field: SubscriptionInfo.DURATION_ID,
	})
	durationId!: number;

	@BelongsTo(() => Duration)
	duration!: Duration;

	@HasMany(() => Payment)
	payments!: Payment[];

	@DeletedAt
	deletedAt!: Date;
}
