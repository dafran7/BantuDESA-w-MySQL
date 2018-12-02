var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var routes = require('./routes/index');
var login = require('./routes/login');
var sayembara = require('./routes/sayembara');
var dashboard = require('./routes/dashboard');
var profildesa = require('./routes/profildesa');
var artikel = require('./routes/artikel');
var donasi = require('./routes/donasi');
var profil = require('./routes/profil');

// Init App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
//app.engine('handlebars', hbs.engine);
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/upload', express.static(__dirname + '/uploads'));
app.use(express.static('public/assets/img'));

// Making db accessible to routers
var con = require('./connection');
app.use(function(req,res,next){
    req.con = con;
    next();
});

// Express Session
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	reSave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
		var namespace = param.split('.'),
			root = namespace.shift(),
			formParam = root;

		while(namespace.Length){
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param 	: formParam,
			msg		: msg,
			value	: value
		};
	}
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

app.use('/', routes);
app.use('/login', login);
app.use('/sayembara', sayembara);
app.use('/dashboard', dashboard);
app.use('/profildesa', profildesa);
app.use('/donasi', donasi);
app.use('/artikel', artikel);
app.use('/profil', profil);

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'))
});


// Set Global Variable
global.lastUrl = '/';
// global.dateTime = require('node-datetime');

// Custom Functions
function range(start, stop, step) {
    if (typeof stop == 'undefined') {
        // one param defined
        stop = start;
        start = 0;
    }

    if (typeof step == 'undefined') {
        step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }

    return result;
};

varToString = function(str){
    var result = "'"+str+"'";
    return result;
};

// Custom Helpers
var hbs = require('handlebars');

hbs.registerHelper('ifCond', function (v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        case '%=0':
        	if ((v1%v2) == 0)
        		return options.fn(this);
        	else
        		return options.inverse(this);
        case '%!=0':
        	if ((v1%v2) != 0)
        		return options.fn(this);
        	else
        		return options.inverse(this);
        default:
            return options.inverse(this);
    }
});

hbs.registerHelper('inc', function (value, options) {
	return parseInt(value) + 1;
});

hbs.registerHelper('substr', function (value, end, options) {
    index = 0;
    str = "";
    for(i in range(value.length)){
        if (value[i]==" ")
            index = i;
        if(i==end)
            break;
    }
    if(value[end+1]) {
        str = value.substring(0, index);
        str = str+"...";
    } else
        str = value;
    return str;
});

hbs.registerHelper('adt', function (value, index, name, options) {
    return value[index].name;
});

hbs.registerHelper('json', function(context) {
    return JSON.stringify(context);
});