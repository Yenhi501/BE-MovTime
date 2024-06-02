'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'subscription_types',
			[
				{
					name: 'Cơ bản',
					price: 0,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					name: 'Tiêu chuẩn',
					price: 59000,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					name: 'Cao cấp',
					price: 99000,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{}
		);
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		await queryInterface.bulkDelete('subscription_types', null, {});
	},
};
