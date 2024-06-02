'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const quanlitiesData = [];
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
    const totalMovies = 64;
    let countEpisodeId =1;
    for(let i =1; i<=64 ;i++){
      if(booleanSequence[i-1] ===true){
        for(let j = 1; j<= numericSequence[i-1]; j++){
          const quanlity = {
            episode_id: countEpisodeId,
            video_quality: '1080p',
            video_url: 'movies/'+i+'/episodes/'+j+'/movie_1080p.mp4',
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          const quanlity4k = {
            episode_id: countEpisodeId,
            video_quality: '4k',
            video_url: 'movies/'+i+'/episodes/'+j+'/movie_4k.webm',
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          quanlitiesData.push(quanlity);
          quanlitiesData.push(quanlity4k);
  
          countEpisodeId = countEpisodeId+1;
        }
      }else{
        const quanlity = {
          episode_id: countEpisodeId,
          video_quality: '1080p',
          video_url: 'movies/'+i+'/episodes/'+1+'/movie_1080p.mp4',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const quanlity4k = {
          episode_id: countEpisodeId,
          video_quality: '4k',
          video_url: 'movies/'+i+'/episodes/'+1+'/movie_4k.webm',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        quanlitiesData.push(quanlity);
        quanlitiesData.push(quanlity4k);

        countEpisodeId = countEpisodeId+1;
      }
    }

		await queryInterface.bulkInsert('qualities', quanlitiesData, {});

    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
		await queryInterface.bulkDelete('qualities', null, {});
  }
};
