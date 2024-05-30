import { Request, Response } from 'express';
import Container from 'typedi';
import { RatingService } from '../services/RatingService';
import { IStatisticalService } from '../services/Interfaces/IStatisticalService';
import { StatisticalService } from '../services/StatisticalService';

export class StatisticalController{
	private statisticalService: IStatisticalService;

	constructor() {
		this.statisticalService = Container.get(StatisticalService);
	}

    getRevenueStatistics = async (req: Request, res: Response) => {
        try {
            const revenueStatistics = await this.statisticalService.getRevenueStatistics(req);
            res.status(200).json({
                message: "successful",
                data: revenueStatistics
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Server Error",
            })
        }
    }  
    
    getStatisticsMoviesByGenres = async (req: Request, res: Response) => {
        try {
            const rs = await this.statisticalService.getStatisticsMoviesByGenres();
            res.status(200).json({
                message: "successful",
                data: rs
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Server Error",
            })
        }
    }  

    getStatisticsComments = async (req: Request, res: Response) => {
        try {
            const {comments, subComments} = await this.statisticalService.getStatisticsComments(req);
            res.status(200).json({
                message: "successful",
                data: {
                    comments: comments,
                    subComments: subComments
                }
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Server Error",
            })
        }
    } 
}