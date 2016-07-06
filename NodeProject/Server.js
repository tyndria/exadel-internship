var express = require('express');
var path = require('path'); // модуль для парсинга пути
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose  = require('mongoose');
var cors = require('cors');
var mongodb = require("mongodb");


var app = express();

app.use(logger('dev')); // выводим все запросы со статусами в консоль
app.use(bodyParser.json()); // стандартный модуль, для парсинга JSON в запросах
app.use(express.static(path.join(__dirname, 'public'))); // запуск статического файлового сервера, который смотрит на папку public/ (в нашем случае отдает index.html)


var router = express.Router();  


router.get('/fucU', function (req, res) {
    res.send('You are in faq');
});

router.get('/', function (req, res) {
    res.send('API is running');
});

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