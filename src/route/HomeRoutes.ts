import { HomeController } from '../controller/HomeController';
import BaseRoutes from './Base/BaseRouter';
class HomeRoutes extends BaseRoutes {
	constructor() {
		super(new HomeController());
	}
	public routes(): void {
		this.router.get('/genres', this.controller.getMoviesByGenre);
		this.router.get('/genres/:genreId', this.controller.getMoviesOfGenre);
		this.router.get('/posters', this.controller.getHomePoster);
		this.router.get('/headers', this.controller.getInfoHeader);
	}
}

export default new HomeRoutes().router;
