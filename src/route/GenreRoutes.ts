import { GenreController } from '../controller/GenreController';
import BaseRoutes from './Base/BaseRouter';

class GenreRoutes extends BaseRoutes {
	constructor() {
		super(new GenreController());
	}
	public routes(): void {
		this.router.get('/', this.controller.getAllGenres);
		this.router.post('/', this.controller.createGenre);
		this.router.put('/:genreId',this.controller.updateGenre);
		this.router.delete('/:genreId',this.controller.deleteGenre);
	}
}

export default new GenreRoutes().router;
