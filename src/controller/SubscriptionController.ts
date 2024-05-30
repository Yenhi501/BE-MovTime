import express, { Request, Response, Router } from 'express';
import Container from 'typedi';
import { SubscriptionService } from '../services/SubscriptionService';
import { ISubscriptionService } from '../services/Interfaces/ISubscriptionService';

export class SubscriptionController {
	private subscriptionService: ISubscriptionService;

	constructor() {
		this.subscriptionService = Container.get(SubscriptionService);
	}

	updateSubscription = async (req: Request, res: Response) => {
		try {
			const { subscriptionTypeId, userId, closeAt, subscriptionInfoId } =
				req.body;
			const updateParams = {
				userId: Number(userId),
				closeAt: closeAt ? new Date(closeAt) : null,
				subscriptionTypeId: subscriptionTypeId
					? Number(subscriptionTypeId)
					: null,
				subscriptionInfoId: subscriptionInfoId
					? Number(subscriptionInfoId)
					: null,
			};

			await this.subscriptionService.updateSubscription(
				updateParams.userId,
				updateParams.closeAt,
				updateParams.subscriptionTypeId,
				updateParams.subscriptionInfoId
			);
			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully',
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: 'Can not' });
		}
	};

	createSubscriptionType = async (req: Request, res: Response) => {
		try {
			const { name, price } = req.body;
			await this.subscriptionService.createOrUpdateSubscriptionType(
				name,
				price
			);
			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully',
			});
		} catch (error) {
			res.status(500).json({ error: 'Can not' });
		}
	};

	updateSubscriptionType = async (req: Request, res: Response) => {
		try {
			const { name, price, subscriptionTypeId } = req.body;
			await this.subscriptionService.createOrUpdateSubscriptionType(
				name,
				price,
				subscriptionTypeId
			);
			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully',
			});
		} catch (error) {
			res.status(500).json({ error: 'Can not' });
		}
	};

	getAllSubscriptionType = async (req: Request, res: Response) => {
		try {
			const data = await this.subscriptionService.getAllSubscriptionType();
			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully',
				data: data,
			});
		} catch (error) {
			res.status(500).json({ error: 'Can not' });
		}
	};

	deleteSubscriptionType = async (req: Request, res: Response) => {
		try {
			const { subscriptionTypeId } = req.query;
			await this.subscriptionService.deleteSupscriptionType(
				Number(subscriptionTypeId)
			);
			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully',
			});
		} catch (error) {
			res.status(500).json({ error: 'Can not' });
		}
	};

	getAllSubscriptionInfo = async (req: Request, res: Response) => {
		try {
			const data = await this.subscriptionService.getAllSubscriptionInfo();
			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully',
				data: data,
			});
		} catch (error) {
			res.status(500).json({ error: 'Can not' + error });
		}
	};

	createSubscriptionInfo = async (req: Request, res: Response) => {
		try {
			const { subscriptionTypeId, durationId, discount } = req.body;
			if (!subscriptionTypeId || !durationId || !discount) {
				return res.status(400).json({
					status: 'Error',
					message: 'Lack of Param',
				});
			}

			await this.subscriptionService.createOrUpdateSubscriptionInfo(
				Number(subscriptionTypeId),
				Number(durationId),
				Number(discount)
			);
			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully',
			});
		} catch (error) {
			res.status(500).json({ error: 'Can not' });
		}
	};

	updateSubscriptionInfo = async (req: Request, res: Response) => {
		try {
			const { subscriptionTypeId, durationId, discount, subscriptionInfoId } =
				req.body;
			const updateParams = {
				subscriptionInfoId: subscriptionInfoId
					? Number(subscriptionInfoId)
					: null,
				discount: discount ? Number(discount) : null,
				durationId: durationId ? Number(durationId) : null,
				subscriptionTypeId: subscriptionTypeId
					? Number(subscriptionTypeId)
					: null,
			};
			await this.subscriptionService.createOrUpdateSubscriptionInfo(
				updateParams.subscriptionTypeId,
				updateParams.durationId,
				updateParams.discount,
				updateParams.subscriptionInfoId
			);
			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully',
			});
		} catch (error) {
			res.status(500).json({ error: 'Can not' });
		}
	};

	deleteSubscriptionInfo = async (req: Request, res: Response) => {
		try {
			const { subscriptionInfoId } = req.query;
			await this.subscriptionService.deleteSupscriptionInfo(
				Number(subscriptionInfoId)
			);
			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully',
			});
		} catch (error) {
			res.status(500).json({ error: 'Can not' });
		}
	};

	
	getAllDuration = async (req: Request, res: Response) => {
		try {
			const data = await this.subscriptionService.getAllDuration();
			return res.status(200).json({
				status: 'Ok!',
				message: 'Successfully',
				data: data,
			});
		} catch (error) {
			res.status(500).json({ error: 'Can not' });
		}
	};

}
