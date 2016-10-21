var express = require('express');
var path = require('path');
var router = express.Router();
var fs = require('fs');
var http = require('http');
var async = require('async');
var request = require('request');

var configJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/config.json')));
var historyServiceHost = configJson.services.historyService.host;
var historyServicePort = configJson.services.historyService.port;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

router.get('/emit', function(req, res, next) {
	res.sendFile(path.join(__dirname, '../views/emit.html'));
});

router.get('/getCommentHistory', function(req, res, next) {
	async.parallel([
			function(callback) {
				var url = "http://"+ historyServiceHost + ":" + historyServicePort + "/messages/" + req.query.programId;
				request(url, function(err, response, body){
					if(err) { console.log(err); callback(true); return; }
					obj = JSON.parse(body);
					callback(false, obj);
				});
			}
		], 
		function(err, results){
			if (err) {
				console.log(err);
				res.send(500, "Server Error");
				return;
			};
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(results[0]));
	});
	// var data = "";
	// var options = {
	// 	host: historyServiceHost,
	// 	port: historyServicePort,
	// 	path: "/messages/" + req.query.programId
	// };
	// http.get(options, function(resp){
	// 	resp.setEncoding('utf8');
	// 	resp.on('data', function(chunk) {
	// 		// console.log(chunk);
	// 		data = chunk;	
	// 	});
	// }).on("error", function(e){
	// 	console.log("Cannot get History Comment: " + e.message);
	// });

	// res.setHeader('Content-Type', 'application/json');
	// res.send(JSON.stringify(data));
});

module.exports = router;