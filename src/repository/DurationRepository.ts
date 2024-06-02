import { Service } from 'typedi';
import { BaseRepository } from './BaseRepository';
import { Duration } from '../models/Duration';
import { IDurationRepository } from './Interfaces/IDurationRepository';

@Service()
export class DurationRepository
	extends BaseRepository<Duration>
	implements IDurationRepository
{
	constructor() {
		super(Duration);
	}
}
