import { Request } from 'express';
import { Director } from '../../models/Director';

interface IDirectorService {
	findDirectortorInfomation: (directorId: number) => Promise<Director | null>;
	createDirector: (req: Request) => Promise<void>;
	updateDirector: (req: Request) => Promise<Director | null>;
	findByDirectorId: (directorId: number) => Promise<Director | null>;
	deleteDirector: (directorId: number) => Promise<boolean>;
	getAllDirector: () => Promise<Director[]>;
	getDirectors: (
		search: string,
		page: number,
		pageSize: number
	) => Promise<{ rows: Director[]; count: number }>;
	getPresignUrlToUploadAvatar: (actorId: number) => Promise<string|null>;

}

export default IDirectorService;
