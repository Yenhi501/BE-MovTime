import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface Payload {
	userId?: number;
	role?: number;
	username: string;
	subscriptionTypeId?: number;
}

class Authentication {
	public static passwordHash(password: string): Promise<string> {
		return bcrypt.hash(password, 10);
	}

	public static async passwordCompare(
		text: string,
		encryptedText: string
	): Promise<boolean> {
		return await bcrypt.compare(text, encryptedText);
	}

	public static generateAccessToken(
		id: number,
		role: number,
		username: string,
		subscriptionTypeId: number
	) {
		const secretKey: string = process.env.JWT_SECRET_KEY || 'my-secret-key';
		const payload: Payload = {
			userId: id,
			role: role,
			username: username,
			subscriptionTypeId: subscriptionTypeId,
		};
		const optionAccess = { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN };
		return jwt.sign(payload, secretKey, optionAccess);
	}

	public static generateRefreshToken(username: string) {
		const secretKey: string = process.env.JWT_SECRET_KEY || 'my-secret-key';
		const payload: Payload = {
			username: username,
		};
		const optionRefresh = { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN };
		return jwt.sign(payload, secretKey, optionRefresh);
	}

	public static validateToken(token: string): Payload | null {
		try {
			const secretKey: string = process.env.JWT_SECRET_KEY || 'my-secret-key';
			return jwt.verify(token, secretKey) as Payload;
		} catch (err) {
			return null;
		}
	}
}

export default Authentication;
