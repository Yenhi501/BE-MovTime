import { Service } from 'typedi';
import { BaseRepository } from './BaseRepository';
import { SubscriptionType } from '../models/SubscriptionType';
import { ISubscriptionTypeRepository } from './Interfaces/ISubscriptionTypeRepository';

@Service()
export class SubscriptionTypeRepository
	extends BaseRepository<SubscriptionType>
	implements ISubscriptionTypeRepository
{
	constructor() {
		super(SubscriptionType);
	}
}
