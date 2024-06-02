'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'watch_laters',
			[
				{
					user_id: 1,
					movie_id: 1,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					user_id: 1,
					movie_id: 2,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					user_id: 1,
					movie_id: 3,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					user_id: 1,
					movie_id: 10,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					user_id: 1,
					movie_id: 11,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					user_id: 1,
					movie_id: 20,
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
		await queryInterface.bulkDelete('WatchLater', null, {});
	},
};
