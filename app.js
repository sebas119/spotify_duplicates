var express = require('express'); // Express web server framework
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.use(express.static(__dirname + '/views'))
   .use(cookieParser());
app.use(express.static(path.join(__dirname, '/public'))); //disponible todo lo que hay dentro de public
app.use(bodyParser.urlencoded({extended:true})); // parse application/x-www-form-urlencoded 
app.use(bodyParser.json({type: 'application/*+json'})); // parse application/json 

app.use('/', index);
app.use('/user', users)

console.log('Listening on 8888');
app.listen(8888);
