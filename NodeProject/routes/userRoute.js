var router = require('express').Router();  

var mongoose  = require('mongoose');
mongoose.model('User', require('../modules/user')); 
var User = mongoose.models.User;

router.post('/createUser', function(req, res) {
	var newUser = new User(req.body);

	newUser.save(function(err) {
		if (err) {
			res.send(err);
		}

		res.send(newUser);
	}); 

});



router.get('/getUsers', function (req, res) {
	User.find({},function(err,users){
		if (err) { 
			res.send(err);
		}

		var userMap = {};
   		users.forEach(function(user) {
    	
      		userMap[user._id] = user;
    });

    res.send(userMap);  
  });
});

router.get('/getUserById/:id', function(req, res) {
	User.findById(req.params.id, function(err, user) {
		if (err) {
           res.send(err);
		}

		res.send(user);
	});
});

module.exports = router;