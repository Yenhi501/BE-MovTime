import { Request, Response } from 'express';
import Container from 'typedi';
import IChatService from '../services/Interfaces/IChatService';
import { ChatService } from '../services/ChatService';

export class ChatController{
	private chatService: IChatService;

	constructor() {
		this.chatService = Container.get(ChatService);
	}

    chat = async (req: Request, res: Response) => {
        try{
            const rs = await this.chatService.chat(req);
            return res.status(200).json({
                message: "Success",
                data: rs
            });
        }catch(error){
            res.status(500).json({
                message: "Server error"
            });
        }
    }
}