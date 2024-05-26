import Database from '../config/database';
import { Op, QueryTypes, literal, OrderItem, Sequelize, ModelCtor } from 'sequelize';
import Container, { Service } from 'typedi';
import { IHomeRepository } from './Interfaces/IHomeRepository';
import { Genre } from '../models/Genre';
import { BaseRepository } from './BaseRepository';
import { Movie } from '../models/Movie';
import { Home } from '../models/Home';

const db = Database.getInstance();


@Service()
export class HomeRepository extends BaseRepository<Genre> implements IHomeRepository {

    private homeModel: ModelCtor<Home>;

    constructor(){
		super(Genre);
        this.homeModel = Home;
	}

    getMoviesByGenre(page: number, pageSize: number): Promise<Genre[]> {

        const offset = (page - 1) * pageSize;

        return this.model.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'deletedAt']
            },
            include: [{
                model: Movie,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'deletedAt', 'trailerURL']
                },
                through: { attributes: [] },
            }],
            order:[
                ['genre_id','ASC'],
            ],
            limit: pageSize, // Số lượng kết quả trên mỗi trang
            offset: offset, // Vị trí bắt đầu
        }).then((genres: Genre[]) => {
            // Xử lý dữ liệu ở đây để giữ lại chỉ 10 phim ở mỗi thể loại
            const processedGenres = genres.map((genre) => {
                const movies = genre.movies.slice(0, 10); // Chỉ giữ lại 10 phim
                return { ...genre.toJSON(), movies: movies };
            });
    
            return processedGenres;
        });
    }
    
    async getHomePoster(): Promise<Home[]> {
        try {
            const homes = await this.homeModel.findAll({
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'deletedAt']
                },
                include: [{
                    model: Movie,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'deletedAt', 'trailerURL']
                    },
                }],
            });
            return homes;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách homes:', error);
            throw error;
        }
    }
    
    async getMoviesOfGenre(genreId: number ,page: number, pageSize: number): Promise<Genre[]> {

        const offset = (page - 1) * pageSize;

        return this.model.findAll({
            where:{
                genre_id: genreId
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'deletedAt']
            },
            include: [{
                model: Movie,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'deletedAt', 'trailerURL']
                },
                through: { attributes: [] },
            }],
            order:[
                ['genre_id','ASC'],
            ],
            limit: pageSize, // Số lượng kết quả trên mỗi trang
            offset: offset, // Vị trí bắt đầu
        }).then((genres: Genre[]) => {
            // Xử lý dữ liệu ở đây để giữ lại chỉ 10 phim ở mỗi thể loại
            const processedGenres = genres.map((genre) => {
                const movies = genre.movies.slice(0, 10); // Chỉ giữ lại 10 phim
                return { ...genre.toJSON(), movies: movies };
            });
    
            return processedGenres;
        });
    }
}
