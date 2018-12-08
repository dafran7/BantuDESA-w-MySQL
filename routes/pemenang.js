var express = require('express');
var router = express.Router();

router.all('/*', function (req, res, next) {
    req.app.locals.layout = 'layout'; // set your layout here
    next(); // pass control to the next handler
});

// Get Sayembara Page (semua sayembara)
router.get('/', function(req, res){
	lastUrl = req.originalUrl;

	var db = req.con;
	db.query('SELECT * FROM sayembara', function(err,sayembaras){
		if(err) throw err;

		for (var i = 0; i < sayembaras.length; i++) {
			sayembaras[i].tanggal_awal = sayembaras[i].tanggal_awal.toDateString();
			sayembaras[i].tanggal_akhir = sayembaras[i].tanggal_akhir.toDateString();
			sayembaras[i].gambar = icon[sayembaras[i].topik];
		}

		console.log(sayembaras);
		
		res.render('head-sayembara', {sayembaras:sayembaras});
	});
});

//Get list peserta dari id sayembara
router.get('/:id', function(req, res){
	lastUrl = req.originalUrl;

	var db = req.con;
	var query = 'SELECT * FROM peserta WHERE id_sayembara='+varToString(req.params.id);
	db.query('SELECT * FROM peserta WHERE id_sayembara=?', [req.params.id], function(err,peserta){
		if(err) throw err;
		if(!peserta){
    		res.render('peserta', {message: 'Peserta not found'});//ini buat apa?
		}

		//peserta[0].tanggal_buat = article[0].tanggal_buat.toDateString();
		//article[0].isi_artikel = article[0].isi_artikel.replace(/\\n/g, '<br><br>');
		var data = JSON.stringify(peserta);
    	res.render('article', {article:article});//ini buat apa? (2)
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