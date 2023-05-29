import { Router, Response } from 'express';
import { injectable } from 'inversify';
import 'reflect-metadata';

import { IControllerRoute } from './route.interface';
import { ILogger } from '../logger/logger.interface';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;
	constructor(private logger: ILogger) {
		this._router = Router();
		this.logger = logger;
	}

	get router(): Router {
		return this._router;
	}

	public send<T>(resp: Response, code: number, message: T): Response {
		resp.status(code);
		resp.type('application/json');
		resp.json(message);
		return resp;
	}

	public ok<T>(resp: Response, dto?: T, code = 200): Response {
		if (dto) {
			return this.send<T>(resp, code, dto);
		}
		return resp.sendStatus(code);
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		for (const route of routes) {
			this.logger.log(`Binding route ${route.method.toUpperCase()} ${route.path}`);
			const middlewares = route.middlewares?.map((middleware) =>
				middleware.execute.bind(middleware),
			);
			const routeFunction = route.function.bind(this);
			const pipeline = middlewares ? [...middlewares, routeFunction] : routeFunction;
			this._router[route.method](route.path, pipeline);
		}
	}
}
