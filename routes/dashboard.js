var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var con = require("../connection");

var User = require('../models/user');
var Article = require('../models/article');
var Sayembara = require('../models/sayembara');
var Peserta = require('../models/peserta');

var multer = require('multer');
var upload = multer({ dest: './tmp/'});

// Login Layout
router.all('/*', function (req, res, next) {
    req.app.locals.layout = 'layout-dashboard'; // set your layout here
    next(); // pass control to the next handler
});

// Get Profil desa Page
router.get('/profildesa', ensureAuthenticated, function(req, res){
	res.render('profildesa');
});

// Get Donasi Page
router.get('/donasi', function(req, res){
	res.render('donasi');
});

// Get Dashboard Page
router.get('/', ensureAuthenticated, function(req, res){
	lastUrl = req.originalUrl;
	var db = req.con;
	var usercode = req.user.usercode;
	console.log("usercode:"+usercode);
	
	if (usercode==3){
		return res.redirect('/dashboard/listArticle');
	}

	if (usercode==0){
		return res.redirect('/dashboard/listUser');
	}

	// Jika user adalah wali desa -> need some tweaking
	id_sayembara = "1";

	db.query('SELECT peserta.*,user.name FROM peserta JOIN user ON \
	peserta.id_user = user.id_user WHERE id_sayembara=?',[id_sayembara], function(err, pesertas){
		// if(err) throw err;

		res.render('dashboard/index', {pesertas: pesertas});
	});

	// Peserta.getAllPeserta({id_sayembara: id_sayembara}, {sort: 'tanggal_buat'}, 
	// 	function(err, pesertas) {
	// 		if(err) throw err;
	// 		if(!pesertas[0]){
	// 			res.render('dashboard/index', {message: 'notfound'});
	// 		}
	// 		else {
	// 			var ids = [];
	// 			for(i=0;i<pesertas.length;i++)
	// 				ids.push(pesertas[i].id_user.toString());
	// 			User.find({'_id': {$in: ids}},null,null, function(err, users){
	// 				if(err) throw err;
	// 				if (users){
	// 					res.render('dashboard/index', {
	// 						pesertas:pesertas,
	// 						users:users
	// 					});
	// 				}
	// 			});
				
	// 		}
	// });
	
	
});

// Get BuatArtikel Page
router.get('/createArticle', ensureAuthenticated, function(req, res){
	res.render('dashboard/createArticle');
});

// Post BuatArtikel Page -> DONE
router.post('/createArticle', ensureAuthenticated, upload.single('file'), function(req, res){
	var judul_artikel = req.body.judul_artikel;
	var isi_artikel = req.body.isi_artikel;
	var deskripsi_singkat = req.body.deskripsi_singkat;
	var tgl_kirim = new Date();
	var topik = req.body.topik;
	var foto = '';
	// var dt = dateTime.create();
	// var tanggal_buat = dt.format('d-m-Y');
	var id_user = req.user.id_user;
	if (req.body.comment=='true')
		var can_comment = 1;
	else
		var can_comment = 0;

	req.checkBody('judul_artikel', 'Judul artikel dibutuhkan').notEmpty();
	req.checkBody('deskripsi_singkat', 'Deskripsi singkat dibutuhkan').notEmpty();
	req.checkBody('isi_artikel', 'Isi artikel dibutuhkan').notEmpty();
	req.checkBody('topik', 'Topik dibutuhkan').notEmpty();
	//req.checkBody('file', 'Header foto dibutuhkan').notEmpty();
	var errors = req.validationErrors();

	// Upload Image. -> DONE
	ext = '.'+req.file.originalname.split(".")[1]
	fs.rename(req.file.path, path.join('./public/uploads/img/articles', req.file.filename)+ext)
	foto = '/uploads/img/articles/'+req.file.filename+ext;

	if(errors){
		res.render('dashboard/createArticle',{
			errors:errors
		});
	} else {
		var db = con;
		db.query('SELECT COUNT(*) FROM articles', function(err,count){
			db.query('INSERT INTO articles (id_artikel, judul_artikel, isi_artikel, deskripsi_singkat, topik, \
				foto, tanggal_buat, can_comment, id_user) \
				VALUES (?,?,?,?,?,?,?,?,?)', [null,judul_artikel,isi_artikel, deskripsi_singkat,topik, foto, tgl_kirim, can_comment, id_user], function(err,rows){
				if(err) throw err;

			});
		});
		// var newArticle = new Article({
		// 	judul_artikel: judul_artikel,
		// 	isi_artikel: isi_artikel,
		// 	deskripsi_singkat: deskripsi_singkat,
		// 	topik: topik,
		// 	foto: foto,
		// 	can_comment: can_comment,
		// 	id_user: id_user
		// });

		// Article.createArticle(newArticle, function(err, user){
		// 	if(err) throw err;
		// 	//console.log(user);
		// });

		res.render('dashboard/createArticle', {
			success_msg: 'You added a new Article! Please wait for confirmation from the Administrator!'
		});
	}
});

