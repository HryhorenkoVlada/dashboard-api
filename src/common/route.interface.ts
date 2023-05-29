import { NextFunction, Request, Response } from 'express';

import { ApiMethod } from './api.types';
import { IMiddleware } from './middleware.interface';

export interface IControllerRoute {
	path: string;
	method: ApiMethod;
	function: (req: Request, res: Response, next: NextFunction) => void;
	middlewares?: IMiddleware[];
}
