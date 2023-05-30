import request from 'supertest';

import { App } from '../src/app';
import { boot } from '../src/main';
import { IUsersController } from '../src/users/users.controller.interface';
import { TYPES } from '../src/types';

let application: App;
let usersController: IUsersController;

beforeAll(async () => {
	const { app, appContainer } = await boot;
	application = app;
	usersController = appContainer.get<IUsersController>(TYPES.IUsersController);
});

describe('Users e2e', () => {
	describe('Users controller', () => {
		describe('Register', () => {
			it('should not allow to register with existing email', async () => {
				const response = await request(application.app).post('/users/register').send({
					email: 'test@test.com',
					password: '1234567890',
					name: 'Test 1',
				});

				expect(response.status).toBe(422);
			});
			it('should allow to register with new email', async () => {
				const response = await request(application.app)
					.post('/users/register')
					.send({
						email: `test${Date.now()}@test.com`,
						password: 'test12345678',
						name: `Test ${Date.now()}`,
					});

				expect(response.status).toBe(201);
			});
		});
		describe('Login', () => {
			it('should not allow to login with wrong password', async () => {
				const response = await request(application.app).post('/users/login').send({
					email: 'test@test.com',
					password: '123jhjhjyyf',
				});

				expect(response.status).toBe(401);
			});

			it('should not allow to login with unexisted email', async () => {
				const response = await request(application.app).post('/users/login').send({
					email: 'testUnexisted@test.com',
					password: '1234567890',
				});

				expect(response.status).toBe(401);
			});

			it('should allow to login with correct credentials', async () => {
				const response = await request(application.app).post('/users/login').send({
					email: 'test@test.com',
					password: '123456789',
				});

				expect(response.status).toBe(200);
				expect(response.body.token).not.toBeUndefined();
			});
		});
		describe('Get user info', () => {
			it('should successfuly get information if token is valid', async () => {
				const login = await request(application.app).post('/users/login').send({
					email: 'test@test.com',
					password: '123456789',
				});

				const response = await request(application.app)
					.get('/users/info')
					.set('Authorization', 'Bearer ' + login.body.token)
					.send();

				expect(response.status).toBe(200);
				expect(response.body.email).toBe('test@test.com');
			});

			it('should not successfuly get information if user is logged in and token is invalid', async () => {
				const login = await request(application.app).post('/users/login').send({
					email: 'test@test.com',
					password: '123456789',
				});

				const response = await request(application.app)
					.get('/users/info')
					.set('Authorization', 'Bearer ' + login.body.token + 'InvalidToken123')
					.send();

				expect(response.status).toBe(401);
			});

			it('should not allow to get information if user is logged out', async () => {
				const response = await request(application.app)
					.get('/users/info')
					.set('Authorization', 'Bearer ' + 'InvalidToken123')
					.send();

				expect(response.status).toBe(401);
			});
		});
	});
});

afterAll(() => {
	application.close();
});
