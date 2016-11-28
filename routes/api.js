var express = require('express');
var router = express.Router();
var connection = require('../db.js');


/*-----------------------------------------------------------------------+
 *	  Search
 *    GET: finds all records from table that is requested
 *    POST: creates a new record
 */
router.get('/search/:title', function (req, res, next) {


    var dbObj = getDbObjects(req);
    var sql = getSearchSql(req);

    connection.query(sql, function (err, rows, fields) {

		console.log(fields);
        var src = '../views/ajaxPartials/search-result';
        var viewObject = {
            layout: false,
            fields: fields,
            table:"Search Result",
            rows: rows,
            key: {}
        };
        if (err){
            res.send(err);
            return;
        }
        res.render(src, viewObject);

    });

});

/*-----------------------------------------------------------------------+
 *	"/table"
 *    GET: finds all records from table that is requested
 *    POST: creates a new record
 */
 router.get('/:table?', function (req, res, next) {

     var dbObj = getDbObjects(req);
     var sql = getSql(dbObj);



 	connection.query(sql, function (err, rows, fields) {

 		var src = '../views/ajaxPartials/query-result';

 		if (err) {
 			res.send(err);
 			return;
 		}
 		sql = "EXPLAIN " + req.params.table;
 		connection.query(sql, function (err2, rows2, fields2) {

            var key = getPriKeyField(rows2);
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
        "` WHERE `" + dbObj.key + "` = '" + dbObj.id + "';";
}

function getSearchSql(req) {

 	var sql = "SELECT d.title, d.bookCode, author.authorFirst , author.authorLast, d.publisherCode AS pcode, d.publisherName AS pname, d.city, d.branchName, d.branchLocation, d.OnHand"
    + " FROM ( "
    +" SELECT c.title, c.bookCode, c.publisherCode, c.OnHand, c.branchName, c.branchLocation , c.publisherName, c.city, wrote.authorNum"
    +" FROM ("
    +" SELECT b.title, b.bookCode, b.publisherCode, b.OnHand, b.branchName, b.branchLocation , publisher.publisherName, publisher.city"
    +" FROM ("
    +" SELECT a.title, a.bookCode, a.publisherCode, a.OnHand, Branch.branchName, Branch.branchLocation"
    +" FROM ("
    +" SELECT Book.title, Book.bookCode, Book.publisherCode, Inventory.OnHand, Inventory.BranchNum"
    +" FROM Book"
    +" JOIN Inventory"
    +" ON Book.bookCode=Inventory.BookCode"
    +" WHERE title LIKE " +  "'" + "%"+ req.params.title + "%" +  "'"  + ") AS a"
    +" JOIN Branch ON a.branchNum = Branch.branchNum) AS b"
    +" JOIN Publisher on b.publisherCode = Publisher.publisherCode) AS c"
    +" JOIN wrote ON c.bookCode = wrote.bookCode) AS d"
    +" JOIN author ON d.authorNum = author.authorNum;";
 	console.log(sql);
	return sql ;
}

function getSql(dbObj) {
	return "SELECT * FROM " + dbObj.table;
}

function getPriKeyField(rows) {
    var key = {};
 	rows.forEach(function (row) {
        if (row.Key == 'PRI'){
            key = row.Field;
        }
    });
 	return key;
}
 

 module.exports = router;