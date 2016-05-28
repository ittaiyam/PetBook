'use strict';

function routes(app, passport) {
    var dao = app.get('dao');

    var authController = require('./authController')(dao, passport);
    app.use('/auth', authController);

    var apiController = require('./apiController')(dao);
    app.use('/api', passport.authenticate('bearer', {session: false}), apiController);

    var openController = require('./openController')(dao);
    app.use('/open', openController);

    app.get('/', function (req, res) {
        res.sendfile(__dirname + '/public/index.html');
    });
}

module.exports = routes;