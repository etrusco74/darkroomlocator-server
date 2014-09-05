var system = require('system');

var page_lang = require('webpage').create(); 
var page = require('webpage').create(); 

var url_lang = 'http://www.darkroomlocator.com/#lang/' + system.args[1];
var url = 'http://www.darkroomlocator.com/#!' + system.args[2];

/** manage language **/
page_lang.open(url_lang, function (status_lang) {
    if (status_lang !== 'success') {
        console.log('Unable to access network');
        phantom.exit();
    } else {
        var p = page_lang.evaluate(function () {
            return document.getElementsByTagName('html')[0].innerHTML
        });
        /** get request page **/
        page.open(url, function (status) {
            if (status !== 'success') {
                console.log('Unable to access network');
            } else {
                var p = page.evaluate(function () {
                    return document.getElementsByTagName('html')[0].innerHTML
                });
                console.log(p);
            }
            phantom.exit();
        });
    }
}); 