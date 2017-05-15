'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

require('dotenv').load();

mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

routes(app, io);

var port = process.env.PORT || 8080;
http.listen(port, function(){
  console.log('Listening on: ' +port);
});
