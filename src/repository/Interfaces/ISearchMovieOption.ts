export interface ISearchMovieOption {
	search?: string;
	genre?: string;
	nation?: string;
	year?: number;
	isSeries?: boolean;
	sort?: 'highRated' | 'newest' | 'highFavorited';
	sortType?: 'ASC'|'DESC';
	level?:number;
}