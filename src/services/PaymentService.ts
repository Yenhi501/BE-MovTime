import { Request } from 'express';
import { Op } from 'sequelize';
import { Inject, Service } from 'typedi';
import { Payment } from '../models/Payment';
import { SubscriptionType } from '../models/SubscriptionType';
import { IPaymentRepository } from '../repository/Interfaces/IPaymentRepository';
import { IUserRepository } from '../repository/Interfaces/IUserRepository';
import { PaymentRepository } from '../repository/PaymentRepository';
import { UserRepository } from '../repository/UserRepository';
import { IPaymentService } from './Interfaces/IPaymentService';

interface PaymentAttributes {
	type: string;
	price: number;
	orderInfo?: string | null;
	transactionId: string;
	status: string;
	userId: number;
}

@Service()
export class PaymentService implements IPaymentService {
	@Inject(() => PaymentRepository)
	private paymentRepository!: IPaymentRepository;

	@Inject(() => UserRepository)
	private userRepository!: IUserRepository;

	addOrEditPayment = async (paymentData: Partial<Payment>) => {
		try {
			const { transactionId } = paymentData;
			if (transactionId) {
				const paymentToUpdate = await this.paymentRepository.findOneByCondition(
					{
						transactionId: paymentData.transactionId,
					}
				);
				if (paymentToUpdate) {
					await paymentToUpdate.update(paymentData);
					return await this.paymentRepository.save(paymentToUpdate);
				}
			}
			const newPayment = Payment.build(paymentData);
			return await this.paymentRepository.save(newPayment);
		} catch (error: any) {
			console.log(error);
			throw new Error(`Failed to create or edit payment: ${error.message}`);
		}
	};

	deletePayment = async (paymentId: number) => {
		try {
			return await this.paymentRepository.delete(
				await this.findPaymentById(paymentId)
			);
		} catch (error: any) {
			throw new Error(`Failed to delete payment: ${error.message}`);
		}
	};

	findPaymentById = async (paymentId: number) => {
		try {
			return await this.paymentRepository.findById(paymentId);
		} catch (error: any) {
			throw new Error(`Failed to find payment: ${error.message}`);
		}
	};

	findPaymentByTransactionId = async (transactionId: string) => {
		try {
			return await this.paymentRepository.findOneByCondition({
				transactionId: transactionId,
			});
		} catch (error: any) {
			console.log(error);
		}
	};

	findOneByTransactionId = async (
		transactionId: string
	): Promise<Payment | null> => {
		try {
			const payment = await this.paymentRepository.findOnePaymentByCondition({
				transactionId: transactionId,
			});

			return payment || null;
		} catch (error: any) {
			throw new Error(`Failed to find payment: ${error.message}`);
		}
	};

	findAllPaymentByUserId = async (userId: number) => {
		try {
			return await this.paymentRepository.findByCondition({ user_id: userId });
		} catch (error: any) {
			throw new Error(`Failed to find payment: ${error.message}`);
		}
	};

	findOnePaymentNotCheckoutByUserId = async (userId: number) => {
		try {
			return await this.paymentRepository.findOnePaymentByCondition({
				user_id: userId,
				is_payment: false,
				// deleteAt: null
			});
		} catch (error: any) {
			throw new Error(`Failed to find payment: ${error.message}`);
		}
	};

	getPayments = async (req: Request) => {
		try {
			const status = req.query.status || null;
			const type = req.query.type || null;
			const userId = req.query.userId || null;
			const isPayment = req.query.isPayment || null;
			const subscriptionInfoId = req.query.subscriptionInfoId || null;
			const startDate = req.query.startDate || null;
			const endDate = req.query.endDate || null;
			const search = req.query.search || null;

			const page = req.query.page || 1;
			const pageSize = req.query.pageSize || 15;

			const whereCondition: any = {};
			if (status) {
				whereCondition['status'] = { [Op.iLike]: `%${status}%` };
			}

			if (search) {
				whereCondition['orderInfo'] = { [Op.iLike]: `%${search}%` };
			}

			if (type) {
				whereCondition['type'] = type;
			}

			if (userId) {
				whereCondition['userId'] = userId;
			}

			if (isPayment) {
				whereCondition['isPayment'] = isPayment;
			}

			if (subscriptionInfoId) {
				whereCondition['subscriptionInfoId'] = subscriptionInfoId;
			}

			if (!startDate && !endDate) {
				whereCondition['createdAt'] = {
					[Op.between]: [new Date(2020, 1, 1), new Date()],
				};
			}

			if (startDate && !endDate) {
				whereCondition['createdAt'] = {
					[Op.between]: [startDate, new Date()],
				};
			}

			if (!startDate && endDate) {
				whereCondition['createdAt'] = {
					[Op.between]: [new Date(2020, 1, 1), endDate],
				};
			}

			if (startDate && endDate) {
				whereCondition['createdAt'] = {
					[Op.between]: [startDate, endDate],
				};
			}

			return await this.paymentRepository.getPayments(
				whereCondition,
				Number(page),
				Number(pageSize)
			);
		} catch (error: any) {
			throw error;
		}
	};

	async getRemainingPriceOfUser(userId: number): Promise<number> {
		try {
			const user = await this.userRepository.findOneUser({
				userId: userId,
			});
			if(!user) {
				throw new Error('User not found');
			}
			let subscription = user.subscription;
			const closedAt: Date = subscription.getDataValue('closeAt');
			const startDate: Date = new Date();
			const endDate: Date = new Date(closedAt);
			const price = subscription.subscriptionType.getDataValue('price');
			const subscriptionTypeId = subscription.subscriptionType.getDataValue('subscription_type_id');

			if(subscription.subscriptionType.subscriptionTypeId ===3){
				return 0;
			}
			const remainingDay = this.diffDate(startDate, endDate);
			console.log(`remainingDay: ${remainingDay}`);
			if(remainingDay<=0 || price <=0){
				return 0;
			}
			
			return remainingDay*price/30*75/100;
		} catch (error) {
			console.log(error);
			throw(error);
		}
	}

	async getCurrentSubscriptionTypeOfUser(userId: number): Promise<SubscriptionType>
	{
		try{		
			const user = await this.userRepository.findOneUser({
				userId: userId,
			});
			let subscription = user.subscription;
			return subscription.subscriptionType;
		} catch (error) {
			console.log(error);
			throw(error);
		}
	}

	diffDate(startDate: Date, endDate: Date): number{
		const millisecondsPerDay: number = 24 * 60 * 60 * 1000; // Số mili giây trong một ngày
		const timeDifference: number = endDate.getTime() - startDate.getTime();
		const numberOfDays = Math.floor(timeDifference / millisecondsPerDay);
		return numberOfDays;
	}
}
