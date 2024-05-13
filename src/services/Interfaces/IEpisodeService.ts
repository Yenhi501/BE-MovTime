import { Episode } from "../../models/Episode";
import { Request } from 'express';

export interface IEpisodeService {
    getEpisode(id: number): Promise<Episode|null>;
    createEpisode(req: Request): Promise<Episode>;
    updateEpisode(req: Request): Promise<[number, Episode[]]>;
    deleteEpisode(req: Request): Promise<boolean>;

}
