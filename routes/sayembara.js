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

// Get Sayembara Page
router.get('/', function(req, res){
	lastUrl = req.originalUrl;

	var db = req.con;
	db.query('SELECT * FROM sayembara', function(err,sayembaras){
		if(err) throw err;
		console.log(sayembaras);
		
		res.render('head-sayembara', {sayembaras:sayembaras});
	});
});

router.get('/:id', function(req, res){
	lastUrl = req.originalUrl;
	Sayembara.getSayembaraById(req.params.id, function(err, sayembara){
		if(err) throw err;
		if(!sayembara){
    		res.render('sayembara', {message: 'Article not found'});
    	}
    	res.render('sayembara', {sayembara:sayembara});
	});

});

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