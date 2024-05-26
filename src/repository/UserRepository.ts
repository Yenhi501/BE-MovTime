import { Subscription } from '../models/Subscription';
import { User } from '../models/User';
import { Account } from '../models/Account';
import { Op } from 'sequelize';
import { IUserRepository } from './Interfaces/IUserRepository';
import { BaseRepository } from './BaseRepository';
import { Service } from 'typedi';
import { SubscriptionType } from '../models/SubscriptionType';

@Service()
export class UserRepository
	extends BaseRepository<User>
	implements IUserRepository
{
	constructor() {
		super(User);
	}
	async findOneUser(searchConditions: any): Promise<User> {
		const { username, email, userId } = searchConditions;
		let user_name: string;
		const whereConditions: { [key: string]: any } = {};

		if (email) {
			whereConditions.email = {
				[Op.eq]: email,
			};
		}

		if (username) {
			user_name = username;
		} else {
			user_name = '';
		}

		if (userId) {
			whereConditions.user_id = {
				[Op.eq]: userId,
			};
		}

		const user = await User.findOne({
			where: whereConditions,
			include: [
				{
					model: Account,
					// attributes: ['account_id', 'username', 'password'],
					where: {
						username: {
							[Op.like]: `%${user_name}%`,
						},
					},
				},
				{
					model: Subscription,
					// attributes: ['closeAt'],
					include: [
						{
							model: SubscriptionType,
							attributes: ['subscription_type_id', 'name', 'price'],
						},
					],
				},
			],
		});
		return user!;
	}

		async findOneUserByUsername(username: string): Promise<User> {
		const user = await User.findOne({
			include: [
				{
					model: Account,
					where: {
						username: {
							[Op.eq]: username,
						},
					},
				},
				{
					model: Subscription,
					// attributes: ['closeAt'],
					include: [
						{
							model: SubscriptionType,
							attributes: ['subscription_type_id', 'name'],
						},
					],
				},
			],
		});
		return user!;
	}

	async findOneUserByEmail(email: string): Promise<User > {
	const user = await User.findOne({
		where: { email: email },
		include: [
		{
			model: Account,
		},
		{
			model: Subscription,
			include: [
			{
				model: SubscriptionType,
				attributes: ['subscription_type_id', 'name'],
			},
			],
		},
		],
	});

	return user! ;
	}

	async createNewUser(
		newUser: User,
		newAccount: Account,
		newSubscription: Subscription
	): Promise<void> {
		const t = await this.db.sequelize!.transaction();

		try {
			const account = await newAccount.save({ transaction: t });
			const subscription = await newSubscription.save({ transaction: t });
			newUser.accountId = account.accountId;
			newUser.subscriptionId = subscription.subscriptionId;
			await newUser.save({ transaction: t });
			await t.commit(); // Lưu giao dịch nếu không có lỗi
		} catch (error: any) {
			// console.error(error);

			await t.rollback(); // Rollback giao dịch nếu có lỗi
			throw new Error('Không thể tạo mới người dùng ' + error.message);
		}
	}

	async searchUsers(
		whereConditions: any,
		whereSubTypeCons: any,
		page: number,
		pageSize: number,
		sortField: string,
		sortBy: string
	): Promise<{
		users: User[];
		count: number;
	}> {
		try {

			const { rows: users, count } = await User.findAndCountAll({
				where: whereConditions,
				offset: (page - 1) * pageSize,
				limit: pageSize,
				include: [
					{
						model: Account,
						attributes: ['username'],
						required: true,
					},
					{
						model: Subscription,
						attributes: {
							exclude: ['createdAt', 'updatedAt', 'deletedAt'],
						},
						required: true,
						...(Object.keys(whereSubTypeCons).length > 0
							? { where: whereSubTypeCons }
							: {}),
						include: [
							{
								model: SubscriptionType,
								attributes: ['name'],
							},
						],
					},
				],
				order: [[`${sortField}`, `${sortBy}`]],
			});
			return { users, count };
		} catch (error: any) {
			throw new Error('Không thể lấy danh sách user ' + error.message);
		}
	}
}
