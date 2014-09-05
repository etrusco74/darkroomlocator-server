var path           = require('path');
var templatesDir   = path.join(__dirname, '../templates');
var emailTemplates = require('email-templates');
var config = require('../config/config');
var utils = require("../config/utils");
var postmark = require('postmark')('9ac6881c-0f13-4d7c-8a4d-70ed0b450343');

/** Mail Provider **/

Mail = function(){};

/** Send Welcome Mail **/
Mail.prototype.welcome = function(json, lang, callback) {
    
    json.lang = lang;
    
    emailTemplates(templatesDir, function(err, template) {

        if (err) callback(err, null);
        else {
          
            template(lang + '_welcome', json, function(err, html, text) {
                if (err) callback(err, null);
                else {
                
                    /** set subject **/
                    var subj = '';
                    switch (lang){
                        case "en":
                            subj = 'Welcome to darkroom locator webapp';
                        break;
                        case "it":
                            subj = 'Benvenuto nella webapp darkroom locator';
                        break;
                        case "de":
                            subj = 'Willkommen in der webapp darkroom locator';
                        break;                            
                        case "fr":
                            subj = 'Bienvenue dans la darkroom locator webapp';
                        break;
                        case "es":
                            subj = 'Bienvenido a la webapp darkroom locator';
                        break;
                    }
                
                    /** set mail **/
                    var mail = {
                        From: 'DarkRoom Locator Team <darkroomlocator@analogica.it>',
                        To: json.email,
                        Subject: subj,
                        HtmlBody: html,
                        TextBody: text
                    };
                    console.log(mail);
                
                    /** send mail **/              
                    postmark.send(mail, function(err, response) {
                        if (err)    callback(err, null);
                        else        callback(response, null);                    
                    });
                    }
            });          
            
        }
    });
};

/** Send Activate Mail **/
Mail.prototype.activate = function(json, lang, callback) {
    
    json.lang = lang;
    
    emailTemplates(templatesDir, function(err, template) {

        if (err) callback(err, null);
        else {
          
            template(lang + '_activate', json, function(err, html, text) {
                
                if (err) callback(err, null);
                else {
                
                    /** set subject **/
                    var subj = '';
                    switch (lang){
                        case "en":
                            subj = 'Thank you for your registration to darkroom locator';
                        break;
                        case "it":
                            subj = 'Grazie per esserti registrato su darkroom locator';
                        break;
                        case "de":
                            subj = 'Danke für die Registrierung auf Darkroom Locator';
                        break;                            
                        case "fr":
                            subj = 'Merci de vous inscrire sur darkroom locator';
                        break;
                        case "es":
                            subj = 'Gracias por su registro en darkroom locator';
                        break;
                    }
                
                    /** set mail **/
                    var mail = {
                        From: 'DarkRoom Locator Team <darkroomlocator@analogica.it>',
                        To: json.email,
                        Subject: subj,
                        HtmlBody: html,
                        TextBody: text
                    };
                    console.log(mail);
                
                    /** send mail **/              
                    postmark.send(mail, function(err, response) {
                        if (err)    callback(err, null);
                        else        callback(null, response);                    
                    });
                }
            });          
            
        }
    });
};

/** Resend Mail with new password **/
Mail.prototype.resend = function(json, lang, pwd, callback) {
    
    json.lang = lang;
    json.clean_password = pwd;
    
    emailTemplates(templatesDir, function(err, template) {

        if (err) callback(err, null);
        else {
          
            template(lang + '_resend', json, function(err, html, text) {
                if (err) callback(err, null);
                else {
                
                    /** set subject **/
                    var subj = '';
                    switch (lang){
                        case "en":
                            subj = 'You have requested a password reset for darkroom locator';
                        break;
                        case "it":
                            subj = 'Hai chiesto un reset password per darkroom locator';
                        break;
                        case "de":
                            subj = 'Sie haben einen Passwort-Reset für den darkroom locator';
                        break;                            
                        case "fr":
                            subj = 'Vous avez demandé une réinitialisation de mot de passe pour darkroom locator';
                        break;
                        case "es":
                            subj = 'Ha solicitado un restablecimiento de contraseña para darkroom locator';
                        break;
                    }
                
                    /** set mail **/
                    var mail = {
                        From: 'DarkRoom Locator Team <darkroomlocator@analogica.it>',
                        To: json.email,
                        Subject: subj,
                        HtmlBody: html,
                        TextBody: text
                    };
                    console.log(mail);
                
                    /** send mail **/              
                    postmark.send(mail, function(err, response) {
                        if (err)    callback(err, null);
                        else        callback(response, null);                    
                    });
                    }
            });          
            
        }
    });
};

exports.Mail = Mail;