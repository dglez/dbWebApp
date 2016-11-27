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



 router.post('/:db/:table/', function (req, res, next) {

     var dbObj = getDbObjects(req);
     var sql = getInsertSql(dbObj);

     connection.query(sql, function (err, rows, fields) {

         res.send((err)? {error: err, query:sql} :{error: null, query:sql});
     });

});


/*-----------------------------------------------------------------------+
 *    "/contacts/:id"
 *    GET: find contact by id
 *    PUT: update contact by id
 */


 router.put('/:db/:table/:id', function (req, res, next) {

 	var dbObj = getDbObjects(req);
 	var sql = getUpdateSql(dbObj);
console.log(sql);
 	connection.query(sql, function (err, rows, fields) {

 		res.send((err)? {error: err, query:sql} :{error: null, query:sql});
 	});

 });



/*-----------------------------------------------------------------------+
 *    ":db/:table/:id"
 *    DELETE: deletes contact by id
 */

 router.delete('/:db/:table/:id', function (req, res, next) {

     var dbObj = getDbObjects(req);
     var sql = getDeleteSql(dbObj);

     connection.query(sql, function (err, rows, fields) {

         res.send((err)? {error: err, query:sql} :{error: null, query:sql});
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
 		db: (req.params.db)? req.params.db : {},
 		table: (req.params.table)? req.params.table : {},
 		id: (req.params.id)? req.params.id : {},
 		key: (req.body.key)? req.body.key : {},
 		values: (req.body.values)? req.body.values : {}
 	};
 }


 function getUpdateSql(dbObj) {
 	return "UPDATE `" + dbObj.db + "`.`" + dbObj.table + "` " +
 	"SET " + dbObj.values + " " +
 	"WHERE `" + dbObj.key + "`='" + dbObj.id + "';";
 }
function getInsertSql(dbObj) {

    return "INSERT INTO `" + dbObj.db + "`.`" + dbObj.table + "` " +
        "VALUES (" + dbObj.values + ");" ;

}

function getDeleteSql(dbObj) {

    return "DELETE FROM `" + dbObj.db + "`.`" + dbObj.table +
        "` WHERE `" + dbObj.key + "` = '" + dbObj.id + "';"
}


 

 module.exports = router;