import { AUTH_MESSAGE } from '../constants';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import ENV from '../config/config';

declare global {
	namespace Express {
		interface Request {
			user?: any;
		}
	}
}

export default async function auth(req: Request, res: Response, next: NextFunction) {
	const token = req.headers.authorization.split(' ')[1];

	const decodedToken = jwt.verify(token, ENV.JWT_SECRET);

	// req.body = decodedToken;
	req.user = decodedToken;
	// res.status(200).send({ decodedToken });
	next();
	try {
	} catch (error) {
		res.status(401).send({ error: AUTH_MESSAGE.authFailed });
	}
}
