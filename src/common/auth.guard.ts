import { NextFunction, Request, Response } from 'express';
import { IMiddleWare } from './middleware.interface';

export class AuthGuard implements IMiddleWare {
	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.user) {
			return next();
		}
		res.status(401).send({ error: 'You are not authorized' });
	}
}
