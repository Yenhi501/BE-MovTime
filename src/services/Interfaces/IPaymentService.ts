import { Request } from 'express';
import { Payment } from '../../models/Payment';
import { SubscriptionType } from '../../models/SubscriptionType';

export interface IPaymentService {
	addOrEditPayment: (paymentData: Partial<Payment>) => Promise<void>;
	deletePayment: (paymentId: number) => Promise<void>;
	findPaymentById: (paymentId: number) => Promise<Payment | null>;
	findPaymentByTransactionId: (
		transactionId: string
	) => Promise<Payment | null>;
	findOneByTransactionId: (transactionId: string) => Promise<Payment | null>;
	findAllPaymentByUserId: (userId: number) => Promise<Payment[]>;
	getPayments: (
		req: Request
	) => Promise<{ payments: Payment[]; totalCount: number }>;
	getRemainingPriceOfUser(userId: number): Promise<number>;
	getCurrentSubscriptionTypeOfUser(userId: number): Promise<SubscriptionType>;
}
