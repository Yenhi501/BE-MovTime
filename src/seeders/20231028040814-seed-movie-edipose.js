'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const episodesData = [];
		const booleanSequence = [
			true, true, true, true, true, false, false, false, true, true,
			false, false, false, false, false, false, true, true, false, false,
			false, false, false, false, false, false, false, true, true, false,
			false, false, false, false, false, true, true, true, true, true, true,
			true, true, true, true, false, false, false, false, false, false, false,
			false, false, false, false, false, false, false, false, false, false, false, false
		  ];
		  const numericSequence = [
			30, 40, 45, 50, 1, 1, 1, 1, 35, 20, 1, 1, 1, 1, 1, 1, 55, 25, 1, 1,
			1, 1, 1, 1, 1, 1, 10, 10, 1, 1, 1, 1, 1, 1, 35, 46, 21, 25, 35, 40,
			30, 30, 30, 30, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,1,1
		  ];
		for (let movieId = 1; movieId <= 64; movieId++) {
			if(booleanSequence[movieId-1] ===true){
				for (let episodeNo = 1; episodeNo <= numericSequence[movieId-1]; episodeNo++) {
					episodesData.push({
						movie_id: movieId,
						title: 'Tập '.concat(episodeNo),
						release_date: new Date(),
						poster_url: 'movies/'+movieId+'/background.jpg',
						movie_url: 'movies/'+movieId+'/episodes/'.concat(episodeNo, '/movie.mp4'),
						num_view: Math.floor(Math.random() * (10000 + 1)),
						duration: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
						episode_no: episodeNo,
						createdAt: new Date(),
						updatedAt: new Date(),
					});
				}
			}else{
				episodesData.push({
					movie_id: movieId,
					title: 'Tập '.concat(1),
					release_date: new Date(),
					poster_url: 'movies/'+movieId+'/background.jpg',
					movie_url: 'movies/'+movieId+'/episodes/'.concat(1, '/movie.mp4'),
					num_view: Math.floor(Math.random() * (10000 + 1)),
					duration: Math.floor(Math.random() * (100 - 1 + 1)) + 1,
					episode_no: 1,
					createdAt: new Date(),
					updatedAt: new Date(),
				});
			}
		}

		await queryInterface.bulkInsert('episodes', episodesData, {});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('episodes', null, {});
	},
};
