var UserProvider = require('../providers/providers').UserProvider;
var TypeProvider = require('../providers/providers').TypeProvider;
var ReportProvider = require('../providers/providers').ReportProvider;
var Mail = require('../providers/mail').Mail;
var cloudinary = require('cloudinary');

var utils = require('../config/utils');
var time = require('time')(Date);

var userProvider = new UserProvider();
var typeProvider = new TypeProvider();
var reportProvider = new ReportProvider();
var mail = new Mail();

var path    = require('path');
var newPath = path.join(__dirname, '../public/css/img/uploads/');
var fs      = require('fs');
var mkdirp  = require('mkdirp');

cloudinary.config({ 
  cloud_name: 'darkroomlocator', 
  api_key: '544488393223481', 
  api_secret: '697UInvRrdqv0n09XAZgZmQibik' 
});

/*************************************** USER API ***************************************/

/********** GET method **********/

/** findUsers - private **/
var findUsers = function(req, res) {

    res.set('Content-Type', 'application/json');
    
    var jsonObj = { };
    var authObj = { };

    console.log('------------------- GET - api findUsers - private --------------------- ');

    authObj.authKey = req.headers.authkey;
    authObj.username = req.headers.username;
    authObj.lang = req.headers.lang;
    
    authObj.isAuth = false;
    authObj.ipAddress = utils.getClientIp(req);
    authObj.api = 'findUsers';
    authObj.verb = 'GET';
    
    if ((typeof req.headers.authkey === 'undefined') || (typeof req.headers.username === 'undefined'))  {
        jsonObj.success = false;
        jsonObj.error = 'auth token required';
        res.send(jsonObj);
        console.log(jsonObj.error);
        console.log('authObj: ' + JSON.stringify(authObj));
    }
    else    {
        userProvider.checkAuthKey(authObj, function(err, user){
            if (err) {
                authObj.isAuth = false;
                console.log('authObj: ' + JSON.stringify(authObj));
                
                jsonObj.success = false;
                jsonObj.error = 'AuthKey not found';
                res.send(jsonObj);
                console.log(jsonObj.error);
            }
            else    {
                authObj.isAuth = true;
                console.log('authObj: ' + JSON.stringify(authObj));

                userProvider.findAll(function(err, users){
                    if (err) {
                        jsonObj.success = false;
                        jsonObj.error = err;
                        res.send(jsonObj);
                        console.log(jsonObj.error);
                    } else {
                        if (users.length != 0) {
                            res.send(JSON.stringify(users));
                            console.log('Users: ' + JSON.stringify(users));
                            //FIXME - togliere, esempio per Time Zone
                            /*
                            var data_iscrizione = new time.Date(users[0].data);
                            console.log('Server TimeZone' + data_iscrizione.getTimezone());
                            data_iscrizione.setTimezone('Europe/Rome');
                            console.log('Data in current TimeZone: ' + data_iscrizione.toString());
                            */
                        }
                        else {
                            jsonObj.success = false;
                            jsonObj.error = 'No users found';
                            res.send(jsonObj);
                            console.log(jsonObj.error);
                        }
                    }
                })
                
            }
        })
    }
};

/** findUserById - private **/
var findUserById = function(req, res) {

    res.set('Content-Type', 'application/json');

    var jsonObj = { };
    var authObj = { };

    console.log('------------------- GET - api findUserById - private --------------------- ');

    authObj.authKey = req.headers.authkey;
    authObj.username = req.headers.username;
    authObj.lang = req.headers.lang;
    
    authObj.isAuth = false;
    authObj.ipAddress = utils.getClientIp(req);
    authObj.api = 'findUserById';
    authObj.verb = 'GET';
    authObj.params = req.params;
   
    if ((typeof req.headers.authkey === 'undefined') || (typeof req.headers.username === 'undefined'))  {
        jsonObj.success = false;
        jsonObj.error = 'auth token required';
        res.send(jsonObj);
        console.log(jsonObj.error);
        console.log('authObj: ' + JSON.stringify(authObj));
    }
    else    {
        userProvider.checkAuthKey(authObj, function(err, user){
            if (err) {
                authObj.isAuth = false;
                console.log('authObj: ' + JSON.stringify(authObj));
                
                jsonObj.success = false;
                //jsonObj.error = 'AuthKey not found';
                jsonObj.error = err;
                res.send(jsonObj);
                console.log(jsonObj.error);
            }
            else    {
                authObj.isAuth = true;
                console.log('authObj: ' + JSON.stringify(authObj));

                userProvider.findById(authObj.params.id, function(err, user){
                    if (err) {
                        jsonObj.success = false;
                        jsonObj.error = err;
                        res.send(jsonObj);
                        console.log(jsonObj.error);
                    } else {
                        if (user) {
                            res.send(JSON.stringify(user));
                            console.log('Users: ' + JSON.stringify(user));
                        }
                        else {
                            jsonObj.success = false;
                            jsonObj.error = 'No user found';
                            res.send(jsonObj);
                            console.log(jsonObj.error);
                        }
                    }
                })
            }
        })
    }
};

