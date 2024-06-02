'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const seedData =[];
		const numUser = 20;
		for(let i = 1;i<= numUser;i++){
				seedData.push({
					user_id: i,
					movie_id: getRandomInt(1, 20),
					createdAt: new Date(),
					updatedAt: new Date(),
				});
				seedData.push({
					user_id: i,
					movie_id: getRandomInt(21, 40),
					createdAt: new Date(),
					updatedAt: new Date(),
				});
				seedData.push({
					user_id: i,
					movie_id: getRandomInt(41, 62),
					createdAt: new Date(),
					updatedAt: new Date(),
				});
		}
		await queryInterface.bulkInsert(
			'movie_favorites',
			seedData,
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
		await queryInterface.bulkDelete('MovieFavorite', null, {});
	},
};

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
  }