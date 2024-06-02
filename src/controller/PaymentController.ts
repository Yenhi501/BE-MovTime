import { Request, Response } from 'express';
import Container, { Inject } from 'typedi';
import { VNPayService } from '../services/payments/VNPayService';
import { text } from 'node:stream/consumers';
import { MomoService } from '../services/payments/MomoService';
import { PaypalService } from '../services/payments/PaypalService';
import { Payment } from '../models/Payment';
import { PaymentService } from '../services/PaymentService';
import timezone from 'moment-timezone';
import { SubscriptionService } from '../services/SubscriptionService';
import { UserService } from '../services/UserService';

export class PaymentController {
	static getExchangeRates() {
		throw new Error('Method not implemented.');
	}
	private vnPayService: VNPayService;
	private momoService: MomoService;
	private paypalService: PaypalService;
	private paymentService: PaymentService;
	private subscriptionService: SubscriptionService;
	private userService: UserService;

	constructor() {
		this.vnPayService = new VNPayService({
			tmnCode: process.env.VNP_TMN_CODE || '4YOYYZHU',
			secureSecret:
				process.env.VNP_HASH_SECRET || 'MBIDOAOKAURPHPQIQVKYWQNHCSNNVWHU',
			returnUrl:
				process.env.VNP_RETURN_URL ||
				'https://sandbox.vnpayment.vn/tryitnow/Home/ReturnResult',
		});
		this.momoService = Container.get(MomoService);
		this.paypalService = Container.get(PaypalService);
		this.paymentService = Container.get(PaymentService);
		this.subscriptionService = Container.get(SubscriptionService);
		this.userService = Container.get(UserService);
	}

	/**
	 * @param date
	 * @param format
	 * @return number
	 */
	private dateFormat(date: Date, format = 'yyyyMMddHHmmss'): number {
		const pad = (n: number) => (n < 10 ? `0${n}` : n).toString();
		const year = date.getFullYear();
		const month = pad(date.getMonth() + 1);
		const day = pad(date.getDate());
		const hour = pad(date.getHours());
		const minute = pad(date.getMinutes());
		const second = pad(date.getSeconds());

		return Number(
			format
				.replace('yyyy', year.toString())
				.replace('MM', month)
				.replace('dd', day)
				.replace('HH', hour)
				.replace('mm', minute)
				.replace('ss', second)
		);
	}

	getVNPayPaymentURL = async (req: Request, res: Response) => {
		try {
			const ipAdd = req.body.ipAddress;
			const timeGMT7 = timezone(new Date()).tz('Asia/Ho_Chi_Minh').format();
			const userId = Number(req.payload.userId);
			const id =
				this.dateFormat(new Date(timeGMT7), 'yyyyMMddHHmmss') +
				(Math.floor(Math.random() * 90000) + 10000).toString();
			const subscriptionInfoId = req.body.subscriptionInfoId;
			
			const priceSub =
				await this.subscriptionService.getPriceBySubscriptionInfoId(
					subscriptionInfoId
				);
			const paymentNotCheckout =
				await this.paymentService.findOnePaymentNotCheckoutByUserId(userId);
			if (paymentNotCheckout) {
				await this.paymentService.deletePayment(
					Number(paymentNotCheckout.getDataValue('paymentId'))
				);
			}
			const currentSubscriptionType = await this.paymentService.getCurrentSubscriptionTypeOfUser(userId);
			const currentSubscriptionTypeId = currentSubscriptionType.getDataValue('subscription_type_id');
			const subInfo = await this.subscriptionService.getSubscriptionInfoById(
				subscriptionInfoId
			);
			const newSubscriptionTypeId = subInfo?.subscriptionType.getDataValue('subscriptionTypeId');
			const nameSubscription = subInfo?.subscriptionType.getDataValue('name');

			let priceReduction = 0;
			if(newSubscriptionTypeId > currentSubscriptionTypeId){ // nếu gói mới > gói hiện tại thì giảm giá khi muốn nâng cấp gói
				let priceReduction = await this.paymentService.getRemainingPriceOfUser(userId);
				if(!priceReduction || priceReduction <=0){
					priceReduction = 0;
				}
				console.log(priceSub);
				console.log(priceReduction);
				let amount = priceSub - priceReduction;
				if(amount < 0){
					await this.subscriptionService.updateSubscription(
						userId,
						null,
						null,
						subscriptionInfoId
					);
					return res.status(200).json({
						message: 'Update subscription successfully!',
						success: true
					});
					
				}
			}
			
			if(newSubscriptionTypeId < currentSubscriptionTypeId){
				return res.status(400).json({
					message: 'New subscription must >= current subscription!',
					success: true
				});
			}

			const timeSubscription = subInfo?.duration.getDataValue('time');


			const paymentUrl = await this.vnPayService.buildPaymentUrl({
				vnp_Amount: priceSub - priceReduction,
				vnp_IpAddr: ipAdd,
				vnp_TxnRef: id,
				vnp_OrderInfo:
					'User_' +
					userId +
					' Thanh toán gói ' +
					nameSubscription +
					' ' +
					timeSubscription +
					' tháng',
			});

			const partialObject: Partial<Payment> = {
				type: 'VN Pay',
				price: priceSub,
				transactionId: id,
				orderInfo:
					'User_' +
					userId +
					' Thanh toán gói ' +
					nameSubscription +
					' ' +
					timeSubscription +
					' tháng',
				status: 'Not checkout',
				userId: userId,
				isPayment: false,
				subscriptionInfoId: subscriptionInfoId,
			};

			await this.paymentService.addOrEditPayment(partialObject);
			return res.status(200).json({
				message: 'Successfully',
				success: true,
				data: {
					url: paymentUrl,
				},
			});
		} catch (error) {
			console.log(error);
			return res.status(500).json({ message: 'Internal Server Error', error: error });
		}
	};

