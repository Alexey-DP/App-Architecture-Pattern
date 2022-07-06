import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { IMiddleWare } from './middleware.interface';

export class AuthMiddleWare implements IMiddleWare {
	constructor(private secret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			const token = req.headers.authorization.split(' ')[1];
			verify(token, this.secret, (error, payload) => {
				if (payload && typeof payload !== 'string') {
					req.user = payload.email;
					next();
				} else {
					next();
				}
			});
		} else {
			next();
		}
	}
}
