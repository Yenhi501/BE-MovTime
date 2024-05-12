import { Router } from 'express';
import IRouter from './RouterInterface';

abstract class BaseRoutes implements IRouter {
	public router: Router;
	public controller: any;

	constructor(controller: any) {
		this.router = Router();
		this.controller = controller;
		this.routes();
	}

	abstract routes(): void;
}

export default BaseRoutes;
