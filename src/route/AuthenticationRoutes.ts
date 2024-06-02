import passport from 'passport';
import { AuthenticationController } from '../controller/AuthenticationController';
import { auth, authRoot } from '../middleware/AuthMiddleware';
import { validateActiveUser, validateChangePassword, validateForgotPassword, validateGetAccessToken, validateLogin, validateRegister, validateValidRegister } from '../validators/AuthenticationValidator';
import { validate } from '../validators/Validator';
import BaseRoutes from './Base/BaseRouter';
import { Request, Response, NextFunction } from 'express';
import Authentication from '../utils/Authentication';

class AuthenticationRoutes extends BaseRoutes {
	constructor() {
		super(new AuthenticationController());
	}
	routes(): void {
		this.router.post('/login',validateLogin,validate, this.controller.login);
		this.router.get('/google',passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
		this.router.get('/google/callback',this.controller.handleGoogleCallback,this.controller.handleCallbackResponse),
		this.router.post('/login',validateLogin,validate, this.controller.login);
		this.router.post('/login-admin',validateLogin,validate, this.controller.loginAdmin);
		this.router.post('/register',validateRegister,validate ,this.controller.register);
		this.router.get('/valid-register', validateValidRegister,validate,this.controller.validRegister);
		this.router.post('/forgot-password',validateForgotPassword,validate, this.controller.forgotPassword);
		this.router.post('/change-password',validateChangePassword,validate, auth, this.controller.changePassword);
		this.router.post('/active-user',validateActiveUser,validate, this.controller.activeUser);
		this.router.post('/get-access-token',validateGetAccessToken,validate, this.controller.getAccessToken);
		this.router.post(
			'/register-admin',
			auth,
			authRoot,validateRegister,validate,
			this.controller.registerAdmin
		);
	}
}

export default new AuthenticationRoutes().router;
