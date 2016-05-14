'use strict';

function buildDAO(){
    var winston = require('winston');
    var logger = new winston.Logger();
    logger.add(winston.transports.File, {filename: 'petbook.log'});
    
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://' + process.env.MONGO_SERVER + '/' + process.env.MONGO_DB);

    var instance = {};
    require('./user')(instance);
    require('./token')(instance);
    //require('./post')(instance);
    //require('./comment')(instance);
    //require('./like')(instance);
    //require('./activity')(instance);

    instance.connection = mongoose.connection;
    instance.connection.on('error', logger.error.bind(logger, 'connection error:'));
    instance.connection.once('open', logger.info.bind(logger, 'Connected to mongo database "' + process.env.MONGO_DB+'".'));

    return instance;
}

module.exports = buildDAO();