/** findUserByUsername - private **/
var findUserByUsername = function(req, res) {

    res.set('Content-Type', 'application/json');

    var jsonObj = { };
    var authObj = { };

    console.log('------------------- GET - api findUserByUsername - private --------------------- ');

    authObj.authKey = req.headers.authkey;
    authObj.username = req.headers.username;
    authObj.lang = req.headers.lang;
    
    authObj.isAuth = false;
    authObj.ipAddress = utils.getClientIp(req);
    authObj.api = 'findUserByUsername';
    authObj.verb = 'GET';
    authObj.params = req.params;
   
    if ((typeof req.headers.authkey === 'undefined') || (typeof req.headers.username === 'undefined'))  {
        jsonObj.success = false;
        jsonObj.error = 'auth token required';
        res.send(jsonObj);
        console.log(jsonObj.error);
        console.log('authObj: ' + JSON.stringify(authObj));
    }
    else    {
        userProvider.checkAuthKey(authObj, function(err, user){
            if (err) {
                authObj.isAuth = false;
                console.log('authObj: ' + JSON.stringify(authObj));
                
                jsonObj.success = false;
                jsonObj.error = 'AuthKey not found';
                res.send(jsonObj);
                console.log(jsonObj.error);
            }
            else    {
                authObj.isAuth = true;
                console.log('authObj: ' + JSON.stringify(authObj));

                userProvider.findByUsername(authObj.params.username, function(err, user){
                    if (err) {
                        authObj.isAuth = true;
                        console.log('authObj: ' + JSON.stringify(authObj));
                        jsonObj.success = false;
                        jsonObj.error = err;
                        res.send(jsonObj);
                        console.log(jsonObj.error);
                    } else {
                        if (user) {
                            res.send(JSON.stringify(user));
                            console.log('Users: ' + JSON.stringify(user));
                        }
                        else {
                            jsonObj.success = false;
                            jsonObj.error = 'No user found';
                            res.send(jsonObj);
                            console.log(jsonObj.error);
                        }
                    }
                })
            }
        })
    }
};

/********** POST method **********/

/** login - public **/
var login = function(req, res) {

    res.set('Content-Type', 'application/json');
        
    var jsonObj = { };
    var authObj = { };
    var userReq = req.body;
    
    console.log(JSON.stringify(req.body));
    
    console.log('------------------- POST - api login - public  --------------------- ');
    
    authObj.lang = req.headers.lang;
    
    authObj.ipAddress = utils.getClientIp(req);
    authObj.api = 'login';
    authObj.verb = 'POST';
    console.log('request body: ' + JSON.stringify(userReq));
    console.log('authObj: ' + JSON.stringify(authObj));
    
    var content_type = req.get('content-type');    
    if (content_type.indexOf("application/json") === -1)   {
        jsonObj.success = false;
        jsonObj.error = 'Content Type must be application/json';
        res.send(jsonObj);
        console.log(jsonObj.error);
        return;
    }
    if (typeof userReq.username === 'undefined')       {
        jsonObj.success = false;
        jsonObj.error = 'username required';
        res.send(jsonObj);
        console.log(jsonObj.error);
        return;
    }
    if (typeof userReq.password === 'undefined')       {
        jsonObj.success = false;
        jsonObj.error = 'password required';
        res.send(jsonObj);
        console.log(jsonObj.error);
        return;
    }
    userProvider.login(userReq, authObj.ipAddress, function(err, userRes){
        if (err) {
            jsonObj.success = false;
            jsonObj.error = err;
            res.send(jsonObj);
            console.log(jsonObj.error);
        } else {
            if (userRes != null) {
                jsonObj.success = true;
                jsonObj.user    = userRes;
                res.send(jsonObj);
                console.log('Login ok');
                console.log('User: ' + JSON.stringify(userRes));
            }
            else {
                jsonObj.success = false;
                jsonObj.error = "Login Failed";
                res.send(jsonObj);
                console.log('Login Failed');
            }
        }
    })
};

/** saveUser - public **/
var saveUser = function(req, res) {

    res.set('Content-Type', 'application/json');

    var jsonObj = { };
    var authObj = { };
    var userReq = req.body;

    console.log('------------------- POST - api saveUser -public --------------------- ');

    authObj.lang = req.headers.lang;
    
    authObj.ipAddress = utils.getClientIp(req);
    authObj.api = 'saveUser';
    authObj.verb = 'POST';
    console.log('request body: ' + JSON.stringify(userReq));
    console.log('authObj: ' + JSON.stringify(authObj));

    var content_type = req.get('content-type');    
    if (content_type.indexOf("application/json") === -1)   {
        jsonObj.success = false;
        jsonObj.error = 'Content Type must be application/json';
        res.send(jsonObj);
        console.log(jsonObj.error);
        return;
    }
    userProvider.save(userReq, authObj.ipAddress, function(err, userRes){
        if (err) {
            jsonObj.success = false;
            jsonObj.error = err;
            res.send(jsonObj);
            console.log(jsonObj.error);
        } else {
            jsonObj.success = true;
            jsonObj.user    = userRes;
            res.send(jsonObj);
            console.log('Registration ok');
            console.log('User: ' + JSON.stringify(userRes));
                         
            /** send activate mail **/            
            mail.activate(userRes, authObj.lang, function(err, res){
                console.log('err ' + err);
                console.log('res ' + res);
            });
        }
    })
};

/********** PUT method **********/

