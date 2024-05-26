import { Account } from './Account';
import {
	Model,
	Table,
	Column,
	DataType,
	BelongsToMany,
	HasMany,
	HasOne,
	ForeignKey,
	DeletedAt,
	BelongsTo,
	BeforeDestroy,
	AfterDestroy,
} from 'sequelize-typescript';
import { Movie } from './Movie';
import { MovieFavorite } from './MovieFavorite';
import { WatchHistory } from './WatchHistory';
import { WatchLater } from './WatchLater';
import { Subscription } from './Subscription';
import { Episode } from './Episode';
import { Payment } from './Payment';
import { SubComment } from './SubComment';
import { Comment } from './Comment';
import { Rating } from './Rating';
import { Reserve } from './Reserve';

@Table({
	tableName: User.USER_TABLE_NAME,
	timestamps: true,
	paranoid: true,
})
export class User extends Model {
	private static USER_TABLE_NAME = 'users' as string;
	private static USER_ID = 'user_id' as string;
	private static USER_DATE_OF_BIRTH = 'date_of_birth' as string;
	private static USER_GENDER = 'gender' as string;
	private static USER_EMAIL = 'email' as string;
	private static USER_ACTIVE = 'active' as string;
	private static USER_ROLE = 'role' as string;
	private static USER_AVATAR_URL = 'avatar_url' as string;
	private static USER_ACCOUNT_ID = 'account_id' as string;
	private static USER_SUBSCIRPTION_ID = 'subscription_id' as string;

	@Column({
		type: DataType.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		field: User.USER_ID,
	})
	userId!: number;

	@Column({
		type: DataType.DATE(),
		field: User.USER_DATE_OF_BIRTH,
	})
	dateOfBirth!: Date;

	@Column({
		type: DataType.STRING(10),
		field: User.USER_GENDER,
	})
	gender!: string;

	@Column({
		type: DataType.STRING(328),
		field: User.USER_EMAIL,
		unique: true,
	})
	email!: string;

	@Column({
		type: DataType.BOOLEAN,
		field: User.USER_ACTIVE,
		defaultValue: false,
	})
	active!: boolean;

	@Column({
		type: DataType.INTEGER,
		field: User.USER_ROLE,
		defaultValue: 2,
	})
	role!: number;

	@Column({
		type: DataType.STRING(),
		field: User.USER_AVATAR_URL,
		defaultValue: 'default/user/avatar_default.jpg',
	})
	avatarURL!: string;

	@ForeignKey(() => Subscription)
	@Column({
		type: DataType.INTEGER,
		field: User.USER_SUBSCIRPTION_ID,
		unique: true,
	})
	subscriptionId!: number;

	@BelongsTo(() => Subscription)
	subscription!: Subscription;

	@ForeignKey(() => Account)
	@Column({
		type: DataType.INTEGER,
		field: User.USER_ACCOUNT_ID,
		unique: true,
	})
	accountId!: number;

	@BelongsTo(() => Account)
	account!: Account;

	@BelongsToMany(() => Movie, {
		through: () => MovieFavorite,
		as: 'movieFavoriteList',
	})
	movieFavoriteList!: Movie[];

	@BelongsToMany(() => Episode, {
		through: () => WatchHistory,
		as: 'watchHistoryList',
	})
	watchHistoryList!: Episode[];

	@BelongsToMany(() => Movie, {
		through: () => Reserve,
		as: 'reserveList',
	})
	reserveList!: Movie[];

	@BelongsToMany(() => Movie, {
		through: () => WatchLater,
		as: 'watchLaterList',
	})
	watchLaterList!: Movie[];

	@HasMany(() => Payment)
	payments!: Payment[];

	@BelongsToMany(() => Movie, {
		through: () => Rating,
		as: 'ratings',
	})
	ratings!: Rating[];

	@DeletedAt
	deletedAt!: Date;

	@HasMany(() => SubComment)
	subcomments!: SubComment[];

	@HasMany(() => Comment)
	comments!: Comment[];


	@BeforeDestroy
	static async beforeDestroyHook(user: User) {
		await MovieFavorite.destroy({ where: { userId: user.userId }, force: true });
		await WatchHistory.destroy({ where: { userId: user.userId }, force: true });
		await Reserve.destroy({ where: { userId: user.userId }, force: true });
		await WatchLater.destroy({ where: { userId: user.userId }, force: true });
		await Payment.destroy({ where: { userId: user.userId }, force: true });
		await Rating.destroy({ where: { userId: user.userId }, force: true });
		await SubComment.destroy({ where: { userId: user.userId }, force: true });
		await Comment.destroy({ where: { userId: user.userId }, force: true });
	}
	
	@AfterDestroy
		static async afterDestroyHook(user: User) {
		if (user.accountId) {
			await Account.destroy({ where: { accountId: user.accountId }, force: true });
		}
		if (user.subscriptionId) {
			await Subscription.destroy({ where: { subscriptionId: user.subscriptionId }, force: true });
		}
	}
}
