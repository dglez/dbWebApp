var express = require('express');
//var handlebars = require('handlebars')
var router = express.Router();
var connection = require('../db.js');



// API doc for users 
router.get('/',function(req, res, next){

	var message = "you are using my api\n to use my api use:\n"
	" Get all reacords: http://localhost:3000/api/records"
	" Get update: http://localhost:3000/api/records/:id"
	" Get delete a reacord: http://localhost:3000/api/records/:id"
	" Get get a record: http://localhost:3000/api/records/:id";

	res.send(message);

});

/*-----------------------------------------------------------------------+
 *	"/records"
 *    GET: finds all records from table that is requested
 *    POST: creates a new record
 */ 
 router.get('/:table?',function(req, res, next){



 	var sql = "SELECT * FROM " + req.params.table;

 	console.log(sql);
 	connection.query(sql, function (err, rows, fields) {
 		
 		console.log(fields);

 		var template = Handlebars.compile(
 		    '../views/ajaxPartials/queryresult',
            {
                fields: fields,
                rows: rows
            });
 		console.log(template);

 		res.send((!err)? template : err);
 	});

 });

 router.post('/',function(req, res, next){

    // TODO post
    res.send();

});




/*-----------------------------------------------------------------------+ 
 *    "/contacts/:id"
 *    GET: find contact by id
 *    PUT: update contact by id
 *    DELETE: deletes contact by id
 */

 router.get('/:table/:id',function(req, res, next){

 	res.send("im here");

 });


 router.put('/:id',function(req, res, next){

 	var message = "you just updated id : " + req.params.id;
 	res.send(message);

 });
 router.delete('/:id',function(req, res, next){

 	var message = "you just deleted id : " + req.params.id;
 	res.send(message);

 });







 module.exports = router;