import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import * as fs from 'fs';
import passport from 'passport';
import 'reflect-metadata';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yaml';
import Database from './config/database';
import './middleware/Passport';
import AuthenticationRouter from './route/AuthenticationRoutes';
import CommentRouter from './route/CommentRoutes';
import EpisodeRouter from './route/EpisodeRoutes';
import GenreRouter from './route/GenreRoutes';
import HomeRouter from './route/HomeRoutes';
import IndividualRouter from './route/IndividualRoutes';
import MovieRouter from './route/MovieRoutes';
import PaymentRouter from './route/PaymentRoutes';
import RatingRouter from './route/RatingRoutes';
import StatisticalRouter from './route/StatisticalRoutes';
import SubscriptionRouter from './route/SubscriptionRoutes';
import UserRouter from './route/UserRoutes';
import { setupSchedule } from './utils/ScheduleTask';

class App {
	public app: Application;

	constructor() {
		this.app = express();
		this.databaseSync();
		this.plugins();
		this.routes();
		this.initSchedule();
	}

	private databaseSync(): void {
		const movieRepository = Database.getInstance();
		movieRepository
			.sequelize!.sync({ force: false })
			.then(() => {
				// console.log('✅ Cơ sở dữ liệu đã được đồng bộ hóa.');
			})
			.catch((error) => {
				console.error('❌ Lỗi đồng bộ hóa cơ sở dữ liệu:', error);
			});
	}

	private routes(): void {
		this.app.route('/').get((req: Request, res: Response) => {
			res.send('Test API!!!');
		});
		this.app.use('/api/movies', MovieRouter);
		this.app.use('/api/auth', AuthenticationRouter);
		this.app.use('/api/user', UserRouter);
		this.app.use('/api/home', HomeRouter);
		this.app.use('/api/individuals', IndividualRouter);
		this.app.use('/api/episode', EpisodeRouter);
		this.app.use('/api/subscription', SubscriptionRouter);
		this.app.use('/api/payments', PaymentRouter);
		this.app.use('/api/genres', GenreRouter);
		this.app.use('/api/comments', CommentRouter);
		this.app.use('/api/ratings', RatingRouter);
		this.app.use('/api/statisticals', StatisticalRouter);

		const yamlFile = fs.readFileSync('swagger-api.yaml', 'utf8');
		const options = yaml.parse(yamlFile);
		this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(options));
	}

	private plugins(): void {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(passport.initialize());

		// Enable CORS for all routes
		this.app.use(cors()); // Use the cors middleware here
	}

	private initSchedule(): void {
		// Khởi tạo cron job
		setupSchedule()
	}
}

const port: number = 8000;
const app = new App().app;

app.listen(port, () => {
	console.log(`✅ Server started successfully at Port: ${port}`);
});

// var path = require('path');
// var options = {
// 	key: fs.readFileSync(path.resolve('src/ssl/key.pem')),
// 	cert: fs.readFileSync(path.resolve('src/ssl/cert.pem')),
// };

// // Tích hợp SSL/TLS với server
// const httpsServer = https.createServer(options, app);

// Lắng nghe trên cổng 4000 (hoặc bất kỳ cổng bạn muốn sử dụng)
// const httpsPort: number = 8000;
// httpsServer.listen(httpsPort, () => {
// 	console.log(`✅ Server started successfully at Port: ${httpsPort}`);
// });

// if (cluster.isPrimary === true) {
// 	const CPUS: any = cpus();
// 	CPUS.forEach(() => cluster.fork());
// } else {
// 	app.listen(port, () => {
// 		console.log(`✅ Server started successfully at Port: ${port}`);
// 	});
// }
