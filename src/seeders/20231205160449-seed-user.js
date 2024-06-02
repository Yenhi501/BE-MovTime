'use strict';
const getRandomDate = (start, end) => {
	return new Date(
		start.getTime() + Math.random() * (end.getTime() - start.getTime())
	);
};

const getRandomGender = () => {
	const genders = ['Nam', 'Nữ'];
	return genders[Math.floor(Math.random() * genders.length)];
};

const generateRandomEmail = () => {
	const username = 'user' + Math.floor(Math.random() * 10000);
	return `${username}@example.com`;
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		// const userData = [];
		// const subscriptionIds = [1, 2, 3, 4]; // Example subscription IDs
		// const accountIds = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // Example account IDs

		// for (let i = 0; i < 9; i++) {
		//   const user = {
		//     date_of_birth: getRandomDate(new Date(1960, 0, 1), new Date(2005, 0, 1)),
		//     gender: getRandomGender(),
		//     email: generateRandomEmail(),
		//     avatar_url: `users/${i + 1}/avatar.jpg`,
		//     subscription_id: subscriptionIds[Math.floor(Math.random() * subscriptionIds.length)],
		//     account_id: i,
		//     createdAt: new Date(),
		//     updatedAt: new Date(),
		//   };
		//   userData.push(user);
		// }
		// return queryInterface.bulkInsert('Users', userData, {});
		queryInterface.bulkInsert(
			'users',
			[
				{
					date_of_birth: new Date(),
					gender: 'Nam',
					email: 'root@gmail.com',
					role: 0,
					subscription_id: 1,
					avatar_url: `users/1/avatar.jpg`,
					active: true,
					account_id: 1,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					date_of_birth: new Date(),
					gender: 'Nữ',
					email: 'admin@gmail.com',
					role: 1,
					subscription_id: 2,
					active: true,
					avatar_url: `users/2/avatar.jpg`,
					account_id: 2,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					date_of_birth: new Date(),
					gender: 'Nam',
					email: 'user3@gmail.com',
					role: 2,
					subscription_id: 3,
					active: true,
					avatar_url: `users/3/avatar.jpg`,
					account_id: 3,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					date_of_birth: new Date(),
					gender: 'Nữ',
					email: 'user4@gmail.com',
					role: 2,
					subscription_id: 4,
					active: true,
					avatar_url: `users/4/avatar.jpg`,
					account_id: 4,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					date_of_birth: new Date(),
					gender: 'Nam',
					email: 'user5@gmail.com',
					role: 2,
					subscription_id: 5,
					active: true,
					avatar_url: `users/5/avatar.jpg`,
					account_id: 5,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					date_of_birth: new Date(),
					gender: 'Nữ',
					email: 'user6@gmail.com',
					active: true,
					avatar_url: `users/6/avatar.jpg`,
					role: 2,
					subscription_id: 6,
					account_id: 6,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					date_of_birth: new Date(),
					gender: 'Nam',
					email: 'user7@gmail.com',
					role: 2,
					subscription_id: 7,
					active: true,
					avatar_url: `users/7/avatar.jpg`,
					account_id: 7,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					date_of_birth: new Date(),
					gender: 'Nữ',
					email: 'user8@gmail.com',
					role: 2,
					subscription_id: 8,
					active: true,
					avatar_url: `users/8/avatar.jpg`,
					account_id: 8,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					date_of_birth: new Date(),
					gender: 'Nam',
					email: 'user9@gmail.com',
					role: 2,
					subscription_id: 9,
					active: true,
					avatar_url: `users/9/avatar.jpg`,
					account_id: 9,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					date_of_birth: new Date(),
					gender: 'Nữ',
					email: 'user10@gmail.com',
					role: 2,
					subscription_id: 10,
					active: true,
					avatar_url: `users/10/avatar.jpg`,
					account_id: 10,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					date_of_birth: new Date(),
					gender: 'Nữ',
					email: 'user11@gmail.com',
					role: 2,
					subscription_id: 11,
					active: true,
					avatar_url: `users/11/avatar.jpg`,
					account_id: 11,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					date_of_birth: new Date(),
					gender: 'Nữ',
					email: 'user12@gmail.com',
					role: 2,
					subscription_id: 12,
					active: true,
					avatar_url: `users/12/avatar.jpg`,
					account_id: 12,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					date_of_birth: new Date(),
					gender: 'Nữ',
					email: 'user13@gmail.com',
					role: 2,
					subscription_id: 13,
					active: true,
					avatar_url: `users/13/avatar.jpg`,
					account_id: 13,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					date_of_birth: new Date(),
					gender: 'Nữ',
					email: 'user14@gmail.com',
					role: 2,
					subscription_id: 14,
					active: true,
					avatar_url: `users/14/avatar.jpg`,
					account_id: 14,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					date_of_birth: new Date(),
					gender: 'Nữ',
					email: 'user15@gmail.com',
					active: true,
					avatar_url: `users/15/avatar.jpg`,
					role: 2,
					subscription_id: 15,
					account_id: 15,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					date_of_birth: new Date(),
					gender: 'Nữ',
					email: 'user16@gmail.com',
					role: 2,
					subscription_id: 16,
					active: true,
					avatar_url: `users/16/avatar.jpg`,
					account_id: 16,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					date_of_birth: new Date(),
					gender: 'Nữ',
					email: 'user17@gmail.com',
					role: 2,
					subscription_id: 17,
					active: true,
					avatar_url: `users/17/avatar.jpg`,
					account_id: 17,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					date_of_birth: new Date(),
					gender: 'Nữ',
					email: 'user18@gmail.com',
					role: 2,
					subscription_id: 18,
					active: true,
					avatar_url: `users/18/avatar.jpg`,
					account_id: 18,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					date_of_birth: new Date(),
					gender: 'Nữ',
					email: 'user19@gmail.com',
					role: 2,
					subscription_id: 19,
					active: true,
					avatar_url: `users/19/avatar.jpg`,
					account_id: 19,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					date_of_birth: new Date(),
					gender: 'Nữ',
					email: 'user20@gmail.com',
					role: 2,
					subscription_id: 20,
					active: true,
					avatar_url: `users/20/avatar.jpg`,
					account_id: 20,
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
		await queryInterface.bulkDelete('Users', null, {});
	},
};
