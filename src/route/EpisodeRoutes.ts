import BaseRoutes from './Base/BaseRouter';
import { EpisodeController } from '../controller/EpisodeController';
import { validateCreateEpisode, validateDeleteEpisodeById, validateGetEpisodeById, validateGetPresignURL, validateGetQuality, validateUpdateEpisode, validateClearCloudFront, validateGetPresignURLQuality } from '../validators/EpisodeValidator';
import { validate } from '../validators/Validator';
import { auth, authAdmin, authUser } from '../middleware/AuthMiddleware';
class EpisodeRoutes extends BaseRoutes {
	constructor() {
		super(new EpisodeController());
	}
	public routes(): void {
		this.router.get('/:id',auth, validateGetEpisodeById, validate, this.controller.getEpisode);
		this.router.get('/:id/comments', this.controller.getCommentsOfEpisode);
		this.router.post('/create',auth, authAdmin, validateCreateEpisode, validate, this.controller.createEpisode);
		this.router.put('/update/:episodeId', auth, authAdmin,validateUpdateEpisode, validate, this.controller.updateEpisode);
		this.router.delete('/delete/:episodeId',auth, authAdmin,validateDeleteEpisodeById, validate, this.controller.deleteEpisode);
		this.router.get('/presignURL/upload',auth, authAdmin, validateGetPresignURL, validate, this.controller.getPresignUrlToUploadPosterAndMovie);
		this.router.get('/qualities/:episodeId',auth, validateGetQuality, validate, this.controller.getQuality);
		this.router.post('/cloudfront/clear-cache',auth, authAdmin, validateClearCloudFront, validate, this.controller.clearCacheCloudFrontEpisodes);
		this.router.get('/presignURL/upload/quality',auth, authAdmin, validateGetPresignURLQuality, validate, this.controller.getPresignUrlToUploadQuality);
	}
}

export default new EpisodeRoutes().router;
