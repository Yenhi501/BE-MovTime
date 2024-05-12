import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import * as fs from 'fs';
import passport from 'passport';
import 'reflect-metadata';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yaml';
import Database from './config/database';
import './middleware/Passport';

class App {
	public app: Application;

	constructor() {
		this.app = express();
		this.databaseSync();
		this.plugins();
		this.routes();
		// this.initSchedule();
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

	// private initSchedule(): void {
	// 	// Khởi tạo cron job
	// 	setupSchedule()
	// }
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
