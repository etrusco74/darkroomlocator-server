var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
var mongoose = require('mongoose');
var textSearch = require('mongoose-text-search');
var config = require('../config/config');
var utils = require("../config/utils");
var uuid = require('node-uuid');
var moment = require('moment'); 

var db = mongoose.createConnection('mongodb://' + config.mongo.user + ':' + config.mongo.password + '@' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.db);


/** Model **/

/** user model **/
var userSchema = mongoose.Schema({
    first_name              :   String,
    last_name               :   String,
    username                :   { type: String, required: true, unique: true },
    password                :   { type: String, required: true },
    email                   :   { type: String, unique: true },
    registration_date       :   { type: Date, default: moment() },
    auth                    :   {
                                    authkey         : String,
                                    ipaddress       : String,
                                    login_date      : Date,
                                    activate_date   : Date
                                },
    verified                :   { type: Boolean, default: false }                   
});

/** report type model **/
var typeSchema = mongoose.Schema({
    value               : Number,  
    description_en      : String,
    description_it      : String,
    description_es      : String,
    description_fr      : String,
    description_de      : String,
    sort                : Number
});

/** report model **/
var reportSchema = mongoose.Schema({
    username_id         :  	{ type: mongoose.Schema.Types.ObjectId, required: true, ref:'User'},
    username            :   { type: String, ref:'User'},
    report_date			:  	{ type: Date, required: true, default: moment()},
    type_id  	        :	{ type: mongoose.Schema.Types.ObjectId, required: true, ref:'Type' },
	
	description			:	String,
	note				:	String,
    keywords            :   [String],
    contact_email       :   String,
	website				:	String,	
	
	formatted_address	:  	String, 
	country				:  	String, 
	country_short		:  	String,
	region				:  	String,
	province			:  	String,
	postal_code			:  	String,
    lng    		        :   Number,
    lat			        :   Number,
	loc                 :   {
                                type: { 
                                    type: String 
                                }, 
                                coordinates: []
                            }
});

reportSchema.plugin(textSearch);

reportSchema.index({ loc: '2dsphere' });
reportSchema.index({ note: 'text' });

var User = db.model('User', userSchema);
var Type = db.model('Type', typeSchema);
var Report = db.model('Report', reportSchema);

/** Provider **/

/** user provider **/
UserProvider = function(){};

/** Find all users **/
UserProvider.prototype.findAll = function(callback) {
    User.find({}, {password:0}, function (err, users) {
        if (err)    callback(err.message, null)
        else {
            if (users != null)  callback(null, users);
            else                callback('User not found', null);
        }
    });
};

/** Find user by ID **/
UserProvider.prototype.findById = function(id, callback) {
    User.findById(id, {password:0}, function (err, user) {
        if (err)    callback(err.message, null)
         else {
            if (user != null)   callback( null, user.toObject() );
            else                callback( 'User not found', null);
        }
    });
};

/** Find user by username **/
UserProvider.prototype.findByUsername = function(username, callback) {
    User.findOne({'username': username}, {password:0}, function (err, user) {
        if (err)    callback(err.message, null)
         else {
            if (user != null)   callback( null, user.toObject() );
            else                callback( 'User not found', null);
        }
    });
};

/** Login with username and password **/
UserProvider.prototype.login = function(json, ipAddress, callback) {
    User.findOne({ $and: [ {'verified':true}, {'username':json.username} ] }, function (err, user) {
        
        if (err)    callback(err.message, null)
        else {
            if (user != null) {
                if (bcrypt.compareSync(json.password, user.password)) {

                    user.auth.authkey = uuid.v1();
                    user.auth.ipaddress = ipAddress;
                    user.auth.login_date = moment();

                    user.save(function (err2, user) {
                        if (err2)   callback(err2.message, null);
                        else {
                            User.findOne({username: user.username}, {password:0}, function (err3, userNoPwd) {
                                if (err3)   callback(err3.message, null)
                                else        callback(null, userNoPwd);
                            });
                        }
                    });

                }
                else    callback('Wrong Password', null);
            }
            else    callback('User inactive or not found', null);
        }
    });
};

/** Create a new user by json data **/
UserProvider.prototype.save = function(json, ipAddress, callback) {
    var user = new User();
    if (!(typeof json.first_name === 'undefined') )     {
        user.first_name = json.first_name;
    }
    if (!(typeof json.last_name === 'undefined') )      {
        user.last_name = json.last_name;
    }
    if (!(typeof json.username === 'undefined') )       {
        user.username = json.username;
    }
    if (!(typeof json.password === 'undefined') )       {
        user.password = bcrypt.hashSync(json.password, salt);
    }
    if (!(typeof json.email === 'undefined') )          {
        user.email = json.email;
    }    
    
    user.auth.authkey = uuid.v1();
    user.auth.ipaddress = ipAddress;

    user.save(function (err, user) {
        if (err) callback(err.message, null)
        else {
            User.findOne({username: user.username}, {password:0}, function (err2, userRes) {
                if (err2)    callback(err2.message, null)
                else {
                    if (userRes != null)    callback(null, userRes);
                    else                    callback('User not found', null);
                }
            });
        }
    });
};

