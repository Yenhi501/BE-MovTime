import BaseRoutes from './Base/BaseRouter';
import { GenreController } from '../controller/GenreController';
import { validateCreateGenre, validateDeleteGenre, validateUpdateGenre } from '../validators/GenreValidator';
import { validate } from '../validators/Validator';
import { auth, authAdmin } from '../middleware/AuthMiddleware';
class GenreRoutes extends BaseRoutes {
	constructor() {
		super(new GenreController());
	}
	public routes(): void {
		this.router.get('/', this.controller.getAllGenres);
		this.router.post('/',auth, authAdmin, validateCreateGenre, validate, this.controller.createGenre);
		this.router.put('/:genreId',auth, authAdmin, validateUpdateGenre, validate, this.controller.updateGenre);
		this.router.delete('/:genreId',auth, authAdmin, validateDeleteGenre, validate, this.controller.deleteGenre);
	}
}

export default new GenreRoutes().router;
