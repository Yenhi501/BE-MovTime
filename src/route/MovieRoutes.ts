import BaseRoutes from './Base/BaseRouter';
import { MovieController } from '../controller/MovieController';
import { 
	validateSearchMovies,
	validateGetMovieById,
	validateDeleteMovieById,
	validateCreateMovie,
	validateUpdateMovie,
	validategetPresignUrlToUpload,
	validateClearCacheCloudFront,
	validateGetRelatedMovies
} from '../validators/MovieValidator';
import { validate } from '../validators/Validator';
import { auth, authAdmin, authUser } from '../middleware/AuthMiddleware';
class MovieRoutes extends BaseRoutes {
	constructor() {
		super(new MovieController());
	}
	public routes(): void {
		this.router.get('/', validateSearchMovies, validate, this.controller.searchMovies);
		this.router.get('/get/qrcode', this.controller.getQRCodeOfMovie);
		this.router.get('/:id',authUser, validateGetMovieById, validate, this.controller.getMovieById);
		this.router.get('/data-chat/all-movies', this.controller.getAllMovies);
		this.router.get('/home/trending', this.controller.getMoviesTrending);
		this.router.get('/home/upcoming', this.controller.getMoviesUpcoming);
		this.router.get('/home/vip', this.controller.getMoviesForVip);
		this.router.delete('/:id',auth, authAdmin, validateDeleteMovieById, validate, this.controller.deleteMovieById);
		this.router.post('/',auth, authAdmin, validateCreateMovie, validate, this.controller.createMovie);
		this.router.put('/:id',auth, authAdmin, validateUpdateMovie, validate, this.controller.updateMovie);
		this.router.get('/recommend/get',authUser, this.controller.getMoviesRecommender);
		this.router.get('/recommend/test', this.controller.test);
		this.router.get('/recommend/related-movies', validateGetRelatedMovies, validate, this.controller.getMoviesRelated);

		this.router.get('/get/nations', this.controller.getAllNations);
		this.router.get('/get/years', this.controller.getAllReleaseYears);
		this.router.get('/get/presign-url',auth, authAdmin, validategetPresignUrlToUpload, validate, this.controller.getPresignUrlToUpload);
		this.router.post('/:movieId/movie-actor',auth, authAdmin, this.controller.addActorForMovie);
		this.router.delete('/:movieId/movie-actor',auth, authAdmin, this.controller.deleteActorOfMovie);

		this.router.post('/:movieId/movie-director',auth, authAdmin, this.controller.addDirectorsForMovie);
		this.router.delete('/:movieId/movie-director',auth, authAdmin, this.controller.deleteDirectorsOfMovie);

		this.router.post('/:movieId/movie-genre',auth, authAdmin, this.controller.addGenresForMovie);
		this.router.delete('/:movieId/movie-genre',auth, authAdmin, this.controller.deleteGenresOfMovie);
		this.router.post('/cloudfront/clear-cache',auth, authAdmin, validateClearCacheCloudFront, validate, this.controller.clearCacheCloudFrontMovie);
	}
}

export default new MovieRoutes().router;
