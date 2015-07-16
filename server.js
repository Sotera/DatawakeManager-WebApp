var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();
var winston = require('winston');

//Configure output file for production logging
winston.add(winston.transports.File, {filename: '/var/log/sotera/somefile.log'});

var app = express();

// handle server listen port this way for now
app.set('port', process.env.PORT || 3002);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({secret: 'mySecret', resave: false, saveUninitialized: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/login', require('./routes/login'));
app.use('/logout', require('./routes/logout'));
app.use('/views/partials', require('./routes/partials'));

app.use('/views/app', require('./routes/app/app'));
app.use('/users', require('./routes/users'));
app.use('/teams', require('./routes/app/teams'));
app.use('/domains', require('./routes/app/domains'));
app.use('/domainitems', require('./routes/app/domainItems'));
app.use('/trails', require('./routes/app/trails'));
app.use('/settings', require('./routes/app/settings'));
app.use('/datawakeusers', require('./routes/app/datawakeUsers'));
app.use('/datawakedata', require('./routes/app/datawakeData'));
app.use('/upload',multipartyMiddleware ,require('./routes/app/upload'));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

// and let's get things started
var server = app.listen(app.get('port'), function() {
  app.emit('started');
  winston.level = 'debug';
  winston.log('debug','Express server listening on port ' + server.address().port);
});

