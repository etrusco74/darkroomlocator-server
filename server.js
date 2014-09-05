var express = require('express');
var path = require('path');
var http = require('http');
var config = require('./config/config');
var api = require('./api/api');
var appRoute = require('./routes/app');

var app = express();

/** app config **/
app.configure(function () {
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.compress()),
    app.use(express.methodOverride()),
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, '/public')));
    app.engine('.html', require('ejs').__express);
    app.set('port', config.web.port);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

console.log(app.get('env'));

/** cross domain request **/
app.all('*', function(req, res, next){
  if (!req.get('Origin')) return next();
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Cache-Control, authkey, username, lang, dir');
  if ('OPTIONS' == req.method) return res.send(200);
  next();
});

/** app route view **/ 
app.get('/', appRoute.root);
app.get('/beta', appRoute.under);

/** sitemap **/
app.get('/sitemap', appRoute.sitemap);

/** api route - RESTful webservice **/

/** user api **/
app.get('/api/users', api.findUsers);
app.get('/api/user/id/:id', api.findUserById);
app.get('/api/user/username/:username', api.findUserByUsername);

app.post('/api/login', api.login);
app.post('/api/user', api.saveUser);

app.put('/api/user/id/:id', api.updateUserById);
app.put('/api/user/activate/id/:id/key/:key', api.activateUserById);
app.put('/api/user/resetpwd/email/:email', api.resetUserPassword);

app.delete('/api/users', api.deleteUsers);
app.delete('/api/user/id/:id', api.deleteUserById);

/** report type api **/
app.get('/api/types', api.findTypes);
app.get('/api/type/id/:id', api.findTypeById);

/** report api **/
app.get('/api/reports', api.findReports);
app.get('/api/report/id/:id', api.findReportById);
app.get('/api/reports/username/:username', api.findReportsByUsername);
app.get('/api/reports/geo/:lat/:lng/:km', api.findReportsByGeo);
app.get('/api/reports/text/:text', api.findReportsByText);
app.get('/api/reports/params/:lat/:lng/:km/:text/:id', api.findReportsByParams);

app.post('/api/report', api.saveReport);

app.put('/api/report/id/:id', api.updateReportById);

app.delete('/api/report/id/:id', api.deleteReportById);

/** image api **/
app.get('/api/images/dir/:dir', api.getImagesByDir);
app.post('/api/image', api.saveImage);
app.delete('/api/image/dir/:dir/file/:file', api.deleteImage);
app.delete('/api/images/dir/:dir', api.deleteImagesByDir);


/** get 404 error **/
app.all('*', function(req, res){
  res.send('mmmmhhh!!! ... ', 404);
});

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server started and listening on port " + app.get('port'));
});