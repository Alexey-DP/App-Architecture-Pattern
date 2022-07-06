import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import 'reflect-metadata';
import { UsersController } from './users/users.controller';
import { PrismaService } from './database/prisma.service';
import { AuthMiddleWare } from './common/auth.middleware';
import { IConfigService } from './config/config.service.interface';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UsersController) private userController: UsersController,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = 7777;
		this.logger = logger;
		this.userController = userController;
		this.exeptionFilter = exeptionFilter;
	}

	useMiddleware(): void {
		this.app.use(express.json());
		const authMiddleWare = new AuthMiddleWare(this.configService.get('SECRET'));
		this.app.use(authMiddleWare.execute.bind(authMiddleWare));
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	useExeptionFilters(): void {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExeptionFilters();
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`Server started for http://localhost:${this.port}...`);
	}

	public close(): void {
		this.server.close();
	}
}
