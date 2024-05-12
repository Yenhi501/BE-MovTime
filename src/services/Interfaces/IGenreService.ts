import { Genre } from "../../models/Genre";
import { Request } from 'express';

export interface IGenreService {
    getAllGenres(): Promise<Genre[]>;
    createGenre(req: Request): Promise<Genre>;
    updateGenre(req: Request): Promise<Genre>;
    deleteGenre(req: Request): Promise<boolean>;
}
