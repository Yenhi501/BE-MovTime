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


@Table({
	tableName: Account.ACCOUNT_TABLE_NAME,
	timestamps: true,
	paranoid: true,
})
export class Account extends Model {
	private static ACCOUNT_TABLE_NAME = 'accounts' as string;
	private static ACCOUNT_ID = 'account_id' as string;
	private static ACOUNT_USERNAME = 'username' as string;
	private static ACCOUNT_PASSWORD = 'password' as string;

	@Column({
		type: DataType.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		field: Account.ACCOUNT_ID,
	})
	accountId!: number;

	@Column({
		type: DataType.STRING(100),
		field: Account.ACOUNT_USERNAME,
		unique: true,
		allowNull: false,
	})
	username!: string;

	@Column({
		type: DataType.STRING(100),
		field: Account.ACCOUNT_PASSWORD,
		allowNull: false,
	})
	password!: string;

	// @HasOne(() => User)
	// user!: User;

	@DeletedAt
	deletedAt!: Date;
}
