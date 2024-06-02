import { SubscriptionInfo } from '../../models/SubscriptionInfo';
import { BaseInterface } from './BaseInterface';

export interface ISubscriptionInfoRepository extends BaseInterface {
	getSubscriptionInfoById: (id: number) => Promise<SubscriptionInfo | null>;
	getAllSubscriptionInfo: () => Promise<SubscriptionInfo[]>;
}