/** updateUserById - private **/
var updateUserById = function(req, res) {

    res.set('Content-Type', 'application/json');

    var jsonObj = { };
    var authObj = { };
    var userReq = req.body;

    console.log('------------------- PUT - api updateUserById - private --------------------- ');

    authObj.authKey = req.headers.authkey;
    authObj.username = req.headers.username;
    authObj.lang = req.headers.lang;
    
    authObj.isAuth = false;
    authObj.ipAddress = utils.getClientIp(req);
    authObj.api = 'updateUserById';
    authObj.verb = 'PUT';
    authObj.params = req.params;
    console.log('request body: ' + JSON.stringify(userReq));
    
    var content_type = req.get('content-type');    
    if (content_type.indexOf("application/json") === -1)   {
        jsonObj.success = false;
        jsonObj.error = 'Content Type must be application/json';
        res.send(jsonObj);
        console.log(jsonObj.error);
        console.log('authObj: ' + JSON.stringify(authObj));
        return;
    }

    if ((typeof req.headers.authkey === 'undefined') || (typeof req.headers.username === 'undefined'))  {
        jsonObj.success = false;
        jsonObj.error = 'auth token required';
        res.send(jsonObj);
        console.log(jsonObj.error);
        console.log('authObj: ' + JSON.stringify(authObj));
    }
    else    {
        userProvider.checkAuthKey(authObj, function(err, user){
            if (err) {
                authObj.isAuth = false;
                console.log('authObj: ' + JSON.stringify(authObj));

                jsonObj.success = false;
                jsonObj.error = 'AuthKey not found';
                res.send(jsonObj);
                console.log(jsonObj.error);
            }
            else    {
                authObj.isAuth = true;
                console.log('authObj: ' + JSON.stringify(authObj));

                userProvider.updateById(authObj.params.id, userReq, function(err, userRes){
                    if (err) {
                        jsonObj.success = false;
                        jsonObj.error = err;
                        res.send(jsonObj);
                        console.log(jsonObj.error);
                    } else {
                        if (userRes) {
                            jsonObj.success = true;
                            jsonObj.user = userRes;
                            res.send(jsonObj);
                            console.log('User updated');
                            console.log('User: ' + JSON.stringify(userRes));
                        }
                        else {
                            jsonObj.success = false;
                            jsonObj.error = 'No user found';
                            res.send(jsonObj);
                            console.log(jsonObj.error);
                        }
                    }
                })
            }
        })
    }
};

/** activateUserById - public **/
var activateUserById = function(req, res) {

    res.set('Content-Type', 'application/json');

    var jsonObj = { };
    var authObj = { };

    console.log('------------------- PUT - api activateUserById - public --------------------- ');

    authObj.lang = req.headers.lang;
    
    authObj.isAuth = false;
    authObj.ipAddress = utils.getClientIp(req);
    authObj.api = 'activateUserById';
    authObj.verb = 'PUT';
    authObj.params = req.params;
    
    userProvider.activate(authObj, function(err, userRes){
        if (err) {
            jsonObj.success = false;
            jsonObj.error = err;
            res.send(jsonObj);
            console.log(jsonObj.error);
        } else {
            jsonObj.success = true;
            jsonObj.desc = 'User activated';
            res.send(jsonObj);
            console.log('User activated');
            
            /** send welcome mail **/  
            mail.welcome(userRes, authObj.lang, function(err, res){
                console.log(err);
                console.log(res);
            });
        }
    })  
    
};

/** resetUserPassword - public **/
var resetUserPassword = function(req, res) {

    res.set('Content-Type', 'application/json');

    var jsonObj = { };
    var authObj = { };

    console.log('------------------- PUT - api resetUserPassword - public --------------------- ');

    authObj.lang = req.headers.lang;
    
    authObj.isAuth = false;
    authObj.ipAddress = utils.getClientIp(req);
    authObj.api = 'resetUserPassword';
    authObj.verb = 'PUT';
    authObj.params = req.params;
    
    userProvider.resetPassword(authObj, function(err, userRes, pwd){
        if (err) {
            jsonObj.success = false;
            jsonObj.error = err;
            res.send(jsonObj);
            console.log(jsonObj.error);
        } else {
            jsonObj.success = true;
            jsonObj.desc = 'Password reset';
            res.send(jsonObj);
            console.log('Password reset');
            
            /** send resend password mail **/ 
            mail.resend(userRes, authObj.lang, pwd, function(err, res){
                console.log(err);
                console.log(res);
            });
        }
    })
   
    
};

/********** DELETE method **********/

/** deleteUsers - private **/
var deleteUsers = function(req, res) {

   res.set('Content-Type', 'application/json');

    var jsonObj = { };
    var authObj = { };

    console.log('------------------- DELETE - api deleteUsers - private --------------------- ');

    authObj.authKey = req.headers.authkey;
    authObj.username = req.headers.username;
    authObj.lang = req.headers.lang;
    
    authObj.isAuth = false;
    authObj.ipAddress = utils.getClientIp(req);
    authObj.api = 'deleteUsers';
    authObj.verb = 'DELETE';

    if ((typeof req.headers.authkey === 'undefined') || (typeof req.headers.username === 'undefined'))  {
        jsonObj.success = false;
        jsonObj.error = 'auth token required';
        res.send(jsonObj);
        console.log(jsonObj.error);
        console.log('authObj: ' + JSON.stringify(authObj));
    }
    else    {
        userProvider.checkAuthKey(authObj, function(err, user){
            if (err) {
                authObj.isAuth = false;
                console.log('authObj: ' + JSON.stringify(authObj));
                
                jsonObj.success = false;
                jsonObj.error = 'AuthKey not found';
                res.send(jsonObj);
                console.log(jsonObj.error);
            }
            else    {
                authObj.isAuth = true;
                console.log('authObj: ' + JSON.stringify(authObj));

                userProvider.deleteAll(function(err){
                    if (err) {
                        jsonObj.success = false;
                        jsonObj.error = err;
                        res.send(jsonObj);
                        console.log(jsonObj.error);
                    } else {
                        jsonObj.success = true;
                        jsonObj.desc = 'All Users deleted';
                        res.send(jsonObj);
                        console.log('All Users deleted');
                    }
                })
            }
        })
    }
};

