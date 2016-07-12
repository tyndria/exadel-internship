var router = require('express').Router();  

router.use('/users', require('./userRoute'));
router.use('/answers', require('./answerRoute'));
router.use('/tests', require('./testRoute'));
router.use('/questions', require('./questionRoute'));
router.use('/topics', require('./topicRoute'));
<<<<<<< HEAD
router.use('/tasks', require('./taskRoute'));

=======
router.use('/notifications', require('./notificationRoute'));
>>>>>>> e77b1c7b90ea226e0479f171ded3782d35066ff1
module.exports = router;