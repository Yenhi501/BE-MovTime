import BaseRoutes from './Base/BaseRouter';
import { MovieController } from '../controller/MovieController';

class MovieRoutes extends BaseRoutes {
	constructor() {
		super(new MovieController());
	}
	public routes(): void {
		this.router.get('/', this.controller.searchMovies);
		this.router.get('/get/qrcode', this.controller.getQRCodeOfMovie);
		this.router.get('/:id',this.controller.getMovieById);
		
		this.router.delete('/:id', this.controller.deleteMovieById);
		this.router.post('/',this.controller.createMovie);
		this.router.put('/:id',this.controller.updateMovie);
	}
}

export default new MovieRoutes().router;
