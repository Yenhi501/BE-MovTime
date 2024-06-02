import Redis from 'ioredis';
import * as jwt from 'jsonwebtoken';
import { Service } from 'typedi';

@Service()
export class Token {
	private secretKey: string;
	private tokenExpiration: number;
	private redis: Redis; // Create a Redis client

	constructor() {
		this.secretKey = process.env.EMAIL_USER || 'secret-key';
		this.tokenExpiration = 600;

		this.redis = new Redis({
			host: 'redis',
			port: 6379,
		});
	}

	createToken = async (email: string) => {
		const payload = {
			email,
			exp: Math.floor(Date.now() / 1000) + this.tokenExpiration,
		};

		return await jwt.sign(payload, this.secretKey);
	};

	generateToken = async (email: string) => {
		try {
			const token = await this.createToken(email);

			await this.redis.setex(
				token,
				this.tokenExpiration,
				JSON.stringify({ email })
			);
			console.log(token);
			return token;
		} catch (error: any) {
			throw new Error('Error!' + error.message);
		}
	};

	verifyToken = async (token: string): Promise<{ email: string } | null> => {
		return new Promise((resolve, reject) => {
			this.redis.get(token, (err, data) => {
				if (err) {
					reject(err);
				} else if (data) {
					const decoded = jwt.verify(token, this.secretKey) as {
						email: string;
					};
					resolve(decoded);
				} else {
					resolve(null); // Token không tồn tại trong Redis
				}
			});
		});
	};
}
