var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var multer = require('multer');
var upload = multer({ dest: './tmp/'});

var icon = {Infrastruktur: "INFRABULungu.png", 
			Pakan: "PAKANBULoren.png", 
			Pangan: "PANGANBULbiru.png",
			Pariwisata: "PARIBULpink.png"};

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

		for (var i = 0; i < sayembaras.length; i++) {
			sayembaras[i].tanggal_awal = sayembaras[i].tanggal_awal.toDateString();
			sayembaras[i].tanggal_akhir = sayembaras[i].tanggal_akhir.toDateString();
			sayembaras[i].gambar = icon[sayembaras[i].topik];
		}

		console.log(sayembaras);
		
		res.render('head-sayembara', {sayembaras:sayembaras});
	});
});

// Get Sayembara tertentu
 // function getIdDesa(req, res, next){
	// lastUrl = req.originalUrl;
	// var db = req.con;
	// db.query('SELECT id_desa FROM sayembara WHERE id_sayembara=?', [req.params.id], function(err,id_desa){
	// 	if(err) throw err;
	// 	if(!id_desa){
 //    		res.render('sayembara', {message: 'Sayembara not found'});
	// 	}
	// 	req.id_sayembara = req.params.id;
	// 	next();
	// });
 // }

 function getSayembara_Desa(req, res, next){
	lastUrl = req.originalUrl;
	var db = req.con;
	// console.log(id_desa)
	db.query('SELECT sayembara.*, desa.* FROM sayembara JOIN desa ON sayembara.id_desa = desa.id_desa WHERE sayembara.id_sayembara=?', [req.params.id], function(err,sayembara_desa){
		if(err) throw err;
		if(!sayembara_desa){
    		res.render('sayembara', {message: 'Sayembara not found'});
		}
		console.log(sayembara_desa[0].tanggal_awal);
		
		sayembara_desa[0].tanggal_awal = sayembara_desa[0].tanggal_awal.toDateString();
		sayembara_desa[0].tanggal_akhir = sayembara_desa[0].tanggal_akhir.toDateString();

		req.sayembara_desa = sayembara_desa;
		console.log(sayembara_desa);
		next();
	});
 }

 function renderSayembaraPage(req, res){
	res.render('sayembara', {
		sayembara_desa: req.sayembara_desa
	});
 }

 router.get('/:id', getSayembara_Desa, renderSayembaraPage);

// Upload.
router.post('/:id', upload.single('file'), getSayembara_Desa, function(req, res){ // ':/id', upload.single('file'), function
 	console.log(req.user.id_user)
	var id_user = req.user.id_user;
	var id_sayembara = req.params.id;
	let subtopik = req.body.subtopik;
	// var tgl_kirim = Date.now();
	var zz = "z";

	ext = '.'+req.file.originalname.split(".")[1];
	fs.rename(req.file.path, path.join('./public/uploads/file', req.file.filename)+ext);
	var file_proposal = '/uploads/file/'+req.file.filename+ext;

	req.checkBody('file', 'File proposal dibutuhkan').notEmpty();
	req.checkBody('topik', 'Topik dibutuhkan').notEmpty();
	
	console.log(id_user)
	console.log(subtopik)
	var db = req.con;
	db.query('INSERT INTO peserta (id_sayembara, id_user, subtopik, \
			file_proposal) VALUES (?,?,?,?)',[id_sayembara, id_user, subtopik, file_proposal], function (err, peserta) {
			if (err) throw err;
		});

	res.render('sayembara', {
		sayembara_desa: req.sayembara_desa,
		ikut_msg: 'Succesfully join the Sayembara! Please wait until the Event finished.'
	});
});

module.exports = router;