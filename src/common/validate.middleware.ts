import { Request, Response, NextFunction } from 'express';

import { IMiddleware } from './middleware.interface';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export class ValidateMiddleware implements IMiddleware {
	constructor(private classToValidate: ClassConstructor<object>) {}
	execute({ body }: Request, res: Response, next: NextFunction): void {
		const instance = plainToClass(this.classToValidate, body);
		validate(instance).then((errors) => {
			if (errors.length > 0) {
				const response = errors.map((error) => {
					return {
						property: error.property,
						errors: error.constraints,
					};
				});
				res.status(422).send(response);
				return;
			} else {
				next();
			}
		});
	}
}
