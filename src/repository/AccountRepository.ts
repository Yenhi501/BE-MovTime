import Container, { Service } from 'typedi';
import { BaseRepository } from './BaseRepository';
import { Account } from '../models/Account';
import { IAccountRepository } from './Interfaces/IAccountRepository';

@Service()
export class AccountRepository
	extends BaseRepository<Account>
	implements IAccountRepository
{
	constructor() {
		super(Account);
	}
}
