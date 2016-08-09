
module.exports = {
	READING_ID: '578e1ac0364a9658259c61d6',
	LEXICAL_GRAMMAR_ID: '578e1ab7364a9658259c61d5',
	LISTENING_ID: '578e1ac7364a9658259c61d7',
	SPEAKING_ID: '578e1acd364a9658259c61d8',
	LEVELS: ['A1', 'A2', 'B1', 'B2', 'C1'],
	USER_ROLE: '0',
	TEACHER_ROLE: '1',
	ADMIN_ROLE: '2',
	MAP_LEVEL_COST: {
		'A1': 10,
	 	'A2': 15,
	 	'B1': 20,
	 	'B2': 25,
	 	'C1': 30
	}, 
	MAP_NOTIFICATION: {
		'0': function(userName) {
			return 'User ' + userName + ' has requested a test';
			},
		'1': function(userName) {
			return 'User ' +  userName + ' has passed a test';
		},
		'2': function(teacherName) {
			return 'Teacher ' + teacherName + 'has checked a test';
		}
	},
	MAP_RESULT: (result) => {
		// have to consult with english teacher
		return 'B1';
	},
	MAP_CONCLUSION: {
		LEXICAL_GRAMMAR_ID: '<p>You should improve:\
                            <a href="http://www.englishpage.com/verbpage/presentperfect.html">Present Perfect</a>,\
                            <a href="http://www.englishpage.com/verbpage/presentperfectcontinuous.html">Present Perfect\
                                Continuous</a> </p>',
        READING_ID: '<p>It would be great to improve your reading. There are some books to read:\
        	<a href="http://freenovelonline.com/241093-harry-potter-and-the-philosophers-stone.html">Garry Potter 1</a>,\
        	<a href="http://freenovelonline.com/241094-harry-potter-and-the-chamber-of-secrets.html">Garry Potter 2</a></p>',
        SPEAKING_ID: '<p>It would be great to improve your speaking. There are some films to watch:\
        	<a href="http://www.englishpage.com/verbpage/presentperfect.html">Garry Potter</a></p>',
        LISTENING_ID: '<p>It would be great to improve you listening. There are some films to watch:\
        	<a href="http://www.englishpage.com/verbpage/presentperfect.html">Garry Potter</a></p>s',
	}
};