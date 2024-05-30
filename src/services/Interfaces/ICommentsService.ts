import { Comment } from "../../models/Comment";
import { Request } from 'express';
import { SubComment } from "../../models/SubComment";

export interface ICommentService {
    addComment(req: Request): Promise<Comment|null>;
    deleteComment(req: Request): Promise<boolean>;
    updateComment(req: Request): Promise<Comment|null>;
    addSubComment(req: Request): Promise<SubComment|null>;
    deleteSubComment(req: Request): Promise<boolean>;
    updateSubComment(req: Request): Promise<SubComment|null>;
}