/** deleteUserById - private **/
var deleteUserById = function(req, res) {

    res.set('Content-Type', 'application/json');

    var jsonObj = { };
    var authObj = { };

    console.log('------------------- DELETE - api deleteUserById - private --------------------- ');

    authObj.authKey = req.headers.authkey;
    authObj.username = req.headers.username;
    authObj.lang = req.headers.lang;
    
    authObj.isAuth = false;
    authObj.ipAddress = utils.getClientIp(req);
    authObj.api = 'deleteUserById';
    authObj.verb = 'DELETE';
    authObj.params = req.params;
    
    if ((typeof req.headers.authkey === 'undefined') || (typeof req.headers.username === 'undefined'))  {
        jsonObj.success = false;
        jsonObj.error = 'auth token required';
        res.send(jsonObj);
        console.log(jsonObj.error);
        console.log('authObj: ' + JSON.stringify(authObj));
    }
    else {
        userProvider.checkAuthKey(authObj, function(err, user){
            if (err) {
                authObj.isAuth = false;
                console.log('authObj: ' + JSON.stringify(authObj));
                
                jsonObj.success = false;
                jsonObj.error = 'AuthKey not found';
                res.send(jsonObj);
                console.log(jsonObj.error);
            }
            else    {
                authObj.isAuth = true;
                console.log('authObj: ' + JSON.stringify(authObj));

                userProvider.deleteById(authObj.params.id, function(err){
                    if (err) {
                        jsonObj.success = false;
                        jsonObj.error = err;
                        res.send(jsonObj);
                        console.log(jsonObj.error);
                    } else {
                        jsonObj.success = true;
                        jsonObj.desc = 'User deleted';
                        res.send(jsonObj);
                        console.log('User deleted');
                    }
                })
            }
        })
    }
};


/*************************************** TYPE API ***************************************/

/********** GET method **********/

/** findTypes - public **/
var findTypes = function(req, res) {

    res.set('Content-Type', 'application/json');

    var jsonObj = { };
    var authObj = { };

    console.log('------------------- GET - api findTypes - public --------------------- ');

    authObj.ipAddress = utils.getClientIp(req);
    authObj.api = 'findTypes';
    authObj.verb = 'GET';
    console.log('authObj: ' + JSON.stringify(authObj));

    typeProvider.findAll(function(err, types){
        if (err) {
            jsonObj.success = false;
            jsonObj.error = err;
            res.send(jsonObj);
            console.log(jsonObj.error);
        } else {
            if (types.length != 0) {
                res.send(JSON.stringify(types));
                console.log('Types: ' + JSON.stringify(types));
            }
            else {
                jsonObj.success = false;
                jsonObj.error = 'No types found';
                res.send(jsonObj);
                console.log(jsonObj.error);
            }
        }
    })    
};

/** findTypeById - public **/
var findTypeById = function(req, res) {

    res.set('Content-Type', 'application/json');

    var jsonObj = { };
    var authObj = { };

    console.log('------------------- GET - api findTypeById - public --------------------- ');

    authObj.ipAddress = utils.getClientIp(req);
    authObj.api = 'findTypeById';
    authObj.verb = 'GET';
    authObj.params = req.params;
    console.log('authObj: ' + JSON.stringify(authObj));

    typeProvider.findById(authObj.params.id, function(err, type){
        if (err) {
            jsonObj.success = false;
            jsonObj.error = err;
            res.send(jsonObj);
            console.log(jsonObj.error);
        } else {
            if (type.length != 0) {
                res.send(JSON.stringify(type));
                console.log('type: ' + JSON.stringify(type));
            }
            else {
                jsonObj.success = false;
                jsonObj.error = 'No type found';
                res.send(jsonObj);
                console.log(jsonObj.error);
            }
        }
    })
};


/*************************************** REPORT API ***************************************/

/********** GET method **********/

/** findReports - public **/
var findReports = function(req, res) {

    res.set('Content-Type', 'application/json');

    var jsonObj = { };
    var authObj = { };

    console.log('------------------- GET - api findReports - public --------------------- ');

    authObj.ipAddress = utils.getClientIp(req);
    authObj.api = 'findReports';
    authObj.verb = 'GET';
    console.log('authObj: ' + JSON.stringify(authObj));

    reportProvider.findAll(function(err, reports){
        if (err) {
            jsonObj.success = false;
            jsonObj.error = err;
            res.send(jsonObj);
            console.log(jsonObj.error);
        } else {
            if (reports.length != 0) {
                res.send(JSON.stringify(reports));
                console.log('Reports: ' + JSON.stringify(reports));
            }
            else {
                jsonObj.success = false;
                jsonObj.error = 'No reports found';
                res.send(jsonObj);
                console.log(jsonObj.error);
            }
        }
    })    
};

