import { SubscriptionController } from '../controller/SubscriptionController';
import { auth, authAdmin } from '../middleware/AuthMiddleware';
import { validateCreateSubscriptionInfo, validateCreateSubscriptionType, validateDeleteSubscriptionInfo, validateDeleteSubscriptionType, validateUpdateSubscription, validateUpdateSubscriptionInfo, validateUpdateSubscriptionType } from '../validators/SubscriptionValidator';
import { validate } from '../validators/Validator';
import BaseRoutes from './Base/BaseRouter';
class SubscriptionRoutes extends BaseRoutes {
	constructor() {
		super(new SubscriptionController());
	}
	public routes(): void {
		this.router.put('/update-subscription',auth,authAdmin,validateUpdateSubscription,validate, this.controller.updateSubscription);
		this.router.post(
			'/create-subscription-type',auth,authAdmin,validateCreateSubscriptionType,validate,
			this.controller.createSubscriptionType
		);
		this.router.put(
			'/update-subscription-type',auth,authAdmin,validateUpdateSubscriptionType,validate,
			this.controller.updateSubscriptionType
		);
		this.router.get(
			'/get-all-subscription-type',
			this.controller.getAllSubscriptionType
		);
		this.router.delete(
			'/delete-subscription-type',auth,authAdmin,validateDeleteSubscriptionType,validate,
			this.controller.deleteSubscriptionType
		);
		this.router.get(
			'/get-all-subscription-info',
			this.controller.getAllSubscriptionInfo
		);
		this.router.post(
			'/create-subscription-info',auth,authAdmin,validateCreateSubscriptionInfo,validate,
			this.controller.createSubscriptionInfo
		);
		this.router.put(
			'/update-subscription-info',auth,authAdmin,validateUpdateSubscriptionInfo,validate,
			this.controller.updateSubscriptionInfo
		);
		this.router.delete(
			'/delete-subscription-info',auth,authAdmin,validateDeleteSubscriptionInfo,validate,
			this.controller.deleteSubscriptionInfo
		);
		this.router.get('/get-all-duration', this.controller.getAllDuration);
	}
}

export default new SubscriptionRoutes().router;
