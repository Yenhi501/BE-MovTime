import { Service } from "typedi";
import { User } from "../models/User";
import { BaseRepository } from "./BaseRepository";
import { SubComment } from "../models/SubComment";
import { Comment } from "../models/Comment";
import { ICommentRepository } from "./Interfaces/ICommentRepository";

@Service()
export class CommentRepository extends BaseRepository<Comment> implements ICommentRepository{

    constructor(){
		super(Comment);
	}

    addComment(comment: Partial<Comment>): Promise<Comment> {
        try {
            return this.model.create(comment);
        } catch (error) {
            throw(error);
        }
    }

    getCommentsByEpisodeId(episodeId: number, page: number, pageSize:number): Promise<Comment[]> {
        try {
            const offset = (page - 1) * pageSize;
            return this.model.findAll({ 
		        attributes: { exclude: ['deletedAt', 'userId', 'episodeId'] },
                where: {episode_id: episodeId},
                include: [
                    {
                        model: User, // Assuming the model for subcomments is named 'Subcomment'
                        attributes: ['user_id','email', 'gender', 'avatar_url'],
                    },
                    {
                        model: SubComment,
                        attributes: { exclude: ['deletedAt','userId'] },
                        //   required: true,
                        include:[
                            {
                                model: User,
                                attributes: ['user_id','email', 'gender', 'avatar_url'],
                            },
                        ],
                        order: [['createdAt', 'DESC']],
                    },
                ],
                limit: pageSize, // Số lượng kết quả trên mỗi trang
                offset: offset, // Vị trí bắt đầu
                order: [['createdAt', 'DESC']],
             });
        } catch (error: any) {
			throw new Error('Can not get comments: ' + error.message);
        }
    }

}
