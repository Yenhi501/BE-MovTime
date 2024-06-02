'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		/**
		 * Add seed commands here.
		 *
		 * Example:
		 * await queryInterface.bulkInsert('People', [{
		 *   name: 'John Doe',
		 *   isBetaMember: false
		 * }], {});
		 */
		await queryInterface.bulkInsert(
			'watch_histories',
			[
				{
					user_id: 1,
					episode_id: 1,
					duration: 5,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					user_id: 1,
					episode_id: 2,
					duration: 5,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					user_id: 1,
					episode_id: 3,
					duration: 5,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					user_id: 1,
					episode_id: 10,
					duration: 5,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					user_id: 1,
					episode_id: 11,
					duration: 5,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					user_id: 1,
					episode_id: 20,
					duration: 5,
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
		await queryInterface.bulkDelete('WatchHistory', null, {});
	},
};