// Get ListArticle Page -> DONE
router.get('/listArticle', ensureAuthenticated, function(req, res){
	lastUrl = req.originalUrl;
	var db = req.con;
	var usercode = req.user.usercode;
	console.log(usercode)

	db.query('SELECT * FROM articles ORDER BY tanggal_buat ASC', function(err, articles){
		if(err) throw err;
		console.log(articles)
		if(!articles[0]){
			res.render('dashboard/listArticle', {message: 'notfound'});
		}
		else
			res.render('dashboard/listArticle', {articles:articles});
	});
	// asdf
});

// Get ListSayembara Page -> DONE
router.get('/listSayembara', ensureAuthenticated, function(req, res){
	lastUrl = req.originalUrl;
	var db = req.con;
	var id_desa = req.user.id_desa;
	console.log(id_desa)

	db.query('SELECT * FROM sayembara WHERE id_desa=? ORDER BY tanggal_awal ASC', [id_desa], function(err, sayembaras){
		if(err) throw err;
		console.log(sayembaras)
		if(!sayembaras[0]){
			res.render('dashboard/listSayembara', {message: 'notfound'});
		}
		else
			res.render('dashboard/listSayembara', {sayembaras:sayembaras});
	});
	// BATAS
	// Sayembara.getAllSayembara({id_user: req.user.id}, {sort: 'tanggal_buat'}, // ini maksudnya tgl awal kali?
	// 	function(err, sayembaras) {
	// 		if(err) throw err;
	// 		if(!sayembaras[0]){
	//     		res.render('dashboard/listSayembara', {message: 'notfound'});
	//     	}
	//     	else
	// 			res.render('dashboard/listSayembara', {sayembaras:sayembaras});
	// });
});

// Get EditArticle Page -> DONE
router.get('/editArticle/:id', ensureAuthenticated, function(req, res){
	lastUrl = req.originalUrl;
	var db = req.con;
	var id_artikel = req.params.id;
	console.log(id_artikel)

	db.query('SELECT * FROM articles WHERE id_artikel=?', [id_artikel], function(err, article){
		if(err) throw err;
		if(!article){
    		res.render('dashboard/editArticle', {message: 'notfound'});
    	}
		else
	    	res.render('dashboard/editArticle', {article:article});
	});
	//BATAS
	// Article.getArticleById(req.params.id, function(err, article){
	// 	if(err) throw err;
	// 	if(!article){
    // 		res.render('dashboard/editArticle', {message: 'notfound'});
    // 	}
    // 	else
	//     	res.render('dashboard/editArticle', {article:article});
	// });
});

