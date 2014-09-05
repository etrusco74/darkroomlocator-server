var config = {}

config.mongo = {};
config.web = {};

/** mongohq **/
config.mongo.host = 'your_host';       
config.mongo.port = 00000;

config.mongo.db = 'your_db';
config.mongo.user = 'your_user'
config.mongo.password = 'your_password';

config.web.port = process.env.PORT || 80;
//config.web.ip = process.env.IP;

module.exports = config;