	verifyReturnUrlVNPay = async (req: Request, res: Response) => {
		try {
			// console.log(req.query);
			const query: any = req.query;
			const results = await this.vnPayService.verifyReturnUrl(query);
			const transactionId = results.vnp_TxnRef;
			if (results.isSuccess) {
				const partialObject: Partial<Payment> = {
					orderInfo: results.vnp_OrderInfo,
					status: 'Completed',
					transactionId: transactionId,
					isPayment: true,
				};

				const payment = await this.paymentService.findPaymentByTransactionId(
					transactionId
				);
				await this.paymentService.addOrEditPayment(partialObject);
				// add Subscription for user
				await this.subscriptionService.updateSubscription(
					payment.getDataValue('userId'),
					null,
					null,
					payment.getDataValue('subscriptionInfoId')
				);

				const userInfo = await this.userService.findOneUser({
					userId: payment.getDataValue('userId'),
				});

				return res.status(200).json({
					message: 'Payment With VN Pay Successfully',
					success: true,
					results: results,
					userInfo: userInfo,
				});
			}
			return res.status(200).json({
				message: 'Payment With VN Pay Failed',
				success: false,
				results: results,
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: 'Internal Server Error', error: error });
		}
	};

	getMomoPaymentURL = async (req: Request, res: Response) => {
		try {
			this.momoService
				.getPaymentUrl('MM' + new Date().getTime(), 'pay with MoMo', '', 55000)
				.then((paymentUrl) => {
					res.status(200).json({
						message: 'Successfully',
						success: true,
						data: {
							url: paymentUrl,
						},
					});
				})
				.catch((error) => {
					console.error('Error:', error);
					res.status(200).json({
						message: 'Failed',
						success: false,
					});
				});
		} catch (error) {
			res.status(500).json({ message: 'Internal Server Error', error: error });
		}
	};

	createPaypalOrder = async (req: Request, res: Response) => {
		try {
			const userId = Number(req.payload.userId);
			const subscriptionInfoId = req.body.subscriptionInfoId;
			const data = await this.paypalService.createOrder(
				userId,
				subscriptionInfoId
			);
			res.status(200).json({
				status: 'OK',
				message: 'Done',
				data: data,
			});
		} catch (error) {
			res.status(500).json({ message: 'Internal Server Error', error: error });
		}
	};

	cancelPaypalOrder = async (req: Request, res: Response) => {
		try {
			const token = req.query.token;
			if (!token) {
				return res.status(400).json({
					status: 'Bad Request',
					message: 'No token',
				});
			}
			await this.paypalService.cancelOrder(token.toString());
			return res.status(200).json({
				status: 'OK',
				message: 'Delete Successfully',
			});
		} catch (error: any) {
			return res
				.status(500)
				.json({ message: 'Internal Server Error', error: error.message });
		}
	};

	capturePaypalOrder = async (req: Request, res: Response) => {
		try {
			const token = req.body.order_id;
			if (!token) {
				return res.status(400).json({
					status: 'Bad Request',
					message: 'No token',
				});
			}
			const data = await this.paypalService.captureOrder(token.toString());
			console.log(data);
			if (data) {
				return res.status(200).json({
					status: 'OK',
					message: 'Done',
					data: data,
				});
			} else {
				return res.status(400).json({
					status: 'Bad request',
					message: 'Please check your token',
				});
			}
		} catch (error: any) {
			console.log(error.message);
			return res
				.status(500)
				.json({ message: 'Internal Server Error', error: error.message });
		}
	};

	verifyReturnUrlMomo = async (req: Request, res: Response) => {
		console.log(req.query);
		console.log('Momo return');
	};

	verifyReturnUrlMomoTest = async (req: Request, res: Response) => {
		console.log(req.body);
		console.log('Momo return test');
	};

	getPayments = async (req: Request, res: Response) => {
		try {
			const { payments, totalCount } = await this.paymentService.getPayments(
				req
			);
			const page = req.query.page || 1;
			const pageSize = req.query.pageSize || 15;
			return res.json({
				message: 'Success',
				page: Number(page),
				pageSize: pageSize,
				totalPages: Math.ceil(totalCount / Number(pageSize)),
				totalCount: totalCount,
				data: payments,
			});
		} catch (error) {
			console.log(error);
		}
	};

	test = async (req: Request, res: Response) => {
		try {
			const userId =3;
			const price = await this.paymentService.getRemainingPriceOfUser(userId);
			res.json(price);
		} catch (error) {
			console.log(error);
		}
	};

}
