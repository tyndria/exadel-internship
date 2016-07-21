var express = require('express');
var path = require('path'); // модуль для парсинга пути
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongodb = require('mongodb');

var port = process.env.PORT || 8083;
var mongoUri = 'mongodb://adminUser:adminUser@ds052408.mlab.com:52408/austendb';

var mongoose  = require('mongoose');
mongoose.connect(mongoUri, function (err, res) {
    if (err) {
      console.log ('ERROR connecting to: ' + mongoUri + '. ' + err);
    } else {
      console.log ('Succeeded connected to: ' + mongoUri);
    }
});

var app = express();

app.use(logger('dev')); // выводим все запросы со статусами в консоль 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public'))); // запуск статического файлового сервера, который смотрит на папку public/ (в нашем случае отдает index.html)

//require models 
mongoose.model('User', require('./modules/user')); 
mongoose.model('Test', require('./modules/test'));
mongoose.model('Answer', require('./modules/answer')); 
mongoose.model('UserAnswer', require('./modules/userAnswer')); 
mongoose.model('Question', require('./modules/question'));
mongoose.model('Task', require('./modules/task'));

//import main router

var router = require('./routes/index');
app.use('/api', router);

app.listen(port, function(){
    console.log('Express server listening on port 8083');
});

app.use(cors());

app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
