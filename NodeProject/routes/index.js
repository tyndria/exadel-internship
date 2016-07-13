var router = require('express').Router();  

router.use('/users', require('./userRoute'));
router.use('/answers', require('./answerRoute'));
router.use('/userAnswers', require('./userAnswerRoute'));
router.use('/tests', require('./testRoute'));
router.use('/questions', require('./questionRoute'));
router.use('/topics', require('./topicRoute'));
router.use('/tasks', require('./taskRoute'));
router.use('/notifications', require('./notificationRoute'));

module.exports = router;