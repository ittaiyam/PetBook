'use strict';

process.env.MONGO_DB = 'petBookDb_TEST';
process.env.MONGO_SERVER = process.env.MONGO_SERVER || 'localhost';
var instance = require('../../server');
var server = instance.server;
var app = instance.app;
var dao = app.get('dao');

before(function (done) {
    dao.connection.once('open', function(){
        dao.connection.db.dropDatabase(done);
    });
});

describe('Routes Unit Testing...', function(){
    require('./routes.part.api')(app);
});

after(function (done) {
    dao.connection.close(function(){
        dao.connection.close(function(){
            server.close(done);
        });
    });
});