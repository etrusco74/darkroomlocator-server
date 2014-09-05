var config = {}

config.mongo = {};
config.web = {};

/** mongohq **/
config.mongo.host = 'dharma.mongohq.com';       
config.mongo.port = 10012;

config.mongo.db = 'darkroomlocator';
config.mongo.user = 'etrusco'
config.mongo.password = 'sandrino';

config.web.port = process.env.PORT || 80;
//config.web.ip = process.env.IP;

module.exports = config;