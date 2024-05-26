import { UserController } from '../controller/UserController';
import { auth, authAdmin } from '../middleware/AuthMiddleware';
import BaseRoutes from '../route/Base/BaseRouter';
import { addMovieHistory, deleteMovieHistory, favoriteMovie, validateCreateUser, validateDeleteUser, validateGetUser, validateSearchUsers, validateUpdateSelfInfo, validateUpdateUser, watchLater } from '../validators/UserValidator';
import { validate } from '../validators/Validator';
class UserRoutes extends BaseRoutes {
	constructor() {
		super(new UserController());
	}

	public routes(): void {
		this.router.get('/get-all-users',auth, authAdmin, validateSearchUsers,validate,this.controller.searchUsers);
		this.router.get(
			'/get-user',
			auth,
			authAdmin,
			validateGetUser,validate,
			this.controller.getUser
		);
		this.router.get('/get-self-information', auth, this.controller.getSelfInfo);
		this.router.put(
			'/update-self-information',
			auth,
			validateUpdateSelfInfo,validate,
			this.controller.updateSelfInfo
		);
		this.router.put('/update-user', auth, authAdmin,validateUpdateUser,validate, this.controller.updateUser);
		this.router.post('/create-user', auth, authAdmin, validateCreateUser,validate,this.controller.createUser);
		this.router.delete('/delete-user', auth, authAdmin,validateDeleteUser,validate, this.controller.deleteUser);

		this.router.get(
			'/get-presign-url-to-upload-avatar',
			auth,
			this.controller.getPresignUrlToUploadAvatar
		);
		this.router.get(
			'/add-favorite-movie',
			auth,favoriteMovie,validate,
			this.controller.saveMovieFavorite
		);
		this.router.delete(
			'/delete-favorite-movie',
			auth,favoriteMovie,validate,
			this.controller.deleteMovieFavorite
		);
		this.router.get(
			'/get-favorite-movie-list',
			auth,
			this.controller.getFavoriteMovieList
		);
		this.router.get('/add-watch-list', auth, watchLater,validate,this.controller.addWatchLater);
		this.router.delete(
			'/delete-watch-list',
			auth,watchLater,validate,
			this.controller.deleteWatchLater
		);
		this.router.get(
			'/get-watch-movie-list',
			auth,
			this.controller.getAllWatchLaterList
		);
		this.router.get(
			'/add-movie-history',
			auth,addMovieHistory,validate,
			this.controller.saveWatchHistory
		);
		this.router.delete(
			'/delete-movie-history',
			auth,deleteMovieHistory,validate,
			this.controller.deleteWatchHistory
		);
		this.router.get(
			'/get-movie-history-list',
			auth,
			this.controller.getWatchHistoryList
		);

		this.router.get(
			'/get-movie-history',
			auth,
			this.controller.getWatchHistory
		);

		this.router.get('/reserves', auth, this.controller.getReserveMovieOfUser);
		this.router.get('/reserves/mail', this.controller.sendMailForReserveMovie);
		this.router.post('/reserves/', auth, this.controller.addReserve);
		this.router.delete(
			'/reserves/:movieId',
			auth,
			this.controller.deleteReserve
		);
		this.router.get(
			'/payments',
			auth,
			this.controller.getPaymentsOfUser
		);
		this.router.post(
			'/cloudfront/clear-cache',
			auth,
			this.controller.clearCacheCloudFrontAvatarUser
		);

		this.router.delete(
			'/remove-avatar',auth, this.controller.removeAvatar
		);
	}
}

export default new UserRoutes().router;
