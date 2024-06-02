import { Inject, Service } from 'typedi';
import { PaymentService } from '../PaymentService';
import { Payment } from '../../models/Payment';
import { SubscriptionService } from '../SubscriptionService';
import axios from 'axios';
import { transferRate } from '../../utils/ScheduleTask';

@Service()
export class PaypalService {
	@Inject(() => PaymentService)
	private paymentService!: PaymentService;

	@Inject(() => SubscriptionService)
	private subscriptionService!: SubscriptionService;

	environment = process.env.ENVIRONMENT;
	client_id = process.env.CLIENT_ID?.toString();
	client_secret = process.env.CLIENT_SECRET?.toString();
	client_url = process.env.CLIENT_URL?.toString();

	endpoint_url =
		this.environment === 'sandbox'
			? 'https://api-m.sandbox.paypal.com'
			: 'https://api-m.paypal.com';
	static transferRate: number;

	createOrder = async (userId: number, subscriptionInfoId: number) => {
		try {
			let price = await this.subscriptionService.getPriceBySubscriptionInfoId(
				subscriptionInfoId
			);
			if (!PaypalService.transferRate) {
				await transferRate();
			}
			const priceString = (price / PaypalService.transferRate).toFixed(2);
			const order = {
				intent: 'CAPTURE',
				purchase_units: [
					{
						amount: {
							currency_code: 'USD',
							value: priceString,
						},
						description: 'Movie Subscription',
					},
				],
				application_context: {
					brand_name: 'MOVTIME',
					landing_page: 'LOGIN',
					user_action: 'PAY_NOW',
					return_url: this.client_url+'/bill' || 'http://localhost:3000/bill',
					cancel_url: this.client_url+'/bill' || 'http://localhost:3000/bill/cancel',
				},
			};

			const response = await axios.post(
				`${this.endpoint_url}/v2/checkout/orders`,
				order,
				{
					auth: {
						username: this.client_id || '',
						password: this.client_secret || '',
					},
				}
			);
			const id = response.data.links[1].href.split('=')[1];

			const partialObject: Partial<Payment> = {
				type: 'paypal',
				price: Number(price),
				transactionId: id,
				status: 'Not checkout',
				userId: userId,
				isPayment: false,
				subscriptionInfoId: subscriptionInfoId,
			};
			await this.paymentService.addOrEditPayment(partialObject);
			return response.data.links[1].href;
		} catch (error) {
			console.log(error);
		}
	};

	captureOrder = async (token: string) => {
		try {
			const response = await axios.post(
				`${this.endpoint_url}/v2/checkout/orders/${token}/capture`,
				{},
				{
					auth: {
						username: this.client_id || '',
						password: this.client_secret || '',
					},
				}
			);
			if (response.data.status === 'COMPLETED') {
				const partialObject: Partial<Payment> = {
					orderInfo: JSON.stringify(response.data),
					status: 'Success',
					isPayment: true,
					transactionId: token,
				};
				await this.paymentService.addOrEditPayment(partialObject);
				const payment = await this.paymentService.findPaymentByTransactionId(
					token
				);

				await this.subscriptionService.updateSubscription(
					payment.getDataValue('userId'),
					null,
					null,
					payment.getDataValue('subscriptionInfoId')
				);
				return await this.paymentService.findOneByTransactionId(token);
			} else {
				return null;
			}
		} catch (error) {
			return error;
		}
	};

	cancelOrder = async (token: string) => {
		try {
			const payment = await this.paymentService.findPaymentByTransactionId(
				token
			);
			return await this.paymentService.deletePayment(payment.paymentId);
		} catch (error: any) {
			throw new Error(`Failed to delete payment: ${error.message}`);
		}
	};
}
