import { Service } from 'typedi';
import { BaseRepository } from './BaseRepository';
import { SubscriptionInfo } from '../models/SubscriptionInfo';
import { SubscriptionType } from '../models/SubscriptionType';
import { Duration } from '../models/Duration';
import { ISubscriptionInfoRepository } from './Interfaces/ISubscriptionInfoRepository';
import sequelize from 'sequelize/types/sequelize';

@Service()
export class SubscriptionInfoRepository
	extends BaseRepository<SubscriptionInfo>
	implements ISubscriptionInfoRepository
{
	constructor() {
		super(SubscriptionInfo);
	}

	getSubscriptionInfoById = async (id: number) => {
		try {
			let data = await SubscriptionInfo.findOne({
				where: { subscription_info_id: id },
				attributes: [
					'subscription_info_id',
					'discount',
					[
					this.db.sequelize!.literal('("subscriptionType"."price" * "duration"."time" * (1 - "SubscriptionInfo"."discount"))'),
					'price'
					],
				],
				include: [
					{
						model: SubscriptionType,
						attributes: {
							exclude: ['createdAt', 'updatedAt', 'deletedAt'],
						},
					},
					{
						model: Duration,
						attributes: {
							exclude: ['createdAt', 'updatedAt', 'deletedAt'],
						},
					},
				],
			});
			return data;
		} catch (error: any) {
			throw new Error(error.message);
		}
	};

	getAllSubscriptionInfo = async () => {
	try {
		let data = await SubscriptionInfo.findAll({
		attributes: [
			'subscription_info_id',
			'discount',
			[
			this.db.sequelize!.literal('("subscriptionType"."price" * "duration"."time" * (1 - "SubscriptionInfo"."discount"))'),
			'price'
			],
		],
		include: [
			{
			model: SubscriptionType,
			attributes: {
				exclude: ['createdAt', 'updatedAt', 'deletedAt'],
			},
			as: 'subscriptionType',
			},
			{
			model: Duration,
			attributes: {
				exclude: ['createdAt', 'updatedAt', 'deletedAt'],
			},
			as: 'duration',
			},
		],
		order: [['subscription_info_id', 'ASC']],
		});
		return data;
	} catch (error: any) {
		throw new Error(error.message);
	}
	};



}
