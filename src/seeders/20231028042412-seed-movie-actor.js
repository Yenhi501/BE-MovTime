'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		// Generate seed data
		let mangVoiKeyLaNumber = {
			1: [1,2,3],
			2: [4,5,6,7,8],
			3: [9,10,11,12],
			4: [13,14,15],
			5: [16,17,18,19],
			6: [20,21,22,23,24],
			7: [25,26,27],
			8: [36,37,38,5],
			9: [39,40,41],
			10: [42,8,7,44],
			11: [44,45,46,47,48],
			12: [57,58],
			13: [52,53,54],
			14: [29,30,31,32],
			15: [28,33,34,35],
			16: [55,56],
			17: [42,51],
			18: [49,50,8],
			19: [59,60,61],
			20: [63,64,65],
			21: [65],
			22: [62,63,64,65,66],
			23: [69],
			24: [67,68,69],
			25: [59,65],
			26: [71,74,76],
			27: [73,74],
			28: [76,78,77],
			29: [76,78],
			30: [74,75,76],
			31: [54,78],
			32: [45,97],
			33: [95,12],
			34: [87,13],
			35: [89,37],
			36: [79,80,44],
			37: [81,82,83,84,85],
			38: [86,87,88],
			39: [89,38],
			40: [90,91,92],
			41: [92,93,94,95],
			42: [96,97],
			43: [93],
			44: [98],
			45: [99,42],
			46: [72, 88, 51, 97],
			47: [15, 29, 60, 83],
			48: [91, 42, 78, 64],
			49: [36, 55, 10, 23],
			50: [13, 68, 77, 94],
			51: [39, 85, 20, 57],
			52: [66, 16, 92, 31],
			53: [74, 43, 26, 81],
			54: [48, 90, 32, 61],
			55: [59, 25, 12, 71],
			56: [65, 50, 19, 84],
			57: [79, 45, 33, 89],
			58: [14, 73, 69, 24],
			59: [49, 38, 93, 58],
			60: [52, 22, 63, 76],
			61: [87, 67, 37, 21],
			62: [11, 82, 54, 27],
			63: [30, 96, 17, 44],
			64: [100,101,102],
		  };
		const totalMovies = 64;
		const seedData = [];
		for (let movie_id = 1; movie_id <= totalMovies; movie_id++) {
			// Each movie will have at least one actor
			if (mangVoiKeyLaNumber.hasOwnProperty(movie_id)) {
				// Lấy mảng giá trị tương ứng với key
				let mangGiaTri = mangVoiKeyLaNumber[movie_id];
				for(const i of mangGiaTri){
					const actor_id = i;
					const createdAt = new Date();
					const updatedAt = new Date();
					seedData.push({ movie_id, actor_id, createdAt, updatedAt });
				}
			  }

		}
		await queryInterface.bulkInsert('movie_actors', seedData, {});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('movie_actors', null, {});
	},
};
