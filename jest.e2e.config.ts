import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	verbose: true,
	preset: 'ts-jest',
	testRegex: '.e2e-spec.ts$',
	collectCoverage: true,
	coverageDirectory: 'coverage/e2e',
};

export default config;
