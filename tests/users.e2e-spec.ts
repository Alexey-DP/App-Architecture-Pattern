import { start } from './../src/main';
import { App } from './../src/app';
import request from 'supertest';

let application: App;

beforeAll(async () => {
	const { app } = await start;
	application = app;
});

describe('Users e2e', () => {
	it('Register - error', async () => {
		const res = await request(application.app)
			.post('/users/register')
			.send({ email: 'test3@mail.com', password: 'asdfsd' });

		expect(res.statusCode).toBe(422);
	});

	it('Login - success', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'test3@mail.com', password: 'a12sd3' });

		expect(res.body.jwt).not.toBeUndefined();
	});

	it('Login - error', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'test3@mail.com', password: 'afdsf' });

		expect(res.statusCode).toBe(401);
	});

	it('Info - success', async () => {
		const login = await request(application.app)
			.post('/users/login')
			.send({ email: 'test3@mail.com', password: 'a12sd3' });
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer: ${login.body.jwt}`);

		expect(res.body.email).toBe('test3@mail.com');
	});

	it('Info - error', async () => {
		const login = await request(application.app)
			.post('/users/login')
			.send({ email: 'test3@mail.com', password: 'a12sd3' });
		const res = await request(application.app).get('/users/info').set('Authorization', `Bearer: 1`);

		expect(res.statusCode).toBe(401);
	});
});

afterAll(() => {
	application.close();
});