/** findReportById - public **/
var findReportById = function(req, res) {

    res.set('Content-Type', 'application/json');

    var jsonObj = { };
    var authObj = { };

    console.log('------------------- GET - api findReportById - public --------------------- ');

    authObj.ipAddress = utils.getClientIp(req);
    authObj.api = 'findReportById';
    authObj.verb = 'GET';
    authObj.params = req.params;
    console.log('authObj: ' + JSON.stringify(authObj));

    reportProvider.findById(authObj.params.id, function(err, report){
        if (err) {
            jsonObj.success = false;
            jsonObj.error = err;
            res.send(jsonObj);
            console.log(jsonObj.error);
        } else {
            if (report.length != 0) {
                res.send(JSON.stringify(report));
                console.log('Report: ' + JSON.stringify(report));
            }
            else {
                jsonObj.success = false;
                jsonObj.error = 'No report found';
                res.send(jsonObj);
                console.log(jsonObj.error);
            }
        }
    })    
};

/** findReportsByUsername - public **/
var findReportsByUsername = function(req, res) {

    res.set('Content-Type', 'application/json');

    var jsonObj = { };
    var authObj = { };

    console.log('------------------- GET - api findReportsByUsername - public --------------------- ');

    authObj.ipAddress = utils.getClientIp(req);
    authObj.api = 'findReportsByUsername';
    authObj.verb = 'GET';
    authObj.params = req.params;
    console.log('authObj: ' + JSON.stringify(authObj));

    reportProvider.findByUsername(authObj.params.username, function(err, reports){
        if (err) {
            jsonObj.success = false;
            jsonObj.error = err;
            res.send(jsonObj);
            console.log(jsonObj.error);
        } else {
            if (reports.length != 0) {
                res.send(JSON.stringify(reports));
                console.log('Reports: ' + JSON.stringify(reports));
            }
            else {
                jsonObj.success = false;
                jsonObj.error = 'No reports found';
                res.send(jsonObj);
                console.log(jsonObj.error);
            }
        }
    })    
};

/** findReportsByGeo - public **/
var findReportsByGeo = function(req, res) {

    res.set('Content-Type', 'application/json');

    var jsonObj = { };
    var authObj = { };

    console.log('------------------- GET - api findReportsByGeo - public --------------------- ');

    authObj.ipAddress = utils.getClientIp(req);
    authObj.api = 'findReportsByGeo';
    authObj.verb = 'GET';
    authObj.params = req.params;
    console.log('authObj: ' + JSON.stringify(authObj));

    reportProvider.findByGeo(authObj.params, function(err, reports){
        if (err) {
            jsonObj.success = false;
            jsonObj.error = err;
            res.send(jsonObj);
            console.log(jsonObj.error);
        } else {
            if (reports.length != 0) {
                res.send(JSON.stringify(reports));
                console.log('Reports: ' + JSON.stringify(reports));
            }
            else {
                jsonObj.success = false;
                jsonObj.error = 'No reports found';
                res.send(jsonObj);
                console.log(jsonObj.error);
            }
        }
    })    
};

/** findReportsByText - public **/
var findReportsByText = function(req, res) {

    res.set('Content-Type', 'application/json');

    var jsonObj = { };
    var authObj = { };

    console.log('------------------- GET - api findReportsByText - public --------------------- ');

    authObj.ipAddress = utils.getClientIp(req);
    authObj.api = 'findReportsByText';
    authObj.verb = 'GET';
    authObj.params = req.params;
    console.log('authObj: ' + JSON.stringify(authObj));

    reportProvider.findByText(authObj.params, function(err, reports){
        if (err) {
            jsonObj.success = false;
            jsonObj.error = err;
            res.send(jsonObj);
            console.log(jsonObj.error);
        } else {
            if (reports.length != 0) {
                res.send(JSON.stringify(reports));
                console.log('Reports: ' + JSON.stringify(reports));
            }
            else {
                jsonObj.success = false;
                jsonObj.error = 'No reports found';
                res.send(jsonObj);
                console.log(jsonObj.error);
            }
        }
    })    
};

/** findReportsByParams - public **/
var findReportsByParams = function(req, res) {

    res.set('Content-Type', 'application/json');

    var jsonObj = { };
    var authObj = { };

    console.log('------------------- GET - api findReportsByParams - public --------------------- ');

    authObj.ipAddress = utils.getClientIp(req);
    authObj.api = 'findReportsByParams';
    authObj.verb = 'GET';
    authObj.params = req.params;
    console.log('authObj: ' + JSON.stringify(authObj));

    reportProvider.findByParams(authObj.params, function(err, reports){
        if (err) {
            jsonObj.success = false;
            jsonObj.error = err;
            res.send(jsonObj);
            console.log(jsonObj.error);
        } else {
            if (reports.length != 0) {
                res.send(JSON.stringify(reports));
                console.log('Reports: ' + JSON.stringify(reports));
            }
            else {
                jsonObj.success = false;
                jsonObj.error = 'No reports found';
                res.send(jsonObj);
                console.log(jsonObj.error);
            }
        }
    })    
};

