import Database from '../config/database';
import { Op, QueryTypes, literal, OrderItem, Sequelize } from 'sequelize';
import Container, { Service } from 'typedi';
import { BaseRepository } from './BaseRepository';
import { IReserveRepository } from './Interfaces/IReserveRepository';
import { Reserve } from '../models/Reserve';
import { Movie } from '../models/Movie';
import { User } from '../models/User';
import { Account } from '../models/Account';

const db = Database.getInstance();


@Service()
export class ReserveRepository extends BaseRepository<Reserve> implements IReserveRepository {
	
	constructor(){
		super(Reserve);
	}
    
    async getReserveMovieOfUser(userId: number): Promise<Reserve[]> {
        try {
            const reserves = await this.model.findAll({
                where:{
                    userId: userId
                },
            });
            
            return reserves;
        } catch (error) {
            console.log(error);
            throw(error);
        }
    }

    async getMoviesReserveOfUser(userId: number): Promise<Movie[]> {
        try {
            this.getReservesToSendMail();
            const reserveList = await User.findOne({
				where: { userId: userId },
				attributes: ['userId'],
				include: [
					{
						model: Movie,
						as: 'reserveList',
						attributes: {
							exclude: ['createdAt', 'updatedAt', 'deletedAt'],
						},
						through: { attributes: ['updatedAt'] },
					},
				],
			});
            if(!reserveList){
                return [];
            }
            return reserveList.reserveList;
        } catch (error) {
            console.log(error);
            throw(error);
        }
    }

    async addReserve(data: any): Promise<Reserve> {
        try {
            const rs = await this.model.create(data);
            
            return rs;
        } catch (error) {
            throw (error);
        }
    }

    async getReservesToSendMail(): Promise<Reserve[]> {
        try {
            const ids = this.getListMovieReserve();

            const reserveList = await this.model.findAll({
				include: [
					{
						model: Movie,
                        where: {
                            movieId: {
                              [Op.in]: ids,
                            },
                          },
						attributes: {
							exclude: ['createdAt', 'updatedAt', 'deletedAt'],
						},
					},
				],
                
			});
            if(!reserveList){
                return [];
            }
            return reserveList;
        } catch (error) {
            console.log(error);
            throw(error);
        }
    }

    async getListMovieReserve(): Promise<number[]>{
        try {
            const Ids = [];
    
            // Lấy ngày của ngày mai
            const ngayHienTai = new Date();
            ngayHienTai.setDate(ngayHienTai.getDate()+1);
            // ngayHienTai.setDate(ngayHienTai.getDate() + 1);
            // Lọc theo ngày
            const movies = await Movie.findAll({
              where: {
                releaseDate: literal(`DATE(release_date) = DATE('${ngayHienTai.toISOString()}')`)
              },
              attributes: ['movie_id']
            });

            for (const movie of movies) {
              Ids.push(movie.getDataValue('movie_id'));
            }
            return Ids;
        } catch (error) {
            throw (error);
        }
    }
}