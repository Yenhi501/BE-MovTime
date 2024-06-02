import { Service } from "typedi";
import { Payment } from "../models/Payment";
import { BaseRepository } from "./BaseRepository";
import { IStatisticalRepository } from "./Interfaces/IStatisticalRepository";
import { Op, QueryTypes, literal, OrderItem, Sequelize } from 'sequelize';
import sequelize from "sequelize/types/sequelize";
import { Genre } from "../models/Genre";
import { Comment } from "../models/Comment";
import { SubComment } from "../models/SubComment";


@Service()
export class StatisticalRepository extends BaseRepository<Payment> implements IStatisticalRepository {
	
	constructor(){
		super(Payment);
	}
    // async getStatisticsComments(startDate: string, endDate: string): Promise<any> {
    //     try{
    //         const comments = await Comment.sequelize!.query(`select DATE_TRUNC('MONTH' , "comments"."createdAt") as month, count(*) from comments group by month`, { type: QueryTypes.SELECT });
    //         const subComments = await SubComment.sequelize!.query(`select DATE_TRUNC('MONTH' , "sub_comments"."createdAt") as month, count(*) from sub_comments group by month`, { type: QueryTypes.SELECT });
    //         return {
    //             comments,
    //             subComments
    //         };
    //     }catch(error){
    //         console.log(error);
    //         throw(error);
    //     }    
    // }

    async getStatisticsComments(startDate: string, endDate: string): Promise<any> {
        try {
            const comments = await Comment.sequelize!.query(
                `SELECT DATE_TRUNC('MONTH' , "createdAt") as month, COUNT(*) 
                FROM comments 
                WHERE "createdAt" >= :startDate AND "createdAt" <= :endDate
                GROUP BY month`,
                {
                    replacements: { startDate, endDate },
                    type: QueryTypes.SELECT,
                }
            );
    
            const subComments = await SubComment.sequelize!.query(
                `SELECT DATE_TRUNC('MONTH' , "createdAt") as month, COUNT(*) 
                FROM sub_comments 
                WHERE "createdAt" >= :startDate AND "createdAt" <= :endDate
                GROUP BY month`,
                {
                    replacements: { startDate, endDate },
                    type: QueryTypes.SELECT,
                }
            );
    
            return {
                comments,
                subComments,
            };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    

    async getStatisticsMoviesByGenres(): Promise<any[]> {
        try{
            const rs = await Genre.sequelize!.query("SELECT genres.genre_id, genres.name, count(movie_genres.movie_id) FROM public.genres left join movie_genres on genres.genre_id = movie_genres.genre_id group by genres.genre_id order by count DESC", { type: QueryTypes.SELECT });
            return rs;
        }catch(error){
            console.log(error);
            throw(error);
        }
    }

    getRevenueStatistics(startDate: string, endDate: string, statisBy: string, rawStringUserId: string): Promise<any[]> {
         try {
            const sequelize = this.model.sequelize;
            if(!sequelize){
                return this.model.findAll({
                });
            }
            return sequelize.query(`
            SELECT 
                ${this.getSelectExpression('payments', statisBy)} AS interval,
                SUM("payments"."price") AS total_price
            FROM 
                "payments"
            WHERE
                "payments"."createdAt" BETWEEN '${startDate}' AND '${endDate}' ${rawStringUserId}
                AND "payments"."is_payment" = true
            GROUP BY 
                interval
            ORDER BY 
                interval;
        `, {
            type: QueryTypes.SELECT,
            raw: true,
        });
         } catch (error) {
            console.log(error);
            throw(error);
         }
    }

    getSelectExpression(table: string, statisBy: string): string {
        switch (statisBy) {
            case 'year':
                return `EXTRACT(YEAR FROM "${table}"."createdAt")`;
            case 'month':
                return `DATE_TRUNC('month', "${table}"."createdAt")`;
            case 'week':
                return `EXTRACT(WEEK FROM "${table}"."createdAt")`;
            case 'day':
                return `DATE_TRUNC('day', "${table}"."createdAt")`;
            case 'paymentType':
                return `"${table}"."payment_type"`;
            default:
                throw new Error(`Invalid statisBy value: ${statisBy}`);
        }
    }

    
}