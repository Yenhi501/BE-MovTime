import { SubscriptionType } from 'aws-sdk/clients/budgets';
import { SubscriptionInfo } from '../../models/SubscriptionInfo';

export interface ISubscriptionService {
	getAllDuration(): unknown;
	updateSubscription: (
		userId: number,
		closeAt?: Date | null,
		subscriptionTypeId?: number | null,
		subscriptionInfoId?: number | null
	) => Promise<void>;

	createOrUpdateSubscriptionType: (
		name?: string | null,
		price?: number | null,
		subscriptionTypeId?: number | null
	) => Promise<void>;

	getAllSubscriptionType: () => Promise<SubscriptionType[]>;

	deleteSupscriptionType: (subscriptionTypeId: number) => Promise<void>;

	createOrUpdateSubscriptionInfo: (
		subscriptionTypeId?: number | null,
		durationId?: number | null,
		discount?: number | null,
		subscriptionInfoId?: number | null
	) => Promise<void>;

	getAllSubscriptionInfo: () => Promise<SubscriptionInfo[]>;

	getSubscriptionInfoById: (id: number) => Promise<SubscriptionInfo | null>;

	getPriceBySubscriptionInfoId: (id: number) => Promise<number>;

	deleteSupscriptionInfo: (subscriptionInfoId: number) => Promise<void>;
}
