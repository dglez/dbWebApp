var express = require('express');
var router = express.Router();
var handlebars = require('handlebars');
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

    var sql = "SELECT * FROM " + req.params.table + " LIMIT 10";

    connection.query(sql, function (err, rows, fields) {

        var src = '../views/ajaxPartials/query-result';
        var viewObject = {
            fields: fields,
            rows: rows
        };

        if (err) {
            res.send(err);
            return;
        }

        res.render(src, viewObject);
    });
});

router.post('/', function (req, res, next) {

    // TODO post
    res.send();

});


/*-----------------------------------------------------------------------+
 *    "/contacts/:id"
 *    GET: find contact by id
 *    PUT: update contact by id
 *    DELETE: deletes contact by id
 */

router.get('/:table/:id', function (req, res, next) {

    res.send("im here");

});


router.put('/:id', function (req, res, next) {

    var message = "you just updated id : " + req.params.id;
    res.send(message);

});
router.delete('/:id', function (req, res, next) {

    var message = "you just deleted id : " + req.params.id;
    res.send(message);

});


module.exports = router;