/********** POST method **********/

/** saveReport - private **/
var saveReport = function(req, res) {

    res.set('Content-Type', 'application/json');

    var jsonObj = { };
    var authObj = { };
    var reportReq = req.body;

    console.log('------------------- POST - api saveReport - private --------------------- ');

    authObj.authKey = req.headers.authkey;
    authObj.username = req.headers.username;
    
    authObj.isAuth = false;
    authObj.ipAddress = utils.getClientIp(req);
    authObj.api = 'saveReport';
    authObj.verb = 'POST';    
    console.log('request body: ' + JSON.stringify(reportReq));    

    var content_type = req.get('content-type');    
    if (content_type.indexOf("application/json") === -1)   {
        jsonObj.success = false;
        jsonObj.error = 'Content Type must be application/json';
        res.send(jsonObj);
        console.log(jsonObj.error);
        console.log('authObj: ' + JSON.stringify(authObj));
        return;
    }
    
    if ((typeof req.headers.authkey === 'undefined') || (typeof req.headers.username === 'undefined'))  {
        jsonObj.success = false;
        jsonObj.error = 'auth token required';
        res.send(jsonObj);
        console.log(jsonObj.error);
        console.log('authObj: ' + JSON.stringify(authObj));
    }
    else    {
        userProvider.checkAuthKey(authObj, function(err, user){
            if (err) {
                authObj.isAuth = false;
                console.log('authObj: ' + JSON.stringify(authObj));
                
                jsonObj.success = false;
                jsonObj.error = 'AuthKey not found';
                res.send(jsonObj);
                console.log(jsonObj.error);
            }
            else    {
                authObj.isAuth = true;
                console.log('authObj: ' + JSON.stringify(authObj));
                
                reportProvider.save(reportReq, authObj.ipAddress, function(err, reportRes){
                    if (err) {
                        jsonObj.success = false;
                        jsonObj.error = err;
                        res.send(jsonObj);
                        console.log(jsonObj.error);
                    } else {
                        jsonObj.success = true;
                        jsonObj.report    = reportRes;
                        res.send(jsonObj);
                        console.log('Report Saved');
                        console.log('Report: ' + JSON.stringify(reportRes));
                    }
                })
            
            }
        })
    }            
};

/********** PUT method **********/

/** updateReportById - private **/
var updateReportById = function(req, res) {

    res.set('Content-Type', 'application/json');

    var jsonObj = { };
    var authObj = { };
    var reportReq = req.body;

    console.log('------------------- PUT - api updateReportById - private --------------------- ');

    authObj.authKey = req.headers.authkey;
    authObj.username = req.headers.username;
    
    authObj.isAuth = false;
    authObj.ipAddress = utils.getClientIp(req);
    authObj.api = 'updateReportById';
    authObj.verb = 'PUT';
    authObj.params = req.params;
    console.log('request body: ' + JSON.stringify(reportReq));
    
    var content_type = req.get('content-type');    
    if (content_type.indexOf("application/json") === -1)   {
        jsonObj.success = false;
        jsonObj.error = 'Content Type must be application/json';
        res.send(jsonObj);
        console.log(jsonObj.error);
        console.log('authObj: ' + JSON.stringify(authObj));
        return;
    }

    if ((typeof req.headers.authkey === 'undefined') || (typeof req.headers.username === 'undefined'))  {
        jsonObj.success = false;
        jsonObj.error = 'auth token required';
        res.send(jsonObj);
        console.log(jsonObj.error);
        console.log('authObj: ' + JSON.stringify(authObj));
    }
    else    {
        userProvider.checkAuthKey(authObj, function(err, user){
            if (err) {
                authObj.isAuth = false;
                console.log('authObj: ' + JSON.stringify(authObj));

                jsonObj.success = false;
                jsonObj.error = 'AuthKey not found';
                res.send(jsonObj);
                console.log(jsonObj.error);
            }
            else    {
                authObj.isAuth = true;
                console.log('authObj: ' + JSON.stringify(authObj));

                reportProvider.updateById(authObj.params.id, reportReq, function(err, reportRes){
                    if (err) {
                        jsonObj.success = false;
                        jsonObj.error = err;
                        res.send(jsonObj);
                        console.log(jsonObj.error);
                    } else {
                        if (reportRes) {
                            jsonObj.success = true;
                            jsonObj.report = reportRes;
                            res.send(jsonObj);
                            console.log('Report updated');
                            console.log('Report: ' + JSON.stringify(reportRes));
                        }
                        else {
                            jsonObj.success = false;
                            jsonObj.error = 'No report found';
                            res.send(jsonObj);
                            console.log(jsonObj.error);
                        }
                    }
                })
            }
        })
    }
};

/********** DELETE method **********/

