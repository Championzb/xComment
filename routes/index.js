var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

router.get('/emit', function(req, res, next) {
	res.sendFile(path.join(__dirname, '../views/emit.html'));
});

module.exports = router;