// Post EditArticle Page -> DONE
router.post('/editArticle/:id', ensureAuthenticated, upload.single('file'), function(req, res){
	var judul_artikel = req.body.judul_artikel;
	var isi_artikel = req.body.isi_artikel;
	var deskripsi_singkat = req.body.deskripsi_singkat;
	var id_artikel = req.params.id;
	var topik = req.body.topik;
	var foto = '';
	// var dt = dateTime.create();
	// var tanggal_buat = dt.format('d-m-Y');
	var id_user = req.user.id;
	if (req.body.comment=='true')
		var can_comment = 1;
	else
		var can_comment = 0;

	req.checkBody('judul_artikel', 'Judul artikel dibutuhkan').notEmpty();
	req.checkBody('deskripsi_singkat', 'Deskripsi singkat dibutuhkan').notEmpty();
	req.checkBody('isi_artikel', 'Isi artikel dibutuhkan').notEmpty();
	req.checkBody('topik', 'Topik dibutuhkan').notEmpty();
	//req.checkBody('file', 'Header foto dibutuhkan').notEmpty();
	var errors = req.validationErrors();

	// Upload Image -> DONE
	ext = '.'+req.file.originalname.split(".")[1];
	fs.rename(req.file.path, path.join('./public/uploads/img/articles', req.file.filename)+ext);
	foto = '/uploads/img/articles/'+req.file.filename+ext;
	
	

	if(errors){
		res.render('dashboard/editArticle',{
			errors:errors
		});
	} else {
		var db = con;
		db.query('SELECT COUNT(*) FROM articles', function(err,count){
			db.query('UPDATE articles SET judul_artikel = ?, isi_artikel = ?, deskripsi_singkat = ?, topik = ?, foto = ?, \
			can_comment = ? WHERE id_artikel = ?', [judul_artikel, isi_artikel, deskripsi_singkat, topik, foto, can_comment, id_artikel], function(err,rows){
				if(err) throw err;

			});
		});
		// Article.getArticleById(req.params.id, function(err, article) {
		// 	var update = {
		// 		judul_artikel: judul_artikel,
		// 		isi_artikel: isi_artikel,
		// 		deskripsi_singkat: deskripsi_singkat,
		// 		topik: topik,
		// 		foto: foto,
		// 		can_comment: can_comment
		// 	};
			res.render('dashboard/editArticle', {
				success_msg: 'Succesfully edit the article! You can visit it ',
				//link: '../../artikel/'+article.id
			});
	}
});

// Get userProfile Page
router.get('/listUser', ensureAuthenticated, function(req, res){
	var db = req.con;
	var usercode = req.user.usercode;

	// Jika user adalah admin
	db.query('SELECT * FROM user WHERE usercode=1 OR usercode=2 OR usercode=3', function(err, users){
		if(err) throw err;

		console.log("users:");
		res.render('dashboard/listUser', {users: users});
		
	});
	
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		if(req.user.usercode != 1)
			return next();
		else {
			req.flash('error_msg', "dashboard");

			res.redirect(lastUrl);
		}
	} else {
		//req.flash('error_msg', "You are not logged in");
		res.redirect('/login');
	}
}

// Get CreateSayembara Page
router.get('/createSayembara', ensureAuthenticated, function(req, res){
	res.render('dashboard/createSayembara');
});

// Post CreateSayembara Page -> DONE
router.post('/createSayembara', ensureAuthenticated, upload.single('file'), function(req, res){
	var judul_sayembara = req.body.judul_sayembara;
	var topik = req.body.topik;
	var isi_sayembara = req.body.isi_sayembara;
	var deskripsi_singkat = req.body.deskripsi_singkat;
	var id_desa = req.user.id_desa;
	var id_user = req.user.id;
	var tgl_kirim = new Date();

	// Upload Image -> DONE
	ext = '.'+req.file.originalname.split(".")[1];
	fs.rename(req.file.path, path.join('./public/uploads/img/events', req.file.filename)+ext);
	var foto_sayembara = '/uploads/img/events/'+req.file.filename+ext;

	req.checkBody('judul_sayembara', 'Judul sayembara dibutuhkan').notEmpty();
	req.checkBody('topik', 'Topik dibutuhkan').notEmpty();
	req.checkBody('deskripsi_singkat', 'Deskripsi singkat dibutuhkan').notEmpty();
	req.checkBody('isi_sayembara', 'Deskripsi sayembara dibutuhkan').notEmpty();
	//req.checkBody('file', 'Header foto dibutuhkan').notEmpty();
	var errors = req.validationErrors();

	if(errors){
		res.render('dashboard/createSayembara',{
			errors:errors
		});
	} else {
		var db = con;
		db.query('SELECT COUNT(*) FROM sayembara', function(err,count){
			db.query('INSERT INTO sayembara (id_sayembara, id_desa, judul_sayembara, topik, \
				deskripsi_singkat, isi_sayembara, tanggal_awal, tanggal_akhir, foto_sayembara) \
				VALUES (?,?,?,?,?,?,?,?,?)', [null,id_desa,judul_sayembara,topik,deskripsi_singkat,isi_sayembara,tgl_kirim,tgl_kirim,foto_sayembara], function(err,rows){
				if(err) throw err;

			});
		});

		/*
		var newSayembara = new Sayembara({
			judul_sayembara: judul_sayembara,
			topik: topik,
			deskripsi_singkat: deskripsi_singkat,
			isi_sayembara: isi_sayembara,
			foto_sayembara: foto_sayembara,
			id_desa: id_desa,
			//tanggal_selesai: tanggal_selesai,
			id_user: id_user
		});

		Sayembara.createSayembara(newSayembara, function(err, user){
			if(err) throw err;
			//console.log(user);
		});
		*/
		res.render('dashboard/createSayembara', {
			success_msg: 'You added a new Sayembara! Please wait for confirmation from the Administrator.'
		});
	}
});

