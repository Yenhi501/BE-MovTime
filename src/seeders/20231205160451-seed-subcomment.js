'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const commentIds = Array.from({ length: 10000 }, (_, index) => index + 1); // Assume you have 10 comments
		const subComments = [];
		for (const commentId of commentIds) {
			const numSubComments = getRandomNumber(0, 20);

			for (let i = 0; i < numSubComments; i++) {
				subComments.push({
					parent_id: commentId,
					user_id: getRandomNumber(1, 20),
					content: getRandomSentence(),
					num_like: getRandomNumber(0, 1000),
					createdAt: new Date(),
					updatedAt: new Date(),
				});
			}
		}

		await queryInterface.bulkInsert('sub_comments', subComments, {});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('sub_comments', null, {});
	},
};

function getRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomSentence() {
	const sentences = [
		'Quả thực là tuyệt vời!',
		'Cảm ơn bạn đã chia sẻ!',
		'Phần này thật hấp dẫn.',
		'Tôi đã xem đi xem lại nhiều lần.',
		'Ý tưởng tuyệt vời!',
		'Cảm ơn đoạn hội thoại này.',
		'Hóng chờ tập kế tiếp.',
		'Nhân vật chính quá đẹp trai!',
		'Cảnh quay này làm tôi xúc động.',
		'Hài hước quá đi!',
		'Bạn nên xem nếu chưa xem.',
		'Tuyệt vời, tôi thích cách bạn nghĩ.',
		'Kịch bản rất sáng tạo.',
		'Đây là tình huống khó khăn thực sự.',
		'Nhân vật phụ này thật đáng yêu.',
		'Tôi muốn có thêm nhiều như vậy!',
		'Cảm ơn bạn đã làm tôi cười.',
		'Nghệ thuật quay phim tuyệt vời.',
		'Câu chuyện rất gần gũi.',
		'Chúc mừng đoàn làm phim!',
		'Thích cách biểu đạt ý tưởng.',
		'Bạn thực sự làm rơi nước mắt tôi.',
		'Điểm nhấn của bộ phim!',
		'Sự giao thoa giữa các nhân vật rất tốt.',
		'Nhạc nền đẹp mắt.',
		'Không ngờ tới cái kết này.',
		'Thích cách quay mắt của diễn viên.',
		'Mọi tình tiết đều hợp lý.',
		'Cám ơn đã chia sẻ cảm xúc của bạn.',
		'Chất lượng hình ảnh rất tốt.',
		'Tôi đồng cảm với nhân vật này.',
		'Phim đã tạo ra ấn tượng mạnh mẽ.',
		'Cảnh này làm tôi ngạc nhiên.',
		'Bạn đã chọn âm nhạc tuyệt vời.',
		'Không gì làm tôi phải than phiền.',
		'Đề xuất xem phim vào buổi tối.',
		'Tôi không thể tin được vào mắt mình.',
		'Cảnh nào cũng đều tuyệt vời.',
		'Diễn viên chính diễn xuất rất tốt.',
		'Phát triển nhân vật rất chi tiết.',
		'Sự gián đoạn tốt được thể hiện.',
		'Cảnh hành động rất phấn khích.',
		'Không có gì để phàn nàn.',
		'Cảm ơn bạn đã tạo ra bộ phim này.',
		'Tình tiết rất hấp dẫn.',
		'Tôi đã thấy mình trong nhân vật này.',
		'Chúc mừng vì công sức của bạn.',
		'Tình huống này quá đặc sắc.',
		'Mọi thứ đều hài hòa.',
		'Thật khó tin vào kết quả cuối cùng.',
		"Tôi cũng cảm thấy như vậy, đó là một tác phẩm xuất sắc!",
		"Cốt truyện thực sự là điểm độc đáo của bộ phim.",
		"Đúng vậy, diễn viên đã thể hiện vai diễn của họ rất xuất sắc.",
		"Nhạc nền thật sự đã làm nổi bật mọi cảm xúc.",
		"Tôi đồng ý, có nhiều chi tiết thú vị mà nhiều người bỏ qua.",
		"Bộ phim lãng mạn này khiến tôi tin vào tình yêu đích thực.",
		"Hiệu ứng đặc biệt đã làm cho bộ phim trở nên sống động hơn.",
		"Mặc dù không phải là bom tấn, nhưng phim vẫn có giá trị xem.",
		"Cảnh quay thiên nhiên thực sự làm cho bộ phim trở nên hấp dẫn.",
		"Bối cảnh thời gian thường tạo ra sự độc đáo cho bộ phim.",
		"Phim hài tình cảm luôn là lựa chọn tốt cho gia đình.",
		"Đó là một kiệt tác không thể nào quên được.",
		"Những tình tiết không lường trước làm cho bộ phim thêm phần hấp dẫn.",
		"Tôi đã cười lăn lộn với những tình huống trong phim.",
		"Đúng, bất ngờ là điều làm nổi bật bộ phim này.",
		"Phim tâm lý này thực sự đưa ra nhiều suy nghĩ sâu sắc.",
		"Câu chuyện đã mở ra một thế giới huyền bí và phức tạp.",
		"Diễn viên trẻ thường làm cho bộ phim trở nên trẻ trung hơn.",
		"Đó là một bức tranh tuyệt vời về cuộc sống đô thị.",
		"Sự kết hợp giữa hài hước và cảm động thực sự là độc đáo.",
		"Không thể tin được kết cục của câu chuyện, đúng không?",
		"Bạn nhận xét đúng, phim làm cho tôi cảm thấy như mình ở trong thế giới đó.",
		"Tôi thích việc phim đặt ra những câu hỏi sâu sắc về đời sống.",
		"Bộ phim kinh điển này là một tác phẩm nghệ thuật.",
		"Phim truyền đạt thông điệp của mình một cách rất tốt.",
		"Tình tiết thú vị và khó đoán làm tăng tính hấp dẫn của bộ phim.",
		"Đồ hoạ đẹp là một điểm nhấn của phim, dù nó không phải là hoạt hình.",
		"Các pha hành động đầy kịch tính, thực sự thú vị.",
		"Bộ phim này thực sự là một kiệt tác điện ảnh.",
		"Tôi đã không thể rời mắt khỏi màn hình từ đầu đến cuối.",
		"Bức tranh xã hội trong phim rất sâu sắc và ý nghĩa.",
		"Nhân vật chính là điểm đặc biệt của bộ phim.",
		"Bộ phim thường xuyên đặt ra những vấn đề quan trọng.",
		"Các tình tiết gây sốc thực sự khiến tôi bất ngờ.",
		"Tôi thấy mình hòa mình vào câu chuyện ngay từ đầu.",
		"Ý tưởng mới và độc đáo làm cho bộ phim trở nên khác biệt.",
		"Tôi thích cách phim khám phá tâm lý con người.",
		"Bộ phim mang lại nhiều cảm xúc khác nhau.",
		"Câu đối thoại sâu sắc thường làm nổi bật bộ phim.",
		"Tôi đã học được rất nhiều từ câu chuyện này.",
		"Không thể dừng lại khi đã bắt đầu xem phim này.",
		"Phim đã thay đổi cách nhìn của tôi về thế giới.",
		"Tôi muốn xem lại nhiều lần nữa để thưởng thức chi tiết.",
		"Nếu bạn thích sự kịch tính, đây là bộ phim dành cho bạn."
	];
	const randomIndex = getRandomNumber(0, sentences.length - 1);
	return sentences[randomIndex];
}
