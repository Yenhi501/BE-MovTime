export interface IAuthenticationService {
	login(username: string, password: string): Promise<string>;
	loginAdmin(username: string, password: string): Promise<string>;
	register(
		email: string,
		dateOfBirth: Date,
		gender: string,
		username: string,
		password: string,
		isAdmin?: boolean
	): Promise<string>;
	forgotPassword: (
		email: string,
		token?: string | null,
		password?: string | null
	) => Promise<any>;
	changePassword: (
		userId: number,
		oldPassword: string,
		newPassword: string
	) => Promise<any>;
	activeUser: (identifier: string, token: string | null) => Promise<string>;
	getAccessTokenByRefreshToken: (refreshToken: string) => Promise<any>;
	checkUsername: (username: string) => Promise<Boolean>;
	checkEmail: (email: string) => Promise<boolean>;
}
