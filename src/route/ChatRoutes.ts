import { ChatController } from '../controller/ChatController';
import BaseRoutes from './Base/BaseRouter';
class ChatRoutes extends BaseRoutes {
	constructor() {
		super(new ChatController());
	}
	public routes(): void {
		this.router.post('/', this.controller.chat);

	}
}

export default new ChatRoutes().router;
