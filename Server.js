var express = require('express');
var path = require('path'); // модуль для парсинга пути
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongodb = require('mongodb');

var mongoose  = require('mongoose');

var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost:27017/austenDB';

 mongoose.connect(uristring, function (err, res) {
    if (err) {
      console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
      console.log ('Succeeded connected to: ' + uristring);
    }
});
var port = process.env.PORT || 8083;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'error connection:'));
db.once('open', function() {

	console.log('Success!');
});

var app = express();

app.use(logger('dev')); // выводим все запросы со статусами в консоль
app.use(bodyParser.json()); // стандартный модуль, для парсинга JSON в запросах
app.use(express.static(path.join(__dirname, 'public'))); // запуск статического файлового сервера, который смотрит на папку public/ (в нашем случае отдает index.html)

//require models 
mongoose.model('User', require('./modules/user')); 
mongoose.model('Test', require('./modules/test'));
mongoose.model('Answer', require('./modules/answer')); 
mongoose.model('Topic', require('./modules/topic'));
mongoose.model('UsersAnswer', require('./modules/usersAnswer')); 
mongoose.model('Question', require('./modules/question'));
mongoose.model('Task', require('./modules/task'));

//import main router

var router = require('./routes/index');
app.use('/api', router);

app.listen(port, function(){
    console.log('Express server listening on port:'+ 8083);
});

app.use(cors());

app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

