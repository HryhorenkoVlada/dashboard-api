import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { IConfigService } from './config.service.interface';
import { DotenvConfigOutput, DotenvParseOutput, config } from 'dotenv';

@injectable()
export class ConfigService implements IConfigService {
	private readonly envConfig: DotenvParseOutput;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		const result: DotenvConfigOutput = config();

		if (result.error) {
			this.logger.error(`[ConfigService]: ${result.error.message}`);
		} else {
			this.logger.log('[ConfigService]: File .env was successfully loaded');
			this.envConfig = result.parsed as DotenvParseOutput;
		}
	}

	get<T extends string | number>(key: string): T {
		return process.env[key] as T;
	}
}
