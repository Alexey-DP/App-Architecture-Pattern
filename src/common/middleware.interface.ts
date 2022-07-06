import { NextFunction, Request, Response } from 'express';

export interface IMiddleWare {
	execute: (req: Request, res: Response, next: NextFunction) => void;
}
