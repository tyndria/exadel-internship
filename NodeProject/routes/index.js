var router = require('express').Router();  

router.use('/user', require('./userRoute'));
router.use('/answer', require('./answerRoute'));

module.exports = router;