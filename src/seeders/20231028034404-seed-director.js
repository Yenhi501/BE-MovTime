'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		return queryInterface.bulkInsert('directors', [
			{
				//1
				name: 'Tang Khê Xuyên',
				description:
					'',
				gender: 'Nam',
				date_of_birth: new Date('1955-05-18'),
				avatar: 'default/director/avatar_default.jpg',
				poster: 'default/director/poster_default.jpg',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				//2
				name: 'Quách Kính Minh',
				description:
					'Quách Kính Minh là biên kịch, đạo diễn, nhà văn theo thể loại giả tưởng người Trung Quốc. Trước khi trở thành nhà văn và doanh nhân, anh từng là thần tượng được giới trẻ yêu mến.',
				gender: 'Nam',
				date_of_birth: new Date('1979-02-09'),
				avatar: 'default/director/avatar_default.jpg',
				poster: 'default/director/poster_default.jpg',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				//3
				name: 'Ôn Đức Quang',
				description:
					'',
				gender: 'Nam',
				date_of_birth: new Date('1963-04-26'),
				avatar: 'default/director/avatar_default.jpg',
				poster: 'default/director/poster_default.jpg',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				//4
				name: 'Guo Hu',
				description:
					'',
				gender: 'Nữ',
				date_of_birth: new Date('1965-12-31'),
				avatar: 'default/director/avatar_default.jpg',
				poster: 'default/director/poster_default.jpg',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				//5
				name: 'New Siwaj Sawatmaneekul',
				description:
					'',
				gender: 'Nam',
				date_of_birth: new Date('1963-07-27'),
				avatar: 'default/director/avatar_default.jpg',
				poster: 'default/director/poster_default.jpg',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				// 6
				name: 'Shin-hyo Kang',
				description:
					'',
				gender: 'Nữ',
				date_of_birth: new Date('1974-10-18'),
				avatar: 'default/director/avatar_default.jpg',
				poster: 'default/director/poster_default.jpg',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				//7
				name: 'Sang-ho Yeon',
				description:
					'',
				gender: 'Nam',
				date_of_birth: new Date('1954-04-07'),
				avatar: 'default/director/avatar_default.jpg',
				poster: 'default/director/poster_default.jpg',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				//8
				name: 'Tian Yi',
				description:
					'',
				gender: 'Nữ',
				date_of_birth: new Date('1973-02-27'),
				avatar: 'default/director/avatar_default.jpg',
				poster: 'default/director/poster_default.jpg',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				//10
				name: 'YI yong',
				description:
					'',
				gender: 'Nam',
				date_of_birth: new Date('1961-09-27'),
				avatar: 'default/director/avatar_default.jpg',
				poster: 'default/director/poster_default.jpg',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				//11
				name: 'Li Yu Lei',
				description:
					'',
				gender: 'Nữ',
				date_of_birth: new Date('1979-10-07'),
				avatar: 'default/director/avatar_default.jpg',
				poster: 'default/director/poster_default.jpg',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				//12
				name: 'Ren Haitao',
				description:
					'',
				gender: 'Nam',
				date_of_birth: new Date('1974-04-03'),
				avatar: 'default/director/avatar_default.jpg',
				poster: 'default/director/poster_default.jpg',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				//13
				name: 'LinYi',
				description:
					'',
				gender: 'Nữ',
				date_of_birth: new Date('1981-09-16'),
				avatar: 'default/director/avatar_default.jpg',
				poster: 'default/director/poster_default.jpg',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				// 14
				name: 'Ongart Singlumpong',
				description:
					'',
				gender: 'Nam',
				date_of_birth: new Date('1962-06-27'),
				avatar: 'default/director/avatar_default.jpg',
				poster: 'default/director/poster_default.jpg',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				//15
				name: 'Guo Zheng Huan',
				description:
					'',
				gender: 'Nữ',
				date_of_birth: new Date('1976-03-12'),
				avatar: 'default/director/avatar_default.jpg',
				poster: 'default/director/poster_default.jpg',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				//16
				name: 'Paek Seung Hwan',
				description:
					'',
				gender: 'Nam',
				date_of_birth: new Date('1970-10-21'),
				avatar: 'default/director/avatar_default.jpg',
				poster: 'default/director/poster_default.jpg',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				//17
				name: 'Shu Qi',
				description:
					'',
				gender: 'Nữ',
				date_of_birth: new Date('1976-04-16'),
				avatar: 'default/director/avatar_default.jpg',
				poster: 'default/director/poster_default.jpg',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				//18
				name: 'Yin Tao',
				description:
					'',
				gender: 'Nam',
				date_of_birth: new Date('1962-06-22'),
				avatar: 'default/director/avatar_default.jpg',
				poster: 'default/director/poster_default.jpg',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				//19
				name: 'Mai Guan Zhi',
				description:
					'',
				gender: 'Nữ',
				date_of_birth: new Date('1976-04-16'),
				avatar: 'default/director/avatar_default.jpg',
				poster: 'default/director/poster_default.jpg',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				//20
				name: 'Cúc Giác Lượng',
				description:
					'',
				gender: 'Nam',
				date_of_birth: new Date('1974-08-26'),
				avatar: 'default/director/avatar_default.jpg',
				poster: 'default/director/poster_default.jpg',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				//21
				name: 'Kitamura Tayoharu',
				description:
					'',
				gender: 'Nữ',
				date_of_birth: new Date('1964-09-20'),
				avatar: 'default/director/avatar_default.jpg',
				poster: 'default/director/poster_default.jpg',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				//22
				name: 'Liu Ren Zhi',
				description:
					'',
				gender: 'Nữ',
				date_of_birth: new Date('1964-09-20'),
				avatar: 'default/director/avatar_default.jpg',
				poster: 'default/director/poster_default.jpg',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		return queryInterface.bulkDelete('Directors', null, {});
	},
};
