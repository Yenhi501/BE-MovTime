'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert('genres', [
			{
				name: 'Hành động',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: 'Hài kịch',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: 'Khoa học viễn tưởng',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: 'Tình cảm',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: 'Kinh dị',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: 'Phiêu lưu',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: 'Hoạt hình',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: 'Tiên hiệp',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: 'Tội phạm',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: 'Lãng mạn',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: 'Thần thoại',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: 'Tiểu thuyết chuyển thế',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: 'Võ thuật',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: 'Thanh Xuân',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: 'Bí ẩn',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: 'Gia đình',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: 'Chính trị',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: 'Tâm lý',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: 'Cổ trang',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: 'Kỳ ảo',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: 'LGBT',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: 'Học Đường',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: 'Hài hước',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: 'Tình bạn',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('Genres', null, {});
	},
};
