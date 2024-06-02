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
			'subscriptions',
			[
				{
					subscription_type_id: 1,
					closeAt: new Date(),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					subscription_type_id: 2,
					closeAt: new Date(),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					subscription_type_id: 3,
					closeAt: new Date(),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					subscription_type_id: 2,
					closeAt: new Date(),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					subscription_type_id: 1,
					closeAt: new Date(),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					subscription_type_id: 2,
					closeAt: new Date(),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					subscription_type_id: 3,
					closeAt: new Date(),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					subscription_type_id: 2,
					closeAt: new Date(),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					subscription_type_id: 1,
					closeAt: new Date(),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					subscription_type_id: 2,
					closeAt: new Date(),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					subscription_type_id: 1,
					closeAt: new Date(),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					subscription_type_id: 2,
					closeAt: new Date(),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					subscription_type_id: 3,
					closeAt: new Date(),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					subscription_type_id: 2,
					closeAt: new Date(),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					subscription_type_id: 1,
					closeAt: new Date(),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					subscription_type_id: 2,
					closeAt: new Date(),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					subscription_type_id: 3,
					closeAt: new Date(),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					subscription_type_id: 2,
					closeAt: new Date(),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					subscription_type_id: 1,
					closeAt: new Date(),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					subscription_type_id: 2,
					closeAt: new Date(),
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
		await queryInterface.bulkDelete('subscriptions', null, {});
	},
};
