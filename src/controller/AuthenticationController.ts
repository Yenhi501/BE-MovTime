import {
	handleErrorController,
} from './../error/CustomErrors';
import { NextFunction, Request, Response } from 'express';
import Container, { Inject, Service } from 'typedi';
import { IAuthenticationService } from '../services/Interfaces/IAuthenticationService';
import { AuthenticationService } from '../services/AuthenticationService';
import passport from 'passport';
import Authentication from '../utils/Authentication';


export class AuthenticationController {
	private authenticationService: IAuthenticationService;

	constructor() {
		this.authenticationService = Container.get(AuthenticationService);
	}

	login = async (req: Request, res: Response) => {
		try {
			const { username, password } = req.body;
			const token = await this.authenticationService.login(username, password);
			const res_token = { type: 'Bearer', token: token };
			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully login!',
				result: res_token,
			});
		} catch (error) {
			handleErrorController(error, res);
		}
	};

	loginAdmin = async (req: Request, res: Response) => {
		try {
			const { username, password } = req.body;
			const token = await this.authenticationService.loginAdmin(username, password);
			const res_token = { type: 'Bearer', token: token };
			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully login!',
				result: res_token,
			});
		} catch (error) {
			handleErrorController(error, res);
		}
	};

	handleGoogleCallback = async(req: Request, res: Response, next: NextFunction) =>{
		console.log("Request URL:", req.url);
		passport.authenticate('google', (err: any, profile: any) => {
		if (err) {
			return next(err);
		}
		next();
		})(req, res, next);
	}

	handleCallbackResponse = async (req: Request, res: Response) =>{
		const userProfile = req.payload;
		if(userProfile){
			const refreshToken = Authentication.generateRefreshToken(userProfile.account.username)
			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully login!',
				token: refreshToken,
			});
		}
    	return res.status(401).json({message: 'Unauthorized'})
	}

	register = async (req: Request, res: Response) => {
		try {
			const { email, dateOfBirth, gender, username, password } = req.body;

			await this.authenticationService.register(
				email,
				dateOfBirth,
				gender,
				username,
				password
			);
			let data = await this.authenticationService.activeUser(email,null);
			
			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully registerd users!',
				message_active: data
			});
		} catch (error: any) {
			handleErrorController(error, res);
		}
	};

	registerAdmin = async (req: Request, res: Response) => {
		try {
			const { email, dateOfBirth, gender, username, password } = req.body;

			await this.authenticationService.register(
				email,
				dateOfBirth,
				gender,
				username,
				password,
				true
			);

			let data = await this.authenticationService.activeUser(email,null);
			
			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully registerd admin!',
				message_active: data
			});
		} catch (error: any) {
			handleErrorController(error, res);
		}
	};

	forgotPassword = async (req: Request, res: Response) => {
		try {
			const { email, token, password } = req.body;
			let data = await this.authenticationService.forgotPassword(
					email,
					token,
					password
				);

			return res.status(200).json({
				status: 'Ok!',
				message: data,
			});
		} catch (error) {
			handleErrorController(error, res);
		}
	};

	changePassword = async (req: Request, res: Response) => {
		try {
			const userId = req.payload.userId;
			const { oldPassword, newPassword } = req.body;
			await this.authenticationService.changePassword(
				userId,
				oldPassword,
				newPassword
			);

			return res.status(200).json({
				status: 'Ok!',
				message: 'Success',
			});
		} catch (error: any) {
			handleErrorController(error, res);
		}
	};

	activeUser = async (req: Request, res: Response) => {
		try {
			const { identifier, token } = req.body;
			let data = await this.authenticationService.activeUser(identifier,token);

			return res.status(200).json({
				status: 'Ok!',
				message: data,
			});
		} catch (error) {
			handleErrorController(error, res);
		}
	};

	getAccessToken = async (req: Request, res: Response) => {
		try {
			const { refreshToken } = req.body;
			const token =
				await this.authenticationService.getAccessTokenByRefreshToken(
					refreshToken
				);
			if (token === '') {
				return res.status(400).json({
					status: 'Bad Request!',
					message: 'Token hết hiệu lực hoặc không tồn tại',
				});
			}
			const res_token = { type: 'Bearer', token: token };
			return res.status(200).json({
				status: 'Ok!',
				message: 'Get new token successfully!',
				result: res_token,
			});
		} catch (error) {
			handleErrorController(error, res);
		}
	};

	validRegister = async (req: Request, res: Response) => {
		try {
			const { username, email } = req.query;
			if (username) {
				if (
					await this.authenticationService.checkUsername(username.toString())
				) {
					return res.status(409).json({
						status: 'Conflict',
						message: 'Username already exist',
					});
				} else {
					return res.status(200).json({
						status: 'Ok!',
						message: 'Can be use',
					});
				}
			} else if (email) {
				if (await this.authenticationService.checkEmail(email.toString())) {
					return res.status(409).json({
						status: 'Conflict!',
						message: 'Email already exist',
					});
				} else {
					return res.status(200).json({
						status: 'Ok!',
						message: 'Can be use',
					});
				}
			} else {
				return res.status(400).json({
					status: 'No Param',
					message: 'Check param please',
				});
			}
		} catch (error) {
			handleErrorController(error, res);
		}
	};
}