// Get EditSayembara Page -> DONE
router.get('/editSayembara/:id', ensureAuthenticated, function(req, res){
	lastUrl = req.originalUrl;
	var db = req.con;
	var id_sayembara = req.params.id;
	console.log(id_sayembara)

	db.query('SELECT * FROM sayembara WHERE id_sayembara=?', [id_sayembara], function(err, sayembara){
		if(err) throw err;
		if(!sayembara){
    		res.render('dashboard/editSayembara', {message: 'notfound'});
    	}
    	else
	    	res.render('dashboard/editSayembara', {sayembara:sayembara});
	});
	// BATAS
	// Sayembara.getSayembaraById(req.params.id, function(err, sayembara){
	// 	if(err) throw err;
	// 	if(!sayembara){
    // 		res.render('dashboard/editSayembara', {message: 'notfound'});
    // 	}
    // 	else
	//     	res.render('dashboard/editSayembara', {sayembara:sayembara});
	// });
});

// Post EditSayembara Page -> need some tweaking
router.post('/editSayembara/:id', ensureAuthenticated, upload.single('file'), function(req, res){
	var judul_sayembara = req.body.judul_sayembara;
	var topik = req.body.topik;
	var isi_sayembara = req.body.isi_sayembara;
	var deskripsi_singkat = req.body.deskripsi_singkat;
	var foto_sayembara = "";
	// var dt = dateTime.create();
	// var tanggal_buat = dt.format('d-m-Y');
	var id_sayembara = req.params.id;

	req.checkBody('judul_sayembara', 'Judul sayembara dibutuhkan').notEmpty();
	req.checkBody('deskripsi_singkat', 'Deskripsi singkat dibutuhkan').notEmpty();
	req.checkBody('isi_sayembara', 'Isi artikel dibutuhkan').notEmpty();
	req.checkBody('topik', 'Topik dibutuhkan').notEmpty();
	//req.checkBody('file', 'Header foto dibutuhkan').notEmpty();
	var errors = req.validationErrors();

	// Upload Image -> need some tweaking
	ext = '.'+req.file.originalname.split(".")[1]
	fs.rename(req.file.path, path.join('./public/uploads/img/articles', req.file.filename)+ext)
	foto = '/uploads/img/events/'+req.file.filename+ext;
	
	if(errors){
		res.render('dashboard/editSayembara',{
			errors:errors
		});
	} else {
		var db = con;
		db.query('SELECT COUNT(*) FROM sayembara', function(err,count){
			db.query('UPDATE sayembara SET judul_sayembara = ?, isi_sayembara = ?, deskripsi_singkat = ?, topik = ?, foto_sayembara = ? \
			WHERE id_sayembara = ?', [judul_sayembara, isi_sayembara, deskripsi_singkat, topik, foto, id_sayembara], function(err,rows){
				if(err) throw err;

			});
		});
		// Sayembara.getSayembaraById(req.params.id, function(err, sayembara) {
		// 	var update = {
		// 		judul_sayembara: judul_sayembara,
		// 		isi_sayembara: isi_sayembara,
		// 		deskripsi_singkat: deskripsi_singkat,
		// 		topik: topik
		// 	};

		// 	Sayembara.editSayembara(sayembara, update, function(err, log){
		// 		if(err) throw err;
		// 		console.log(log);
		// 	});
			res.render('dashboard/editSayembara', {
				success_msg: 'Succesfully edit the Sayembara! You can visit it ',
				//link: '../../sayembara/'+sayembara.id
			});
		// });
	}
});

module.exports = router;