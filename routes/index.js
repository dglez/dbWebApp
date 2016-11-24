var express = require('express');
var router = express.Router();
var connection = require('../db.js');

// Query getting all tables
var tables = {};
var sql = "show tables";
connection.query(sql, function (err, rows) {

	if(err) {
		tables = err;
	}

	tables = rows;
});

/* GET home page. */
router.get('/', function(req, res, next) {

    var viewObject = {
        title: req.app.locals.title,
        tables: tables
    };

	res.render('index', viewObject);
});

module.exports = router;
