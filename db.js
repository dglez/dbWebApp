var mysql = require('mysql');
var fs = require('fs');

// reading connection file
var content = fs.readFileSync('./dbCredentials.json');
var credentials = JSON.parse(content);

// creating connection 
var connection = mysql.createConnection(credentials);

module.exports.connect = function () {
    connection.connect(function (err) {

        if (err) {
            console.error("error connection" + err.stack);
            return;
        }
        console.log("I was able to connnect" + connection.threadId);
    });
};

module.exports.query = function (sql, callback) {
    connection.query(sql, function (err, rows, fields) {

        if (err) {
            return callback(err, {}, {});
        }
        return callback(err, rows, fields);
    });
};




