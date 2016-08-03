
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
		return 'B1';
	}
};