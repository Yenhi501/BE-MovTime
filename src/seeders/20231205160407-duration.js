'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'durations',
			[
				{
					time: 0,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					time: 1,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					time: 3,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					time: 6,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					time: 12,
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
		await queryInterface.bulkDelete('durations', null, {});
	},
};
