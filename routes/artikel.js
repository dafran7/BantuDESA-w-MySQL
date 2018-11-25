var express = require('express');
var router = express.Router();


// var Article = require('../models/article');
// Login Layout
router.all('/*', function (req, res, next) {
    req.app.locals.layout = 'layout'; // set your layout here
    next(); // pass control to the next handler
});

// Get Sayembara Page
router.get('/', function(req, res){
	lastUrl = req.originalUrl;

	var db = req.con;
	db.query('SELECT * FROM articles', function(err,articles){
		if(err) throw err;
		console.log(articles);

		res.render('head-article', {articles:articles})
	});

	// Article.getAllArticles({}, {sort: '-tanggal_buat'}, function(err, articles) {
	// 	if(err) throw err;
		
	// 	res.render('head-article', {articles:articles});
	// });
});

router.get('/:id', function(req, res){
	lastUrl = req.originalUrl;

	var db = req.con;
	var query = 'SELECT * FROM articles WHERE id_artikel='+varToString(req.params.id);
	db.query('SELECT * FROM articles WHERE id_artikel=?', [req.params.id], function(err,article){
		if(err) throw err;
		if(!article){
    		res.render('article', {message: 'Article not found'});
		}

		article[0].tanggal_buat = article[0].tanggal_buat.toDateString();
		article[0].isi_artikel = article[0].isi_artikel.replace(/\\n/g, '<br><br>');
		var data = JSON.stringify(article);
    	res.render('article', {article:article});
	});

	// Article.getArticleById(req.params.id, function(err, article){
	// 	if(err) throw err;
	// 	if(!article){
    // 		res.render('article', {message: 'Article not found'});
    // 	}
    // 	res.render('article', {article:article});
	// });
});

module.exports = router;