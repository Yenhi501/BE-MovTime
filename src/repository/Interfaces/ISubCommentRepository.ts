import { SubComment } from "../../models/SubComment";
import { BaseInterface } from "./BaseInterface"

export interface ISubCommentRepository extends BaseInterface{
    addSubComment(comment: Partial<SubComment>): Promise<SubComment>;
}