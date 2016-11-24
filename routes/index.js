var express = require('express');
var router = express.Router();
var connection = require('../db.js');


// Query getting all tables
var tables = {};
var sql = "show tables";
connection.query(sql, function (err, rows) {

	tables = (!err)? rows : err ;
});



/* GET home page. */
router.get('/', function(req, res, next) {

	res.render('index', {
		title: 'Company DB',
		tables: tables
	});
	
});

module.exports = router;
