import { Comment } from "../../models/Comment";
import { Episode } from "../../models/Episode";
import { Request } from 'express';
import { Quality } from "../../models/Quality";

export interface IEpisodeService {
    getEpisode(id: number): Promise<Episode|null>;
    getCommentsOfEpisode(episodeId: number, page: number, pageSize:number): Promise<Comment[]>;
    createEpisode(req: Request): Promise<Episode>;
    updateEpisode(req: Request): Promise<[number, Episode[]]>;
    deleteEpisode(req: Request): Promise<boolean>;
    getPresignUrlToUploadPosterAndMovie(req: Request): Promise<{ key: string, value: string }[]>;
    checkMovieIsSeries(movieId: number): Promise<boolean>;
    getQualityMovie(req: Request): Promise<Quality|null>;
    clearCacheCloudFrontEpisodes(req: Request): Promise<void>;
    getPresignUrlToUploadQuality(req: Request): Promise<string>;

}
