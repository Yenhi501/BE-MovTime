import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import { Account } from '../models/Account';

dotenv.config();

class Database {
	public sequelize: Sequelize | undefined;

	private POSTGRES_DB = process.env.POSTGRES_DB as string;
	private POSTGRES_HOST = process.env.POSTGRES_HOST as string;
	private POSTGRES_PORT = process.env.POSTGRES_PORT as unknown as number;
	private POSTGRES_USER = process.env.POSTGRES_USER as string;
	private POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD as string;
	private POSTGRES_SSL = process.env.POSTGRES_SSL as string;

	private static instance: Database | null = null;

	private constructor() {
		this.connectToPostgreSQL();
	}

	public static getInstance(): Database {
		if (!Database.instance) {
			Database.instance = new Database();
		}
		return Database.instance;
	}

	private async connectToPostgreSQL() {
		let ssl: boolean;
		if (this.POSTGRES_SSL === 'true') {
			ssl = true;
		} else {
			ssl = false;
		}
		this.sequelize = new Sequelize({
			database: this.POSTGRES_DB,
			username: this.POSTGRES_USER,
			password: this.POSTGRES_PASSWORD,
			host: this.POSTGRES_HOST,
			port: this.POSTGRES_PORT,
			dialect: 'postgres',
			logging: false,
			dialectOptions: {
				ssl: ssl,
			},
		});
		this.sequelize.addModels([
			
			Account,
			
		]);

		await this.sequelize
			.authenticate()
			.then(() => {
				// console.log(
				// 	'✅ PostgreSQL Connection has been established successfully.'
				// );
			})
			.catch((err) => {
				console.error('❌ Unable to connect to the PostgreSQL database:', err);
			});
	}
}

export default Database;
