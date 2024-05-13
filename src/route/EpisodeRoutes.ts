import BaseRoutes from './Base/BaseRouter';
import { EpisodeController } from '../controller/EpisodeController';
class EpisodeRoutes extends BaseRoutes {
	constructor() {
		super(new EpisodeController());
	}
	public routes(): void {
		this.router.get('/:id',this.controller.getEpisode);
		this.router.get('/:id/comments', this.controller.getCommentsOfEpisode);
		this.router.post('/create', this.controller.createEpisode);
		this.router.put('/update/:episodeId',this.controller.updateEpisode);
		this.router.delete('/delete/:episodeId',this.controller.deleteEpisode);
		
	}
}

export default new EpisodeRoutes().router;
