import { Service } from 'typedi';
import { BaseRepository } from '../BaseRepository';
import { IEpisodeRepository } from './IEpisodeRepository';
import { Episode } from '../../models/Episode';
import { Movie } from '../../models/Movie';

@Service()
export class EpisodeRepository extends BaseRepository<Episode> implements IEpisodeRepository{

    constructor(){
		super(Episode);
	}

    async getEpisode(id: number): Promise<Episode | null> {
        try{
            const episode = await this.model.findByPk(id,{
                attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] },
                // include: [
                //     {
                //         model: Comment,
                //         attributes: { exclude: ['deletedAt'] },
                //         include: [
                //             {
                //                 model: User, // Assuming the model for subcomments is named 'Subcomment'
                //                 attributes: { exclude: ['deletedAt'] },
                //             },
                //             {
                //               model: SubComment, // Assuming the model for subcomments is named 'Subcomment'
                //               attributes: { exclude: ['deletedAt'] },
                //               include: [
                //                     {
                //                         model: User, // Assuming the model for subcomments is named 'Subcomment'
                //                         attributes: { exclude: ['deletedAt'] },
                //                     },
                //                 ],
                //             },
                //         ],
                //         limit: 10, // Limit the number of comments to 10
                //     },
                // ]
            });
            return episode || null;
        }catch (error: any) {
			throw new Error('Can not get Episode: ' + error.message);
		}
    }

    async getEpisodes(searchCondition: any, page: Number, pageSize: Number): Promise<Episode> {
        throw new Error('Method not implemented.');
    }

    async createEpisode(episode: any): Promise<Episode> {
        try {
            const newEpisode = await this.model.create(episode);
            await this.updateNumEpisodeInMovie(newEpisode.movieId,1);
            return newEpisode;
        } catch (error) {
            throw(error);
            
        }
    }

    async updateNumEpisodeInMovie(movieId: number, n: number): Promise<boolean>
    {
        try {
            const movie = await Movie.findByPk(movieId);
            if(movie){
                movie.episodeNum = movie.episodeNum + n;
                movie.save();
                return true;
            }
            return false;
        } catch (error) {
            throw(error);
        }
    }

    async updateEpisode(episodeId: number ,updatedData: Partial<Episode>): Promise<[number, Episode[]]> {
        try {
            const [rowsAffected, updatedMovies] = await this.model.update(updatedData, {
				where: { episodeId },
				returning: true, // Return the updated records
			  });
			return [rowsAffected, updatedMovies];
        } catch (error) {
            throw(error);
        }
    }

    async getAllEpisodeOfMovie(movie_id: number): Promise<Episode[]> {
        try {
            const episodes = await this.model.findAll({
              where: {
                movie_id: movie_id,
              },
            });
            return episodes;
        } catch (error: any) {
            throw(error);
        }
    }

    async getTheLastEpisodeOfMovie(movieId: number): Promise<Episode[]> {
        try {
            const episodes = await this.model.findAll({
              where: {
                movie_id: movieId,
              },
              order: [['episodeNo', 'DESC']],
              limit :1
            });
            return episodes;
        } catch (error: any) {
            throw(error);
        }
    }
}