
import { Comment } from "../../models/Comment";
import { BaseInterface } from "./BaseInterface"

export interface ICommentRepository extends BaseInterface{
    getCommentsByEpisodeId(episodeId: number, page: number, pageSize:number): Promise<Comment[]>;
    addComment(comment: Partial<Comment>): Promise<Comment>;
}