/** deleteReportById - private **/
var deleteReportById = function(req, res) {

    res.set('Content-Type', 'application/json');

    var jsonObj = { };
    var authObj = { };

    console.log('------------------- DELETE - api deleteReportById - private --------------------- ');

    authObj.authKey = req.headers.authkey;
    authObj.username = req.headers.username;
    
    authObj.isAuth = false;
    authObj.ipAddress = utils.getClientIp(req);
    authObj.api = 'deleteReportById';
    authObj.verb = 'DELETE';
    authObj.params = req.params;
    
    if ((typeof req.headers.authkey === 'undefined') || (typeof req.headers.username === 'undefined'))  {
        jsonObj.success = false;
        jsonObj.error = 'auth token required';
        res.send(jsonObj);
        console.log(jsonObj.error);
        console.log('authObj: ' + JSON.stringify(authObj));
    }
    else {
        userProvider.checkAuthKey(authObj, function(err, user){
            if (err) {
                authObj.isAuth = false;
                console.log('authObj: ' + JSON.stringify(authObj));
                
                jsonObj.success = false;
                jsonObj.error = 'AuthKey not found';
                res.send(jsonObj);
                console.log(jsonObj.error);
            }
            else    {
                authObj.isAuth = true;
                console.log('authObj: ' + JSON.stringify(authObj));

                reportProvider.deleteById(authObj.params.id, function(err){
                    if (err) {
                        jsonObj.success = false;
                        jsonObj.error = err;
                        res.send(jsonObj);
                        console.log(jsonObj.error);
                    } else {
                        jsonObj.success = true;
                        jsonObj.desc = 'Report deleted';
                        res.send(jsonObj);
                        console.log('Report deleted');
                    }
                })
            }
        })
    }
};

/*************************************** IMAGES API ***************************************/

/********** GET method **********/

/** getImagesByDir - public **/
var getImagesByDir = function(req, res) {

    res.set('Content-Type', 'application/json');
    
    var jsonObj = { };
    
    console.log('------------------- GET - api getImage - public --------------------- ');
    
    /* cloud storage */
    cloudinary.api.resources(function(result){
                    console.log(result);
                    jsonObj.success = true;
                    jsonObj.desc = 'Images readed';
                    jsonObj.data = result;
                    res.send(jsonObj);
                    console.log('Images readed');
                    console.log(jsonObj);
                },
                { 
                    type: 'upload', 
                    prefix: req.params.dir 
                });
    
    /* local storage
    fs.readdir(newPath + req.params.dir, function (err, data) {
        if (err) {
            jsonObj.success = false;
            jsonObj.error = err;
            res.send(jsonObj);
            console.log(jsonObj.error);
        } else {
            jsonObj.success = true;
            jsonObj.desc = 'Images readed';
            jsonObj.data = data;
            res.send(jsonObj);
            console.log('Images readed');
            console.log(jsonObj);
        }
    });
    */
};

/********** POST method **********/

/** saveImage - public **/
var saveImage = function(req, res) {
    
    res.set('Content-Type', 'application/json');

    var jsonObj = { };
    
    console.log('------------------- POST - api saveImage - public --------------------- ');

    /* cloud storage */
    cloudinary.uploader.upload(req.files.file.path, 
                        function(result) { 
                            console.log(result);
                            if (result)  {
                                jsonObj.success = false;
                                jsonObj.error = result;
                                res.send(jsonObj);
                                console.log(jsonObj.error);
                            } else {
                                jsonObj.success = true;
                                jsonObj.desc = 'Image uloaded';
                                res.send(jsonObj);
                            }
                        }, 
                        { 
                            public_id: req.headers.dir + '/' + req.files.file.name
                        });
                        
    /* local storage
    mkdirp(newPath + req.headers.dir + '/' , function(err) { 

        fs.readFile(req.files.file.path, function (err, data) {
            fs.writeFile(newPath + req.headers.dir + '/' + req.files.file.name, data, function (err) {
                if (err)  {
                    jsonObj.success = false;
                    jsonObj.error = err;
                    res.send(jsonObj);
                    console.log(jsonObj.error);
                } else {
                    jsonObj.success = true;
                    jsonObj.desc = 'Image uloaded';
                    res.send(jsonObj);
                }
            });
        });
    
    });
    */
};

/********** DELETE method **********/

/** deleteImage - private **/
var deleteImage = function(req, res) {

    res.set('Content-Type', 'application/json');
    
    var jsonObj = { };
    var authObj = { };
    
    console.log('------------------- DELETE - api deleteImage - private --------------------- ');
    
    authObj.authKey = req.headers.authkey;
    authObj.username = req.headers.username;
    
    authObj.isAuth = false;
    authObj.ipAddress = utils.getClientIp(req);
    authObj.api = 'deleteImage';
    authObj.verb = 'DELETE';
    authObj.params = req.params;
    
    if ((typeof req.headers.authkey === 'undefined') || (typeof req.headers.username === 'undefined'))  {
        jsonObj.success = false;
        jsonObj.error = 'auth token required';
        res.send(jsonObj);
        console.log(jsonObj.error);
        console.log('authObj: ' + JSON.stringify(authObj));
    }
    else {
        userProvider.checkAuthKey(authObj, function(err, user){
            if (err) {
                authObj.isAuth = false;
                console.log('authObj: ' + JSON.stringify(authObj));
                
                jsonObj.success = false;
                jsonObj.error = 'AuthKey not found';
                res.send(jsonObj);
                console.log(jsonObj.error);
            }
            else    {
                authObj.isAuth = true;
                console.log('authObj: ' + JSON.stringify(authObj));
    
                /* cloud storage */
                cloudinary.api.delete_resources(authObj.params.dir +'/'+ authObj.params.file,
                    function(result){
                        console.log(result);
                        jsonObj.success = true;
                        jsonObj.desc = 'Image deleted';
                        jsonObj.data = result;
                        res.send(jsonObj);
                        console.log('successfully deleted ' + authObj.params.dir +'/'+ authObj.params.file);
                    });
               
                /* local storage
                fs.unlink(newPath + authObj.params.dir +'/'+ authObj.params.file, function (err) {
                    if (err) {
                        jsonObj.success = false;
                        jsonObj.error = err;
                        res.send(jsonObj);
                        console.log(jsonObj.error);
                    }
                    else {
                        jsonObj.success = true;
                        jsonObj.desc = 'Image deleted';
                        res.send(jsonObj);
                        console.log('successfully deleted ' + authObj.params.dir +'/'+ authObj.params.file);
                        fs.rmdir(newPath + authObj.params.dir +'/', function (err) {});
                    }
                });
                */
            }    
        })        
    }
};

