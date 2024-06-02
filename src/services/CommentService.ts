import { Inject, Service } from "typedi";
import { ICommentService } from "./Interfaces/ICommentsService";
import { CommentRepository } from "../repository/CommentRepository";
import { ICommentRepository } from "../repository/Interfaces/ICommentRepository";
import { Request } from "express";
import { ParsedQs } from "qs";
import { Comment } from "../models/Comment";
import { ParamsDictionary } from "express-serve-static-core";
import { SubComment } from "../models/SubComment";
import { SubCommentRepository } from "../repository/SubCommentRepository";
import { ISubCommentRepository } from "../repository/Interfaces/ISubCommentRepository";

@Service()
export class CommentService implements ICommentService {


	@Inject(() => CommentRepository)
	private commentRepository!: ICommentRepository;

    @Inject(() => SubCommentRepository)
	private subCommentRepository!: ISubCommentRepository;

    async deleteComment(req: Request): Promise<boolean> {
        try {
            const commentId = Number(req.params.commentId);
            
            const userId = Number(req.payload.userId);

            const comment = await this.commentRepository.findById(commentId);
            if (comment && comment.userId === userId) {
                await this.commentRepository.delete(comment, true);
                return true;
            }
            return false;
        } catch (error) {
            throw(error);
        }
    }

    async updateComment(req: Request): Promise<Comment | null> {
        try {
            const commentId = Number(req.params.commentId);
            const userId = Number(req.payload.userId);
            const updatedContent = req.body.content;
            
            const commentToUpdate = await this.commentRepository.findById(commentId);
            
            if(!commentToUpdate || userId !== commentToUpdate.userId){
                return null;
            }
            commentToUpdate.content = updatedContent;
            await this.commentRepository.save(commentToUpdate);
            return commentToUpdate;
        } catch (error) {
            throw(error);
        }
    }

    async addComment(req: Request): Promise<Comment | null> {
        try {
            
            if(!req.body.episodeId ){
                return null;
            }
            const userId = Number(req.payload.userId);
            
            if(!userId){
                return null;
            }
            const data: Partial<Comment> = {
                userId: userId,
                episodeId: req.body.episodeId,
                content: req.body.content || '',
                numLike: '0',
                createdAt: new Date(),
                updatedAt: new Date(),

            };
            const comment = await this.commentRepository.addComment(data);
            return comment;
        } catch (error) {
            console.error(error);
            throw(error);
        }
        
    }

    async addSubComment(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<SubComment | null> {
        try {
            
            if(!req.body.parentId ){
                return null;
            }
            const userId = Number(req.payload.userId);
            
            if(!userId){
                return null;
            }

            const parentComment = await this.commentRepository.findOneByCondition({
                id: req.body.parentId
            });
            if(!parentComment){
                return null;
            }
            const data: Partial<SubComment> = {
                userId: userId,
                parentId: req.body.parentId,
                content: req.body.content || '',
                numLike: '0',
                createdAt: new Date(),
                updatedAt: new Date(),

            };
            const comment = await this.subCommentRepository.addSubComment(data);
            return comment;
        } catch (error) {
            console.error(error);
            throw(error);
        }
    }
    async deleteSubComment(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<boolean> {
        try {
            const subCommentId = Number(req.params.subCommentId);
            
            const userId = Number(req.payload.userId);

            const comment = await this.subCommentRepository.findById(subCommentId);
            if (comment && comment.userId === userId) {
                await this.subCommentRepository.delete(comment, true);
                return true;
            }
            return false;
        } catch (error) {
            throw(error);
        }
    }
    async updateSubComment(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): Promise<SubComment | null> {
        try {
            const subCommentId = Number(req.params.subCommentId);
            const userId = Number(req.payload.userId);
            const updatedContent = req.body.content;
            
            const commentToUpdate = await this.subCommentRepository.findById(subCommentId);
            
            if(!commentToUpdate || userId !== commentToUpdate.userId){
                return null;
            }
            commentToUpdate.content = updatedContent;
            await this.commentRepository.save(commentToUpdate);
            return commentToUpdate;
        } catch (error) {
            throw(error);
        }    
    }
}
