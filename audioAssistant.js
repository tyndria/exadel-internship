var mongoose  = require('mongoose');
var UserAnswer = mongoose.models.UserAnswer;

var Singleton = (function () {

    var userAnswers;
    var instance;
 
    function createInstance() {
        var object = new Object("I am the instance");
        userAnswers = [];
        return object;
    }

 
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        },
        setMessage: function(message) {
            userAnswers.push(message);
        }
    };
})();

module.exports = Singleton;