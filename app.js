var express = require('express'); // Express web server framework
var path = require('path');
var cookieParser = require('cookie-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.use(express.static(__dirname + '/views'))
   .use(cookieParser());
app.use(express.static(path.join(__dirname, '/public'))); //disponible todo lo que hay dentro de public
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


app.use('/', index);
app.use('/user', users)

console.log('Listening on 8888');
app.listen(8888);
