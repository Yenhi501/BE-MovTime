import { Inject, Service } from "typedi";
import { StatisticalRepository } from "../repository/StatisticalRepository";
import { IStatisticalRepository } from "../repository/Interfaces/IStatisticalRepository";
import { IStatisticalService } from "./Interfaces/IStatisticalService";
import { Request } from 'express';


@Service()
export class StatisticalService implements IStatisticalService {

	@Inject(() => StatisticalRepository)
	private statisticalRepository!: IStatisticalRepository;

    getRevenueStatistics(req: Request): Promise<any[]> {
        try {
            let statisBy: string | null = <string>req.query.statisBy || null 
            let startDate: string | null = <string>req.query.startDate || null 
            let endDate: string | null = <string>req.query.endDate || null 
            let userId: number | null = <number>Number(req.query.userId) || null 
            let rawString = "AND payments.user_id="+userId;

            const currentDate = new Date();
            const oneYearAgo = new Date(currentDate);
            oneYearAgo.setFullYear(currentDate.getFullYear() - 10);
            if(!statisBy){
                statisBy ='year';
            }
            if(!startDate){
                startDate = oneYearAgo.toISOString().replace(/T/, ' ').replace(/\..+/, '');
            }
            if(!endDate){
                endDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
            }
            if(!userId){
                rawString = '';
            }

            return this.statisticalRepository.getRevenueStatistics(startDate, endDate, statisBy, rawString);
        } catch (error) {
            throw(error);
        }
    }

    async getStatisticsMoviesByGenres(): Promise<any[]> {
        try{
            return await this.statisticalRepository.getStatisticsMoviesByGenres();
        }catch(error) {
            throw(error);
        }
    }
    async getStatisticsComments(req: Request): Promise<any> {
        try{
            let startDate: string | null = <string>req.query.startDate || null 
            let endDate: string | null = <string>req.query.endDate || null 
            const currentDate = new Date();
            const oneYearAgo = new Date(currentDate);
            if(!startDate){
                startDate = oneYearAgo.toISOString().replace(/T/, ' ').replace(/\..+/, '');
            }
            if(!endDate){
                endDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
            }
            const rs = await this.statisticalRepository.getStatisticsComments(startDate,endDate);
            // console.log(rs);
            return rs;
        }catch(error) {
            throw(error);
        }
    }

}