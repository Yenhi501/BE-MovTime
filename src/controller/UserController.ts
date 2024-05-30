import { Request, Response } from 'express';
import { User } from '../models/User';
import { AuthenticationService } from '../services/AuthenticationService';
import { IAuthenticationService } from '../services/Interfaces/IAuthenticationService';
import { IUserService } from '../services/Interfaces/IUserService';
import { UserService } from './../services/UserService';

import Container from 'typedi';
import { handleErrorController } from '../error/CustomErrors';
import { IPaymentService } from '../services/Interfaces/IPaymentService';
import { PaymentService } from '../services/PaymentService';

export class UserController {
	private userService: IUserService;
	private authenticationService: IAuthenticationService;
	private paymentService: IPaymentService;

	constructor() {
		this.userService = Container.get(UserService);
		this.authenticationService = Container.get(AuthenticationService);
		this.paymentService= Container.get(PaymentService);
	}

	getUser = async (req: Request, res: Response) => {
		try {
			const { username, email, userId } = req.query;
			const searchConditions = {
				username,
				email,
				userId,
			};
			const user = await this.userService.findOneUser(searchConditions);
			return res.json(user);
		} catch (error: any) {
			console.log(error);
			return res.status(500).json({ error: 'Lỗi khi tìm kiếm user' });
		}
	};

	getSelfInfo = async (req: Request, res: Response) => {
		try {
			const searchConditions = {
				userId: req.payload.userId,
			};
			const user = await this.userService.findOneUser(searchConditions);
			return res.json(user);
		} catch (error: any) {
			console.log(error);
			return res.status(500).json({ error: 'Lỗi khi tìm kiếm user' });
		}
	};

