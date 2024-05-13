import { Episode } from "../../models/Episode";
import { BaseInterface } from "./BaseInterface";

export interface IEpisodeRepository extends BaseInterface{
    getEpisode(id: number):Promise<Episode|null>
    getEpisodes(searchCondition:any,page:Number,pageSize:Number):Promise<Episode>
    createEpisode(episode: any): Promise<Episode>
    updateEpisode(episodeId: number ,updatedData: Partial<Episode>): Promise<[number, Episode[]]>;
    getAllEpisodeOfMovie(movie_id: number): Promise<Episode[]>;
    updateNumEpisodeInMovie(movieId: number, n: number): Promise<boolean>;
    getTheLastEpisodeOfMovie(movieId: number): Promise<Episode[]>;
}