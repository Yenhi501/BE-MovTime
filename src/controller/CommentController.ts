import { Request, Response } from 'express';
import Container from 'typedi';
import { ICommentService } from '../services/Interfaces/ICommentsService';
import { CommentService } from '../services/CommentService';

export class CommentController{
	private commentService: ICommentService;

	constructor() {
		this.commentService = Container.get(CommentService);
	}

    addComment = async (req: Request, res: Response) => {
        try {
            const comment = await this.commentService.addComment(req);
            if(comment){
                res.status(200).json({
                    message: "success",
                    data: comment
                })
            }else{
                res.status(200).json({
                    message: "fail",
                    data: comment
                })  
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Server Error",
            })
        }
    }

    deleteComment = async (req: Request, res: Response) => {
        try {
            const result = await this.commentService.deleteComment(req);
            if (result === true) {
                res.status(200).json({
                    message: "deleted success",
                    isDeleted: result
                });
              } else if (result === false) {
                res.status(403).json({ error: 'Forbidden - user does not own the comment or comment not found' });
              } else {
                res.status(404).json({ error: 'Comment not found' });
              }

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Server Error",
            })  
        }
    }

    updateComment = async (req: Request, res: Response) => {
        try {
            const updatedComment = await this.commentService.updateComment(req);
            if (!updatedComment) {
                return res.status(404).json({ error: 'user does not own the comment or comment not found' });
              }
          
              return res.status(200).json({
                message: 'Comment updated successfully',
                comment: updatedComment,
              });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Server Error",
            })  
        }
    }

    addSubComment = async (req: Request, res: Response) => {
        try {
            const comment = await this.commentService.addSubComment(req);
            if(comment){
                res.status(200).json({
                    message: "success",
                    data: comment
                })
            }else{
                res.status(404).json({
                    message: "fail",
                    data: comment
                })  
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Server Error",
            })
        }
    }

    deleteSubComment = async (req: Request, res: Response) => {
        try {
            const result = await this.commentService.deleteSubComment(req);
            if (result === true) {
                res.status(200).json({
                    message: "deleted success",
                    isDeleted: result
                });
              } else if (result === false) {
                res.status(403).json({ error: 'Forbidden - user does not own the comment or comment not found' });
              } else {
                res.status(404).json({ error: 'Comment not found' });
              }

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Server Error",
            })  
        }
    }

    updateSubComment = async (req: Request, res: Response) => {
        try {
            const updatedComment = await this.commentService.updateSubComment(req);
            if (!updatedComment) {
                return res.status(404).json({ error: 'user does not own the comment or comment not found' });
              }
          
              return res.status(200).json({
                message: 'Comment updated successfully',
                comment: updatedComment,
              });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Server Error",
            })  
        }
    }
}
