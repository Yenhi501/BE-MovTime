import {
	Model,
	Table,
	Column,
	DataType,
	BelongsToMany,
	BelongsTo,
	ForeignKey,
	DeletedAt,
	HasOne,
} from 'sequelize-typescript';
import { User } from './User';
import { SubscriptionType } from './SubscriptionType';
import { SubscriptionInfo } from './SubscriptionInfo';

@Table({
	tableName: Payment.PAYMENT_TABLE_NAME,
	timestamps: true,
	paranoid: true,
})
export class Payment extends Model {
	private static PAYMENT_TABLE_NAME = 'payments' as string;
	private static PAYMENT_ID = 'payment_id' as string;
	private static PAYMENT_USER_ID = 'user_id' as string;
	private static PAYMENT_TYPE = 'payment_type' as string;
	private static PAYMENT_PRICE = 'price' as string;
	private static PAYMENT_ORDER_INFO = 'order_info' as string;
	private static PAYMENT_TRANSACTION_ID = 'transaction_id' as string;
	private static PAYMENT_STATUS = 'status' as string;
	private static PAYMENT_ISPAYMENT = 'is_payment' as string;
	private static PAYMENT_SUBSCRIPTION_INFO_ID =
		'subscription_info_id' as string;

	@Column({
		type: DataType.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		field: Payment.PAYMENT_ID,
	})
	paymentId!: number;

	@Column({
		type: DataType.STRING(100),
		field: Payment.PAYMENT_TYPE,
		allowNull: false,
	})
	type!: string;

	@Column({
		type: DataType.FLOAT,
		field: Payment.PAYMENT_PRICE,
		allowNull: false,
	})
	price!: number;

	@Column({
		type: DataType.TEXT,
		field: Payment.PAYMENT_ORDER_INFO,
		allowNull: true,
	})
	orderInfo!: string;

	@Column({
		type: DataType.TEXT,
		field: Payment.PAYMENT_TRANSACTION_ID,
		allowNull: false,
	})
	transactionId!: string;

	@Column({
		type: DataType.STRING(100),
		field: Payment.PAYMENT_STATUS,
		allowNull: false,
	})
	status!: string;

	@Column({
		type: DataType.BOOLEAN,
		field: Payment.PAYMENT_ISPAYMENT,
		allowNull: false,
	})
	isPayment!: boolean;

	@ForeignKey(() => User)
	@Column({
		type: DataType.INTEGER,
		field: Payment.PAYMENT_USER_ID,
		allowNull: false,
	})
	userId!: number;

	@BelongsTo(() => User)
	user!: User;

	@ForeignKey(() => SubscriptionInfo)
	@Column({
		type: DataType.INTEGER,
		field: Payment.PAYMENT_SUBSCRIPTION_INFO_ID,
		allowNull: false,
	})
	subscriptionInfoId!: number;

	@BelongsTo(() => SubscriptionInfo)
	subscriptionInfo!: SubscriptionInfo;

	@DeletedAt
	deletedAt!: Date;
}
