import { Service } from 'typedi';
import { BaseRepository } from './BaseRepository';
import { Subscription } from '../models/Subscription';
import { ISubscriptionRepository } from './Interfaces/ISubscriptionRepository';

@Service()
export class SubscriptionRepository
	extends BaseRepository<Subscription>
	implements ISubscriptionRepository
{
	constructor() {
		super(Subscription);
	}
}
