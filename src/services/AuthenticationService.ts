import { AccountRepository } from './../repository/AccountRepository';
import { User } from '../models/User';
import { Account } from '../models/Account';
import Authentication from '../utils/Authentication';
import { UserRepository } from '../repository/UserRepository';
import { IAuthenticationService } from './Interfaces/IAuthenticationService';
import Container, { Inject, Service } from 'typedi';
import { IUserRepository } from '../repository/Interfaces/IUserRepository';
import { Subscription } from '../models/Subscription';
import Mail from '../utils/Mail';
import { Token } from '../utils/Token';
import {
	ContentNotFound,
	CustomError,
	EmailValidDuplicate,
	InvalidUserNameOrPassword,
	NotActiveAccountError,
	NotEnoughAuthority,
	OldPasswordError,
	ServerError,
	UsernameValidDuplicate,
	handleErrorFunction,
} from '../error/CustomErrors';
import { IAccountRepository } from '../repository/Interfaces/IAccountRepository';

@Service()
export class AuthenticationService implements IAuthenticationService {
	@Inject(() => UserRepository)
	private userRepository!: IUserRepository;

	@Inject(() => AccountRepository)
	private accountRepository!: IAccountRepository;

	@Inject(() => Mail)
	private mail!: Mail;

	@Inject(() => Token)
	private token!: Token;

	login = async (loginIdentifier: string, password: string): Promise<any> => {
		try {
			let user = await this.userRepository.findOneUserByUsername(loginIdentifier);

			if (!user) {
				user = await this.userRepository.findOneUserByEmail(loginIdentifier);
				if(!user){
					throw new InvalidUserNameOrPassword('Invalid username/email or password');
				}
			}
			// check password
			let compare = await Authentication.passwordCompare(
				password,
				user.account.password
			);

			// generate token
			if (compare) {
				if (!user.active) {
					throw new NotActiveAccountError('Account is not active');
				}
				return {
					accessToken: Authentication.generateAccessToken(
						user.userId,
						user.role,
						user.account.username,
						user.subscription.subscriptionTypeId
					),
					refreshToken: Authentication.generateRefreshToken(
						user.account.username
					),
				};
			} else {
				throw new InvalidUserNameOrPassword('Invalid username/email or password');
			}
		} catch (error: any) {
			handleErrorFunction(error);
		}
	};

	loginAdmin= async (username: string, password: string): Promise<any> => {
		try {
			const searchConditions = {
				username,
			};
			const user = await this.userRepository.findOneUser(searchConditions);

			if (!user) {
				throw new InvalidUserNameOrPassword('Invalid username or password');
			}

			if(user.role!==0 && user.role!==1){
				throw new NotEnoughAuthority("No Permission")
			}
			// check password
			let compare = await Authentication.passwordCompare(
				password,
				user.account.password
			);

			// generate token
			if (compare) {
				if (!user.active) {
					throw new NotActiveAccountError('Account is not active');
				}
				return {
					accessToken: Authentication.generateAccessToken(
						user.userId,
						user.role,
						user.account.username,
						user.subscription.subscriptionTypeId
					),
					refreshToken: Authentication.generateRefreshToken(
						user.account.username
					),
				};
			} else {
				throw new InvalidUserNameOrPassword('Invalid username or password');
			}
		} catch (error: any) {
			handleErrorFunction(error);
		}
	};

	register = async (
		email: string,
		dateOfBirth: Date,
		gender: string,
		username: string,
		password: string,
		isAdmin: boolean = false
	) => {
		try {
			if (await this.checkUsername(username)) {
				throw new UsernameValidDuplicate('Invalid Username');
			}
			if (await this.checkEmail(email)) {
				throw new EmailValidDuplicate('Invalid Email');
			}
			const hashedPassword: string = await Authentication.passwordHash(
				password
			);
			const newSubscription = Subscription.build();
			const newAccount = Account.build({
				username: username,
				password: hashedPassword,
			});
			const newUser = User.build({
				email: email,
				dateOfBirth: dateOfBirth,
				gender: gender,
			});
			if (isAdmin) {
				newUser.role = 1;
			}
			newUser.account = newAccount;
			newUser.subscription = newSubscription;
			await this.userRepository.createNewUser(
				newUser,
				newAccount,
				newSubscription
			);
			return 'Create user successfully';
		} catch (error: any) {
			handleErrorFunction(error);
		}
	};

