import { Service } from "typedi";
import { Comment } from "../models/Comment";
import { SubComment } from "../models/SubComment";
import { User } from "../models/User";
import { BaseRepository } from "./BaseRepository";
import { ISubCommentRepository } from "./Interfaces/ISubCommentRepository";

@Service()
export class SubCommentRepository extends BaseRepository<SubComment> implements ISubCommentRepository{
// 
    constructor(){
		super(SubComment);
	}

    addSubComment(subComment: Partial<SubComment>): Promise<SubComment> {
        try {
            return this.model.create(subComment);
        } catch (error) {
            throw(error);
        }
    }
}
