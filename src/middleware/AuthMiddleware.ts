import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Container from 'typedi';
import { UserService } from '../services/UserService';

const userService = Container.get(UserService);

declare global {
	namespace Express {
		interface Request {
			payload?: any;
		}
	}
}

export const authRoot = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		if (req.payload.role == 0) {
			const searchConditions = {
				userId: req.payload.userId,
			};
			const role = (await userService.findOneUser(searchConditions)).role;
			if (role == req.payload.role) {
				return next();
			}
		}
		return res.status(403).send('No permission!');
	} catch (err) {
		return res.send(err);
	}
};

export const authAdmin = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		if (req.payload.role == 1 || req.payload.role == 0) {
			const searchConditions = {
				userId: req.payload.userId,
			};
			const role = (await userService.findOneUser(searchConditions)).role;
			if (role == req.payload.role) {
				return next();
			}
		}
		return res.status(403).send('No permission!');
	} catch (err) {
		return res.send(err);
	}
};

export const auth = (req: Request, res: Response, next: NextFunction): any => {
	if (!req.headers.authorization) {
		return res.status(401).send('No token!');
	}

	let secretKey = process.env.JWT_SECRET_KEY || 'my-secret-key';
	const token: string = req.headers.authorization.split(' ')[1];

	try {
		const credential: string | object = jwt.verify(token, secretKey);
		if (credential) {
			req.app.locals.credential = credential;
			req.payload = credential;
			return next();
		}
		return res.status(403).send('Token invalid');
	} catch (err:any) {
		return res.status(401).send(err);
	}
};

export const authUser = (
	req: Request,
	res: Response,
	next: NextFunction
): any => {
	if (!req.headers.authorization) {
		req.payload={userId :null}
		return next();
	}

	let secretKey = process.env.JWT_SECRET_KEY || 'my-secret-key';
	const token: string = req.headers.authorization.split(' ')[1];

	try {
		const credential: string | object = jwt.verify(token, secretKey);
		if (credential) {
			req.app.locals.credential = credential;
			req.payload = credential;
			return next();
		}
		req.payload={userId :null}
		return next();
	} catch (err) {
		return res.send(err);
	}
};
