var router = require('express').Router();  

router.use('/users', require('./userRoute'));
router.use('/answers', require('./answerRoute'));
router.use('/tests', require('./testRoute'));

module.exports = router;