/** deleteImagesByDir - private **/
var deleteImagesByDir = function(req, res) {

    res.set('Content-Type', 'application/json');
    
    var jsonObj = { };
    var authObj = { };
    
    console.log('------------------- DELETE - api deleteImagesByDir - private --------------------- ');
    
    authObj.authKey = req.headers.authkey;
    authObj.username = req.headers.username;
    
    authObj.isAuth = false;
    authObj.ipAddress = utils.getClientIp(req);
    authObj.api = 'deleteImagesByDir';
    authObj.verb = 'DELETE';
    authObj.params = req.params;
    
    if ((typeof req.headers.authkey === 'undefined') || (typeof req.headers.username === 'undefined'))  {
        jsonObj.success = false;
        jsonObj.error = 'auth token required';
        res.send(jsonObj);
        console.log(jsonObj.error);
        console.log('authObj: ' + JSON.stringify(authObj));
    }
    else {
        userProvider.checkAuthKey(authObj, function(err, user){
            if (err) {
                authObj.isAuth = false;
                console.log('authObj: ' + JSON.stringify(authObj));
                
                jsonObj.success = false;
                jsonObj.error = 'AuthKey not found';
                res.send(jsonObj);
                console.log(jsonObj.error);
            }
            else    {
                authObj.isAuth = true;
                console.log('authObj: ' + JSON.stringify(authObj));
                
                /* cloud storage */
                 /* cloud storage */
                cloudinary.api.delete_resources_by_prefix(authObj.params.dir,
                    function(result){
                        console.log(result);
                        jsonObj.success = true;
                        jsonObj.desc = 'All images deleted';
                        jsonObj.data = result;
                        res.send(jsonObj);
                        console.log('successfully deleted all images in dir ' + authObj.params.dir);
                    });
                
                /* local storage
                try { 
                    var files = fs.readdirSync(newPath + authObj.params.dir + '/');
                    if (files.length > 0)   {
                        for (var i = 0; i < files.length; i++) {
                            var filePath = newPath + authObj.params.dir + '/' + files[i];
                            if (fs.statSync(filePath).isFile())
                                fs.unlinkSync(filePath);
                            else
                                rmDir(filePath);
                        }
                    }
                    fs.rmdirSync(newPath + authObj.params.dir + '/');
                    
                    jsonObj.success = true;
                    jsonObj.desc = 'All images deleted';
                    res.send(jsonObj);
                    console.log('successfully deleted all images in dir ' + authObj.params.dir);
                }
                catch(err) {  
                    jsonObj.success = false;
                    jsonObj.error = err;
                    res.send(jsonObj);
                    console.log(jsonObj.error);
                }                
                */
                
                /* local storage - old version
                fs.unlink(newPath + authObj.params.dir +'/'+ authObj.params.file, function (err) {
                    if (err) {
                        jsonObj.success = false;
                        jsonObj.error = err;
                        res.send(jsonObj);
                        console.log(jsonObj.error);
                    }
                    else {
                        jsonObj.success = true;
                        jsonObj.desc = 'All images deleted';
                        res.send(jsonObj);
                        console.log('successfully deleted ' + authObj.params.dir +'/'+ authObj.params.file);
                        fs.rmdir(newPath + authObj.params.dir +'/', function (err) {});
                    }
                });
                */
                
            }    
        })        
    }
};


/***************************************************************************************/

/** exports **/
exports.findUsers = findUsers;
exports.findUserById = findUserById;
exports.findUserByUsername = findUserByUsername;
exports.login = login;
exports.saveUser = saveUser;
exports.activateUserById = activateUserById;
exports.resetUserPassword = resetUserPassword;
exports.updateUserById = updateUserById;
exports.deleteUsers = deleteUsers;
exports.deleteUserById = deleteUserById;

exports.findTypes = findTypes;
exports.findTypeById = findTypeById;

exports.findReports = findReports;
exports.findReportById = findReportById;
exports.findReportsByUsername = findReportsByUsername;
exports.findReportsByGeo = findReportsByGeo;
exports.findReportsByText = findReportsByText;
exports.findReportsByParams = findReportsByParams;
exports.saveReport = saveReport;
exports.updateReportById = updateReportById;
exports.deleteReportById = deleteReportById;

exports.getImagesByDir = getImagesByDir;
exports.saveImage = saveImage;
exports.deleteImage = deleteImage;
exports.deleteImagesByDir = deleteImagesByDir;