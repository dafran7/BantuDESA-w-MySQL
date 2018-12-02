var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var multer = require('multer');
var upload = multer({ dest: './tmp/'});
// Login Layout
router.all('/*', function (req, res, next) {
    req.app.locals.layout = 'layout'; 	// set your layout here
    next(); 							// pass control to the next handler
});

// Get Sayembara Page (semua sayembara)
router.get('/', function(req, res){
	lastUrl = req.originalUrl;

	var db = req.con;
	db.query('SELECT * FROM sayembara', function(err,sayembaras){
		if(err) throw err;
		console.log(sayembaras);
		
		res.render('head-sayembara', {sayembaras:sayembaras});
	});
});

// Get Sayembara tertentu
 function getIdDesa(req, res, next){
	lastUrl = req.originalUrl;
	var db = req.con;
	db.query('SELECT id_desa FROM sayembara WHERE id_sayembara=?', [req.params.id], function(err,id_desa){
		if(err) throw err;
		if(!id_desa){
    		res.render('sayembara', {message: 'Sayembara not found'});
		}
		req.id_desa = id_desa;
		next();
	});
 }

 function getSayembara_Desa(req, res, next){
	lastUrl = req.originalUrl;
	var db = req.con;
	var id_desa = req.id_desa[0].id_desa;
	console.log(id_desa)
	db.query('SELECT sayembara.*, desa.* FROM sayembara JOIN desa ON sayembara.id_desa = desa.id_desa WHERE sayembara.id_desa=?', [id_desa], function(err,sayembara_desa){
		if(err) throw err;
		if(!sayembara_desa){
    		res.render('sayembara', {message: 'Sayembara not found'});
		}
		req.sayembara_desa = sayembara_desa;
		console.log(req.sayembara_desa);
		next();
	});
 }

 function renderSayembaraPage(req, res){
	res.render('sayembara', {
		sayembara_desa: req.sayembara_desa
	});
 }

 router.get('/:id', getIdDesa, getSayembara_Desa, renderSayembaraPage);

// Upload.
// router.post('/:id', upload.single('file'), function(req, res){
// 	var id_user = req.user.id;
// 	var id_sayembara = req.params.id;
// 	var subtopik = req.body.subtopik;

// 	// Upload Image
// 	ext = '.'+req.file.originalname.split(".")[1]
// 	fs.rename(req.file.path, path.join('./public/uploads/file', req.file.filename)+ext)
// 	file_proposal = '/uploads/file/'+req.file.filename+ext;
	
// 	var newPeserta = new Peserta({
// 		id_user: id_user,
// 		id_sayembara: id_sayembara,
// 		file_proposal: file_proposal,
// 		subtopik: subtopik
// 	});

// 	Peserta.createPeserta(newPeserta, function(err, log){
// 		if(err) throw err;
// 	});
// 	res.render('sayembara', {
// 		success_join: 'Succesfully join the Sayembara! Please wait until the Event finished.'
// 	});
// });

module.exports = router;