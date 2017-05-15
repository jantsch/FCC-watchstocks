'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Stock = new Schema({
	Symbol: String,
	Name: String,
    Exchange: String
});

module.exports = mongoose.model('Stock', Stock);
