'use strict';

// discount!: number;

// subscriptionTypeId!: number;

// durationId!: number;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'subscription_infos',
			[
				{
					discount: 0,
					subscription_type_id: 1,
					duration_id: 1,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					discount: 0,
					subscription_type_id: 2,
					duration_id: 2,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					discount: 0.1,
					subscription_type_id: 2,
					duration_id: 3,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					discount: 0.2,
					subscription_type_id: 2,
					duration_id: 4,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					discount: 0.3,
					subscription_type_id: 2,
					duration_id: 5,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					discount: 0,
					subscription_type_id: 3,
					duration_id: 2,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					discount: 0.1,
					subscription_type_id: 3,
					duration_id: 3,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					discount: 0.2,
					subscription_type_id: 3,
					duration_id: 4,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					discount: 0.3,
					subscription_type_id: 3,
					duration_id: 5,
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
		await queryInterface.bulkDelete('subscription_infos', null, {});
	},
};
