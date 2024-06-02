import { Account } from '../../models/Account';
import { Subscription } from '../../models/Subscription';
import { User } from '../../models/User';
import { BaseInterface } from './BaseInterface';

export interface IUserRepository extends BaseInterface {
	findOneUser(searchConditions: any): Promise<User>;
	findOneUserByUsername(username: string): Promise<User>
	findOneUserByEmail(email: string): Promise<User >
	searchUsers(
		whereConditions: any,
		whereSubTypeCons: any,
		page: number,
		pageSize: number,
		sortField: string,
		sortBy: string
	): Promise<{
		users: User[];
		count: number;
	}>;
	createNewUser(
		newUser: User,
		newAccount: Account,
		newSubscription: Subscription
	): Promise<void>;
}