/** Update user by json data **/
UserProvider.prototype.updateById = function(id, json, callback) {
    User.findById(id, function (err, user) {
        if (err) callback(err.message, null)
        else {
            if (user != null) {

                if (!(typeof json.first_name === 'undefined') )     {
                    user.first_name = json.first_name;
                }
                if (!(typeof json.last_name === 'undefined') )      {
                    user.last_name = json.last_name;
                }
                if (!(typeof json.password === 'undefined') )       {
                    user.password = bcrypt.hashSync(json.password, salt);
                }
                if (!(typeof json.email === 'undefined') )          {
                    user.email = json.email;
                }    
                
                user.save(function (err2, user) {
                    if (err2) callback(err2.message, null)
                    else {
                        User.findOne({username: user.username}, {password:0}, function (err3, userRes) {
                            if (err3)    callback(err3.message, null)
                            else {
                                if (userRes != null)    callback(null, userRes);
                                else                    callback('User not found', null);
                            }
                        });
                    }
                });
            }
            else callback(null, null);
            }
    });
};

/** Delete All users **/
UserProvider.prototype.deleteAll = function(callback) {
    User.remove(function (err) {
        if (err) callback(err.message)
        else callback(null);
    });
};

/** Delete user by id **/
UserProvider.prototype.deleteById = function(id, callback) {
    User.findById(id, {password:0}, function (err, user) {
        if (err) callback(err.message, null)
        else {
            if (user != null) {
                user.remove(function (err2) {
                        if (err2) callback(err2.message)
                        else callback(null);
                    });
            }
            else callback(null);
            }
    });
};

/** Check authKey by username **/
UserProvider.prototype.checkAuthKey = function(json, callback) {
    User.findOne( {$and: [ {'auth.authkey': json.authKey}, {'username':json.username} ] } , {password:0}, function (err, user) {
        if (err)    callback(err.message, null)
         else {
            if (user != null)   {
                var today = moment();
                var diff = today.diff(user.auth.login_date, 'hour');
                if (diff > 24)
                    callback( 'Last login '+diff+' hours ago - session expired - relogin required' , null);
                else
                    callback( null, user.toObject() );
            }
            else    callback( 'Invalid Token', null);
        }
    });
};

/** Activate user by id **/
UserProvider.prototype.activate = function(json, callback) {
    User.findOne( {$and: [ {'auth.authkey': json.params.key}, {'_id':json.params.id} ] } , {password:0}, function (err, user) {
        if (err) callback(err.message, null)
        else {
            if (user != null) {                
                
                user.verified = true;
                user.auth.authkey = uuid.v1();
                user.auth.ipaddress = json.ipAddress;
                user.auth.activate_date = moment();
                
                user.save(function (err2, user) {
                        if (err2)   callback(err2.message, null)
                        else        callback(null, user);
                });
            }
            else callback('user or apikey not found', null);
        }
    });
};

/** Reset password user by email **/
UserProvider.prototype.resetPassword = function(json, callback) {
    User.findOne({email: json.params.email}, function (err, user) {
        if (err) callback(err.message, null, null)
        else {
            if (user != null) {                
                
                var pwd = uuid.v1().substring(0,8);
                user.password = bcrypt.hashSync(pwd, salt);
                
                user.save(function (err2, user) {
                        if (err2)   callback(err2.message, null, null)
                        else        callback(null, user, pwd);
                });
            }
            else callback('email not found', null, null);
        }
    });
};

/** type provider **/
TypeProvider = function(){};

/** Find all types **/
TypeProvider.prototype.findAll = function(callback) {
    Type.find({})
        .sort({sort: 'asc'})
        .exec(function (err, types) {
            if (err)    callback(err.message, null)
            else {
                if (types != null)  callback(null, types);
                else                callback('Types not found', null);
            }
        });
};

/** Find type by id **/
TypeProvider.prototype.findById = function(id, callback) {
    Type.findById(id, function (err, type) {
        if (err)    callback(err.message, null)
        else {
            if (type != null)   callback(null, type);
            else                callback('Type not found', null);
        }
    });
};

/** report provider **/
ReportProvider = function(){};

/** Find all reports **/
ReportProvider.prototype.findAll = function(callback) {
    Report.find({})
        .populate('type_id')
        .sort({sort: 'asc'})
        .exec(function (err, reports) {
            if (err)    callback(err.message, null)
            else {
                if (reports != null)    callback(null, reports);
                else                    callback('Reports not found', null);
            }
        });
};

/** Find all reports only _id **/
ReportProvider.prototype.findAllOnlyId = function(callback) {
    
    //var fomatted_date = moment(photo.date_published).format('YYYY-DD-MM');

    Report.find({})
        .select('_id report_date')
        .exec(function (err, reports) {
            if (err)    callback(err.message, null)
            else {
                if (reports != null)    callback(null, reports);
                else                    callback('Reports not found', null);
            }
        });
};

