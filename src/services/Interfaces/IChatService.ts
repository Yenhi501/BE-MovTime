import { Request } from 'express';

interface IChatService {
	chat(req: Request) : Promise<string>;
}
export default IChatService;
