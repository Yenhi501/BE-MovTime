import { User } from '../models/User';

export class UserDTO {
	userId: number;
	dateOfBirth: Date;
	gender: string;
	email: string;
	avatarURL: string;
	createdAt: string;
	username: string;
	active: boolean;
	role: number;
	subscription: {
		closeAt: Date;
		updatedAt: Date;
		subscriptionType: string | null;
	};

	constructor(user: User) {
		this.userId = user.userId;
		this.dateOfBirth = user.dateOfBirth;
		this.gender = user.gender;
		this.email = user.email;
		this.avatarURL = user.avatarURL;
		this.createdAt = user.createdAt;
		this.active = user.active;
		this.username = user.account.username;
		this.role = user.role;
		this.subscription = {
			closeAt: user.subscription.closeAt,
			updatedAt: user.subscription.updatedAt,
			subscriptionType: user.subscription.subscriptionType.name,
		};
	}

	public static userToUserDTO(user: User): UserDTO {
		return new UserDTO(user);
	}
}