/** Find report by id **/
ReportProvider.prototype.findById = function(id, callback) {
    Report.findById(id)
        .populate('type_id')
        .exec(function (err, report) {    
            if (err)    callback(err.message, null)
            else {
                if (report != null)    callback(null, report);
                else                    callback('Report not found', null);
            }
        });
};

/** Find report by username **/
ReportProvider.prototype.findByUsername = function(username, callback) {
    Report.find({'username': username})
        .populate('type_id')
        .sort({sort: 'asc'})
        .exec(function (err, reports) {
            if (err)    callback(err.message, null)
            else {
                if (reports != null) callback(null, reports);
                else                 callback('Reports not found', null);
            }
        });
};

/** Find report by geo (spatial query) **/
ReportProvider.prototype.findByGeo = function(params, callback) {
    
    var coords = { type : 'Point', coordinates : [params.lng, params.lat] };
    var distance = params.km * 1000;
    
    Report.find({ loc: { $near : coords, $maxDistance : distance }})
        .populate('type_id')
        .sort({sort: 'asc'})
        .exec(function (err, reports) {
            if (err)    callback(err.message, null)
            else {
                if (reports != null) callback(null, reports);
                else                 callback('Reports not found', null);
            }
        });
};

/** Find report by text (text query) **/
ReportProvider.prototype.findByText = function(params, callback) {
    
    var text = params.text;    
    Report.find({ note: { $regex: text, $options: 'i' } })
        .populate('type_id')
        .sort({sort: 'asc'})
        .exec(function (err, reports) {
            if (err)    callback(err.message, null)
            else {
                if (reports != null) callback(null, reports);
                else                 callback('Reports not found', null);
            }
        });    
    /*
    Report.textSearch(text, function (err, reports) {
        if (err)    callback(err.message, null)
        else {
            if (reports != null) callback(null, reports);
            else                 callback('Reports not found', null);
        }
    });
    */
};

/** Find report by all params (spatial query + text + type id) **/
ReportProvider.prototype.findByParams = function(params, callback) {
    
    var coords = { type : 'Point', coordinates : [params.lng, params.lat] };
    var distance = params.km * 1000;
    
    var text = params.text;   
    var type_id = params.id;  
    
    var query = {};
    
    if (distance != 0) {
        query = { loc:  { $near : coords, $maxDistance : distance }};
    }
    if ((text != 'null') || (type_id != 0)) {
        query["$and"]=[];    
    }
    if (text != 'null') {
        query["$and"].push({ note: { $regex: text, $options: 'i' }});
    }    
    if (type_id != 0) {
        query["$and"].push({"type_id" : type_id});
    }
    
    Report
        .find(query)
        .populate('type_id')
        .sort({sort: 'asc'})
        .exec(function (err, reports) {
            if (err)    callback(err.message, null)
            else {
                if (reports != null) callback(null, reports);
                else                 callback('Reports not found', null);
            }
        });
};

/** Create a new report by json data **/
ReportProvider.prototype.save = function(json, ipAddress, callback) {
    
    json.keywords = [];
    json.keywords = utils.extractKeywords(json.note);
    //json.keywords.push(utils.extractKeywords(json.note));   
    
    var report = new Report(json);  
    
    report.save(function (err, reportRes) {
        if (err)     callback(err.message, null)
        else 		{
            callback(null, reportRes);
        }
    });    
    
};

/** Update report by json data **/
ReportProvider.prototype.updateById = function(id, json, callback) {
    Report.findById(id, function (err, report) {
        if (err) callback(err.message, null)
        else {
            if (report != null) {
    
                report.type_id = json.type_id;
                report.formatted_address = json.formatted_address;
                report.country = json.country;
                report.country_short = json.country_short;
                report.region = json.region;
                report.province = json.province;
                report.postal_code = json.postal_code;
                report.lng = json.lng;
                report.lat = json.lat;
                report.description = json.description;
                report.note = json.note;
                
                report.keywords.splice(0, report.keywords.length);
                report.keywords = utils.extractKeywords(json.note);  
                
                report.contact_email = json.contact_email;
                report.website = json.website;                
                report.loc.coordinates.splice(0, 2);
                report.loc.coordinates.push(json.lng, json.lat);
                
                report.save(function (err2, report) {
                    if (err2) callback(err2.message, null)
                    else {
                        Report.findById(report._id, function (err3, reportRes) {
                            if (err3)    callback(err3.message, null)
                            else {
                                if (reportRes != null)    callback(null, reportRes);
                                else                    callback('Report not found', null);
                            }
                        });
                    }
                });
            }
            else callback(null, null);
            }
    });
};

/** Delete report by id **/
ReportProvider.prototype.deleteById = function(id, callback) {
    Report.findById(id, function (err, report) {
        if (err) callback(err.message, null)
        else {
            if (report != null) {
                report.remove(function (err2) {
                        if (err2) callback(err2.message)
                        else callback(null);
                    });
            }
            else callback(null);
            }
    });
};

exports.UserProvider = UserProvider;
exports.TypeProvider = TypeProvider;
exports.ReportProvider = ReportProvider;