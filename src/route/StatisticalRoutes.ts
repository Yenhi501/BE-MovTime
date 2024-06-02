import BaseRoutes from './Base/BaseRouter';
import { auth, authAdmin } from '../middleware/AuthMiddleware';
import { validate } from '../validators/Validator';
import { StatisticalController } from '../controller/StatisticalController';
import { validateStatistical, validateStatisticalComments } from '../validators/StatisticalValidator';
class StatisticalRoutes extends BaseRoutes {
	constructor() {
		super(new StatisticalController());
	}
	public routes(): void {
		this.router.get('/revenues',auth, authAdmin,validateStatistical, validate, this.controller.getRevenueStatistics);
		this.router.get('/movies-by-genres',auth, authAdmin, this.controller.getStatisticsMoviesByGenres);
		this.router.get('/comments',auth, authAdmin,validateStatisticalComments, validate, this.controller.getStatisticsComments);
	}
}

export default new StatisticalRoutes().router;

