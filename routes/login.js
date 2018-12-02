var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var con = require("../connection");

var User = require('../models/user');
var Desa = require('../models/desa');
var breadcrumb = null;

// Login Layout
router.all('/*', function (req, res, next) {
    req.app.locals.layout = 'layout-login'; // set your layout here
    breadcrumb = req.breadcrumb;
    next(); // pass control to the next handler
});

// Register
router.get('/register', ensureAuthenticated, function(req, res){
	res.render('register');
});

// Register As Locals
router.get('/register/local', ensureAuthenticated, function(req, res){
	res.render('registerOpt');
});

// Login
router.get('/', ensureAuthenticated, function(req, res){
	res.render('login');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		res.redirect(lastUrl);
	} else {
		return next();
	}
}

// Register User
router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	var type = req.body.type;
	var usercode = 1;

	var nama_desa = req.body.nama_desa;
	var lokasi_desa = req.body.lokasi_desa;

	//console.log(name);
	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		if(type=='locals')
			usercode = 2;

		var db = req.con;
		db.query('SELECT COUNT(*) FROM user', function(err,count){
			console.log("Users count :"+count);
			bcrypt.genSalt(10, function(err, salt) {
				bcrypt.hash(password, salt, function(err, hash) {
					hash_pass = hash;

					db.query('INSERT INTO user (id_user, username, password, email, name, usercode,\
						id_desa) VALUES (?,?,?,?,?,?,?)',[count+1,username,hash_pass,email,name,usercode,(type=='locals')?3:null], function(err,rows){
							
							if(err) throw err;
							console.log(rows);
						});
				});
			});
		});
		
		
		// var newUser = new User({
		// 	name: name,
		// 	email: email,
		// 	username: username,
		// 	password: password,
		// 	usercode: usercode
		// });

		// User.createUser(newUser, function(err, user){
		// 	if(err) throw err;
		// 	if(type=='locals'){
		// 		var newDesa = new Desa({
		// 			nama_desa: nama_desa,
		// 			lokasi_desa: lokasi_desa,
		// 			id_user: user.id
		// 		});

		// 		Desa.createDesa(newDesa, function(err, desa){
		// 			if(err) throw err;
		// 		})
		// 	}
		// 	//console.log(user);
		// });

		req.flash('success_msg', 'You are now registered!');

		res.redirect('/login');
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {

	var db = con;
	db.query('SELECT * FROM user WHERE username=?', username, function(err,rows){
		if(err) throw err;
		console.log(rows[0]);

		var hash_pass = rows[0].password;
		// console.log(password);
		// console.log(rows[0].password);
		bcrypt.compare(password, hash_pass, function(err, isMatch) {
			if(err) throw err;
			if(isMatch)
				return done(null, rows[0]);
    		else
    			return done(null, false, {message: 'Invalid password'});
	   });
	});

	// db.end();
    // User.getUserByUsername(username, function(err, user){
    // 	if(err) throw err;
    // 	if(!user){
    // 		return done(null, false, {message: 'Username not found'});
    // 	}

    // 	User.comparePassword(password, user.password, function(err, isMatch){
    // 		if(err) throw err;
    // 		if(isMatch)
    // 			return done(null, user);
    // 		else
    // 			return done(null, false, {message: 'Invalid password'});
    // 	});
    // });
  }));

passport.serializeUser(function(user, done) {
  	done(null, user.id_user);
});

passport.deserializeUser(function(id, done) {
	var db = con;
	db.query('SELECT * FROM user WHERE id_user=?', id, function(err,rows){
		done(err, rows[0]);
	});

	// db.end();
	// User.getUserById(id, function(err, user) {
	// 	done(err, user);
	// });
});

router.post('/', passport.authenticate('local', {
  	failureRedirect:'/login',
  	failureFlash: true}), function (req, res){
		res.redirect(lastUrl);
	});

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', "You are logged out");

	if(lastUrl!="/profil")
		res.redirect(lastUrl);
	else
		res.redirect('/');
	console.log(lastUrl);
});

module.exports = router;