	updateSelfInfo = async (req: Request, res: Response) => {
		try {
			const userId = req.payload.userId;

			const { dateOfBirth, gender } = req.body;

			const data: Partial<User> = {
				userId,
				dateOfBirth,
				gender,
			};
			await this.userService.updateUser(data);

			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully',
			});
		} catch (error: any) {
			console.log(error);
			return res.status(500).json({ error: 'Lỗi khi tìm kiếm user' });
		}
	};

	searchUsers = async (req: Request, res: Response) => {
		try {
			const options = {
				search: req.query.search?.toString(),
				gender: req.query.gender?.toString(),
				subscriptionType: req.query.subscriptionType?.toString(),
				sort: req.query.sort?.toString(),
				sortType: req.query.sortType?.toString(),
			};

			const page = Number(req.query.page) || 1;
			const pageSize = Number(req.query.pageSize) || 5;

			const { users, count } = await this.userService.searchUsers(
				options,
				Number(page),
				Number(pageSize)
			);
			return res.status(200).json({
				message: 'Successful',
				totalCount: count,
				totalPage: Math.ceil(count / pageSize),
				data: users,
			});
		} catch (error: any) {
			console.log(error);
			return res.status(500).json({ error: 'Lỗi khi lấy danh sách user.' });
		}
	};

	updateUser = async (req: Request, res: Response) => {
		try {
			const { userId, email, dateOfBirth, gender } = req.body;

			const data: Partial<User> = {
				userId,
				email,
				dateOfBirth,
				gender,
			};
			await this.userService.updateUser(data);
			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully',
			});
		} catch (error: any) {
			console.log(error);
			return res.status(500).json({ error: 'Lỗi :' + error.message });
		}
	};

	createUser = async (req: Request, res: Response) => {
		try {
			const { email, dateOfBirth, gender, username, password } = req.body;
			await this.authenticationService.register(
				email,
				dateOfBirth,
				gender,
				username,
				password
			);
			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully',
			});
		} catch (error: any) {
			console.log(error);
			return res.status(500).json({ error: 'Lỗi :' + error.message });
		}
	};

	deleteUser = async (req: Request, res: Response) => {
		try {
			const { userId } = req.query;
			await this.userService.deleteUser(Number(userId));
			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully',
			});
		} catch (error: any) {
			handleErrorController(error, res);
		}
	};

	getFavoriteMovieList = async (req: Request, res: Response) => {
		try {
			const data = await this.userService.findAllMovieFavorite(
				req.payload.userId
			);
			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully',
				data: data,
			});
		} catch (error: any) {
			console.log(error);
			return res.status(500).json({ error: 'Lỗi :' + error.message });
		}
	};

	getWatchHistoryList = async (req: Request, res: Response) => {
		try {
			const data = await this.userService.findAllWatchHistory(
				req.payload.userId
			);
			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully',
				data: data,
			});
		} catch (error: any) {
			console.log(error);
			return res.status(500).json({ error: 'Lỗi :' + error.message });
		}
	};

	getAllWatchLaterList = async (req: Request, res: Response) => {
		try {
			const data = await this.userService.findAllWatchLater(req.payload.userId);
			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully',
				data: data,
			});
		} catch (error: any) {
			console.log(error);
			return res.status(500).json({ error: 'Lỗi :' + error.message });
		}
	};

	saveMovieFavorite = async (req: Request, res: Response) => {
		try {
			const { movieId } = req.query;
			await this.userService.saveMovieFavorite(
				req.payload.userId,
				Number(movieId)
			);
			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully',
			});
		} catch (error: any) {
			console.log(error);
			return res.status(500).json({ error: 'Lỗi khi tao moi' });
		}
	};

	saveWatchHistory = async (req: Request, res: Response) => {
		try {
			const { episodeId, duration } = req.query;
			await this.userService.saveWatchHistory(
				req.payload.userId,
				Number(episodeId),
				Number(duration)
			);
			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully!',
			});
		} catch (error: any) {
			console.log(error);
			return res.status(500).json({ error: 'Lỗi khi tao moi' });
		}
	};

	addWatchLater = async (req: Request, res: Response) => {
		try {
			const { movieId } = req.query;
			await this.userService.saveWatchLater(
				req.payload.userId,
				Number(movieId)
			);
			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully!',
			});
		} catch (error: any) {
			console.log(error);
			return res.status(500).json({ error: 'Lỗi khi tao moi' });
		}
	};

	deleteWatchHistory = async (req: Request, res: Response) => {
		try {
			const { episodeId } = req.query;
			await this.userService.deleteWatchHistory(
				req.payload.userId,
				Number(episodeId)
			);
			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully!',
			});
		} catch (error: any) {
			console.log(error);
			return res.status(500).json({ error: 'Lỗi khi tao moi' });
		}
	};

	deleteMovieFavorite = async (req: Request, res: Response) => {
		try {
			const { movieId } = req.query;
			await this.userService.deleteMovieFavorite(
				req.payload.userId,
				Number(movieId)
			);
			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully!',
			});
		} catch (error: any) {
			console.log(error);
			return res.status(500).json({ error: 'Lỗi khi tao moi' });
		}
	};

	deleteWatchLater = async (req: Request, res: Response) => {
		try {
			const { movieId } = req.query;
			await this.userService.deleteWatchLater(
				req.payload.userId,
				Number(movieId)
			);
			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully!',
			});
		} catch (error: any) {
			console.log(error);
			return res.status(500).json({ error: 'Lỗi khi tao moi' });
		}
	};

	getWatchHistory = async (req: Request, res: Response) => {
		try {
			const { movieId } = req.query;
			const data = await this.userService.getWatchHistory(
				req.payload.userId,
				Number(movieId)
			);
			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully!',
				data: data,
			});
		} catch (error: any) {
			console.log(error);
			return res.status(500).json({ error: 'Lỗi khi tao moi' });
		}
	};

	getPresignUrlToUploadAvatar = async (req: Request, res: Response) => {
		try {
			const userId = req.payload.userId;
			if (!userId) {
				return res.status(404).json({
					message: 'Faild!, Login to update avatar',
				});
			}
			const data = await this.userService.getPresignUrlToUploadAvatar(
				req.payload.userId
			);
			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully!',
				data: data,
			});
		} catch (error: any) {
			console.log(error);
			return res.status(500).json({ error: 'Server error' });
		}
	};

	sendMailForReserveMovie= async(req: Request, res: Response) => {
		try {
			const reserves = await this.userService.sendMailForReserveMovie();
			res.status(200).json({
				message: "successful",
				data:reserves
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({
				message: "Server Error!"
			});
		}
	}

	getReserveMovieOfUser= async(req: Request, res: Response) => {
		try {
			const userId = req.payload.userId;
			const reserves = await this.userService.getReserveMovieOfUser(Number(userId));
			res.status(200).json({
				message: "successful",
				data:reserves
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({
				message: "Server Error!"
			});
		}
	}

	getMoviesReserveOfUser= async(req: Request, res: Response) => {
		try {
			const userId = req.payload.userId;
			const reserves = await this.userService.getMoviesReserveOfUser(Number(userId));
			res.status(200).json({
				message: "successful",
				data:reserves
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({
				message: "Server Error!"
			});
		}
	}

	addReserve= async(req: Request, res: Response) => {
		try {
			await this.userService.addReserve(req);
			res.status(200).json({
				message: "successful",
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({
				message: "Server Error!"
			});
		}
	}

	deleteReserve= async(req: Request, res: Response) => {
		try {
			const reserves = await this.userService.deleteReserve(req);
			res.status(200).json({
				message: "successful",
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({
				message: "Server Error!"
			});
		}
	}

	getPaymentsOfUser = async (req: Request, res: Response) => {
		try {
			const userId = Number(req.payload.userId);
			const payments = await this.paymentService.findAllPaymentByUserId(userId);
			return res.json({
				message: 'Success',
				data: payments,
			});
		} catch (error) {
			console.log(error);
		}
	};

	clearCacheCloudFrontAvatarUser = async(req: Request, res: Response) =>{
		try {
			
			await this.userService.clearCacheCloudFrontAvatarUser(req);
			res.status(200).json({
				message: "successful",
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({
				message: "Server Error!"
			});
		}
	}

	removeAvatar = async(req: Request, res: Response) =>{
		try {
			const userId = req.payload.userId;
			await this.userService.removeAvatar(userId);
			await this.userService.clearCacheCloudFrontAvatarUser(req);
			res.status(204).json({
				message: "successful",
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({
				message: "Server Error!"
			});
		}
	}
}