	forgotPassword = async (
		email: string | null,
		token: string | null = null,
		password: string | null = null
	) => {
		try {
			const searchConditions = {
				email,
			};
			if (token == null && email) {
				const user = await this.userRepository.findOneUser(searchConditions);
				await this.mail.forgotPassword(
					user.account.username,
					user.email,
					await this.token.generateToken(email)
				);
				return 'Hãy kiểm tra email';
			} else if (token) {
				const data = await this.token.verifyToken(token);
				if (data != null && password) {
					const account = (
						await this.userRepository.findOneUser(searchConditions)
					).account;
					const hashedPassword: string = await Authentication.passwordHash(
						password
					);
					account.update({ password: hashedPassword });
					await this.accountRepository.save(account);
					return 'Thành công';
				} else {
					return 'Token hết hiệu lực hoặc không tồn tại';
				}
			}
		} catch (error: any) {
			handleErrorFunction(error);
		}
	};

	changePassword = async (
		userId: number,
		oldPassword: string,
		newPassword: string
	) => {
		try {
			const searchConditions = {
				userId,
			};
			const user = await this.userRepository.findOneUser(searchConditions);

			if (!user) {
				throw new Error('Bad Request!');
			}
			// check password
			const compare = await Authentication.passwordCompare(
				oldPassword,
				user.account.password
			);
			if (compare) {
				let account = user.account;
				const hashedPassword: string = await Authentication.passwordHash(
					newPassword
				);
				account.update({ password: hashedPassword });
				return await this.accountRepository.save(account);
			} else {
				throw new OldPasswordError('Wrong old password');
			}
		} catch (error: any) {
			handleErrorFunction(error);
		}
	};

	activeUser = async (identifier: string, token: string | null = null) => {
		try {
			if (token == null) {
				let user = await this.userRepository.findOneUserByEmail(identifier);
				if(!user){
					user = await this.userRepository.findOneUserByUsername(identifier);
					if(!user){
						throw new ContentNotFound("User does not exist")
					}
				}
				await this.mail.activeUser(
					user.account.username,
					user.email,
					await this.token.generateToken(user.email)
				);
				return 'Hãy kiểm tra email';
			} else {
				const data = await this.token.verifyToken(token);
				if (data != null && data?.email == identifier) {
					const user = await this.userRepository.findOneUserByEmail(identifier);
					user.update({ active: true });
					await this.userRepository.save(user);
					return 'Thành công';
				} else {
					return 'Token hoặc email không tồn tại';
				}
			}
		} catch (error: any) {
			handleErrorFunction(error);
		}
	};

	getAccessTokenByRefreshToken = async (refreshToken: string) => {
		try {
			const payload = Authentication.validateToken(refreshToken);
			if (!payload) {
				return '';
			}
			const searchConditions = {
				username: payload.username,
			};
			const user = await this.userRepository.findOneUser(searchConditions);
			if (user) {
				return {
					accessToken: Authentication.generateAccessToken(
						user.userId,
						user.role,
						user.account.username,
						user.subscription.subscriptionTypeId
					),
				};
			} else {
				return '';
			}
		} catch (error: any) {
			handleErrorFunction(error);
		}
	};

	checkUsername = async (username: string): Promise<Boolean> => {
		try {
			const account = await this.accountRepository.findOneByCondition({
				username: username,
			});
			if (account) {
				return true;
			} else {
				return false;
			}
		} catch (error: any) {
			handleErrorFunction(error);
		}
	};

	checkEmail = async (email: string) => {
		try {
			const user = await this.userRepository.findOneByCondition({
				email: email,
			});
			if (user) {
				return true;
			} else {
				return false;
			}
		} catch (error: any) {
			if (error instanceof CustomError) {
				throw error;
			} else {
				throw new ServerError(error.message);
			}
		}
	};
}
