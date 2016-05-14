'use strict';

process.env.MONGO_DB = 'petBookDb_TEST';
process.env.MONGO_SERVER = process.env.MONGO_SERVER || 'localhost';
var dao = require('../../models/dao');

before(function (done) {
    dao.connection.once('open', function(){
        dao.connection.db.dropDatabase(done);
    });
});

describe('Data Access Object Unit Testing...', function(){
    require('./dao.part.user.js')(dao);
});

after(function (done) {
    dao.connection.close(done);
});