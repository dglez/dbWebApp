var express = require('express');
var router = express.Router();
var connection = require('../db.js');

// Query getting all tables
var tables = {};
var field = {};
var dbname = {};
var sql = "show tables";
connection.query(sql, function (err, rows, fields) {
    tables = (!err)? rows : err ;
    field = fields;
});

sql = "SELECT DATABASE()";
connection.query(sql, function (err, rows, fields) {
    dbname = (!err)? rows : err ;
});

/* GET home page. */
router.get('/', function(req, res, next) {

    var viewObject = {
        title: req.app.locals.title,
        tables: tables,
        dbname: dbname
    };

	res.render('index', viewObject);
});

module.exports = router;
