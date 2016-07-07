var express = require('express');
var path = require('path'); // модуль для парсинга пути
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongodb = require('mongodb');

var mongoose  = require('mongoose');
mongoose.connect('mongodb://localhost:27017/austenDB');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'error connection:'));
db.once('open', function() {

	console.log('Success!');
});

var app = express();

app.use(logger('dev')); // выводим все запросы со статусами в консоль
app.use(bodyParser.json()); // стандартный модуль, для парсинга JSON в запросах
app.use(express.static(path.join(__dirname, 'public'))); // запуск статического файлового сервера, который смотрит на папку public/ (в нашем случае отдает index.html)

//import main router

var router = require('./routes/index');
app.use('/api', router);

app.listen(1337, function(){
    console.log('Express server listening on port 1337');
});

app.use(cors());

app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

