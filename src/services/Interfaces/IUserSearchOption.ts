export interface IUserSearchOption {
	search?: string;
	gender?: string;
	subscriptionType?: '1' | '2' | '3' | '0';
	sort?: 'createdAt' | 'subscriptionType';
	sortType?: 'ASC' | 'DESC';
}
