import { Request } from 'express';

import { Actor } from '../../models/Actor';

export interface IActorService {
	findActorInfomation: (actorId: number) => Promise<Actor | null>;
	createActor: (req: Request) => Promise<void>;
	updateActor: (req: Request) => Promise<Actor | null>;
	findByActorId: (actorId: number) => Promise<Actor | null>;
	deleteActorByActorId: (actorId: number) => Promise<boolean>;
	getActors: (
		search: string,
		page: number,
		pageSize: number
	) => Promise<{
		rows: Actor[];
		count: number;
	}>;
	getPresignUrlToUploadAvatar: (actorId: number) => Promise<string|null>;
	// getPopularActors: (page: number, pageSize: number) => Promise<{ rows: Actor[]; count: number }>;
}
