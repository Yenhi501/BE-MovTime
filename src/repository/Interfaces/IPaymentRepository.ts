import { Payment } from '../../models/Payment';
import { BaseInterface } from './BaseInterface';

export interface IPaymentRepository extends BaseInterface {
	getPayments(
		whereCondition: any,
		page: number,
		pageSize: number
	): Promise<{
		payments: Payment[];
		totalCount: number;
	}>;
	findOnePaymentByCondition(searchConditions: any): Promise<Payment | null>;
}
