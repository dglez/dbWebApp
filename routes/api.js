var express = require('express');
var router = express.Router();
var connection = require('../db.js');


// API doc for users
router.get('/', function (req, res, next) {

	var message = "You are using my api\n to use my api use:\n";
	res.send(message);

});

/*-----------------------------------------------------------------------+
 *	"/table"
 *    GET: finds all records from table that is requested
 *    POST: creates a new record
 */
 router.get('/:table?', function (req, res, next) {

 	var sql = "SELECT * FROM " + req.params.table;

 	connection.query(sql, function (err, rows, fields) {

 		var src = '../views/ajaxPartials/query-result';

 		if (err) {
 			res.send(err);
 			return;
 		}
 		sql = "EXPLAIN " + req.params.table;
 		connection.query(sql, function (err2, rows2, fields2) {

 			var key;
 			rows2.forEach(function (row) {
 				if (row.Key == 'PRI'){
 					key = row.Field;
 				}
 			});
 			var viewObject = {
 				layout: false,
 				fields: fields,
 				table:fields[0].table,
 				rows: rows,
 				key: key
 			};
 			if (err2){
 				res.send(err2);
 				return;
 			}
 			res.render(src, viewObject);
 		});


 	});
 });



 router.post('/:table/:id', function (req, res, next) {

    // TODO post

    res.send("i just posted " + req.params.table + " " + req.params.id);

});


/*-----------------------------------------------------------------------+
 *    "/contacts/:id"
 *    GET: find contact by id
 *    PUT: update contact by id
 */


 router.put('/:db/:table/:id', function (req, res, next) {

 	var db = req.params.db;
 	var table = req.params.table;
 	var key = req.body.key;
 	var id = req.params.id;
 	var value = req.body.values;


 	var sql = "UPDATE `" + db + "`.`" + table + "` " + "SET " + value + " " + "WHERE `" + key + "`='" + id + "'";

 	console.log(sql);

 	connection.query(sql, function (err, rows, fields) {

 		res.send((err)? (err + "\n" + sql) : sql);
 	});

 });








/*-----------------------------------------------------------------------+
 *    ":db/:table/:id"
 *    DELETE: deletes contact by id
 */

 router.delete('/:db/:table/:id', function (req, res, next) {

 	var db = req.params.db;
 	var table = req.params.table;
 	var key = req.body.key;
 	var id = req.params.id;

 	var sql = "DELETE FROM `" + db + "`.`" + table + 
 				"` WHERE `" + key + "` = '" + id + "';";

 	connection.query(sql, function (err, rows, fields) {

 		res.send((err)? (err + "\n" + sql) : sql);
 	});
 });





/**
 * Function to get the elements from the db with full
 * qualification when needed.
 *
 * ex:
 * a field from the employees database, departments
 * table is ->
 * `employees`.`departments`.`dept_no`
 *
 * @param req the request object
 */
function getDbObjects(req) {
    return {
        db: req.params.database,
        tbl: "`" + req.params.database + "`.`" + req.params.table + "`",
        id: "'" + req.params.id + "'",
        key: "`" + req.params.database + "`.`" + req.params.table + "`.`" + req.body.key + "`",
        values: req.body.values
    };
}


 module.exports = router;