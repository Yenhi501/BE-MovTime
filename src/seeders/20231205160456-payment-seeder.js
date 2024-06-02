'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		// Seed 10 rows of payment data
		const paymentsData = [];

		for (let i = 0; i < 10; i++) {
			const payment = {
				payment_type: 'Paypal',
				price: Math.random() * 100, // Replace with your logic for generating random prices
				order_info: `Order ${i + 1}`,
				transaction_id: `Transaction${i + 1}`,
				status: 'Completed',
				subscription_info_id: 2,
				is_payment: true,
				user_id: 1, // Replace with the actual user ID
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			paymentsData.push(payment);
		}
		for (let i = 0; i < 10; i++) {
			const payment = {
				payment_type: 'VN Pay',
				price: Math.random() * 100, // Replace with your logic for generating random prices
				order_info: `Order ${i + 1}`,
				transaction_id: `Transaction${i + 1}`,
				status: 'Completed',
				subscription_info_id: 2,
				is_payment: true,
				user_id: 2, // Replace with the actual user ID
				createdAt: new Date('2022-12-12'),
				updatedAt: new Date(),
			};
			paymentsData.push(payment);
		}
		for (let i = 0; i < 10; i++) {
			const payment = {
				payment_type: 'VN Pay',
				price: Math.random() * 100, // Replace with your logic for generating random prices
				order_info: `Order ${i + 1}`,
				transaction_id: `Transaction${i + 1}`,
				status: 'Completed',
				subscription_info_id: 3,
				is_payment: true,
				user_id: 3, // Replace with the actual user ID
				createdAt: new Date('2022-12-12'),
				updatedAt: new Date(),
			};
			paymentsData.push(payment);
		}

		// Use queryInterface.bulkInsert to seed the data
		await queryInterface.bulkInsert('payments', paymentsData, {});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('payments', null, {});
	},
};
