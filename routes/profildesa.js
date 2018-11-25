var express = require('express');
var router = express.Router();

// Login Layout
router.all('/*', function (req, res, next) {
    req.app.locals.layout = 'layout'; // set your layout here
    next(); // pass control to the next handler
});

// Get Profil desa Page
router.get('/', function(req, res){
	lastUrl = req.originalUrl;

    var db = req.con;

	db.query('SELECT * FROM desa', function(err,desas){
		if(err) throw err;
		console.log(desas);
		
		res.render('profildesa', {desas:desas});
	});
});

module.exports = router;