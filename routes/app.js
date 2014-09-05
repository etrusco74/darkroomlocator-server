var ReportProvider = require('../providers/providers').ReportProvider;
var utils = require('../config/utils');
var config = require('../config/config');
var moment = require('moment'); 

var reportProvider = new ReportProvider();

/** phantom **/
var phantomjs = require('phantomjs');
var path = require('path');
var childProcess = require('child_process');

var root = function(req, res) {
    
    console.log('-- route index --');
    
    res.header("Content-Type", "text/html");
    
    if(typeof(req.query._escaped_fragment_) !== "undefined") {
        
        var query_str = req.query._escaped_fragment_;
        var lang = query_str.substring(0,2);
        
        /* phantom call */
        var binPath = phantomjs.path;
        
        var childArgs = [
            path.join(__dirname, 'phantom-script.js'),  lang, query_str
        ];
        
        childProcess.execFile(binPath, childArgs,  function(err, stdout, stderr) {
            console.log('done phantomjs!');
            console.log('stderr: ' + stderr);
            console.log('stdout: ' + stdout);
            res.send(stdout);
        });

    }
    else
        res.render('app/index');
}

var under = function(req, res) {
    
    console.log('-- route under construction --');
    
    res.header("Content-Type", "text/html");
       
    res.render('app/under');
}

var sitemap = function(req, res) {
    
    console.log('-- sitemap --');
    
    res.header("Content-Type", "text/xml");
       
    reportProvider.findAllOnlyId(function(err, reports){
        res.render('app/sitemap', {
            reports: reports, 
            moment: moment
        });
    });
}

/** exports **/
exports.root = root;
exports.under = under;
exports.sitemap = sitemap;