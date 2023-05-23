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

	public ok<T>(resp: Response, dto?: T): Response {
		if (dto) {
			return this.send<T>(resp, 200, dto);
		}
		return resp.sendStatus(200);
	}

	public created(resp: Response): Response {
		return resp.sendStatus(201);
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		for (const route of routes) {
			this.logger.log(`Binding route ${route.method.toUpperCase()} ${route.path}`);
			const routeFunction = route.function.bind(this);
			this._router[route.method](route.path, routeFunction);
		}
	}
}
