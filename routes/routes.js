'use strict';

function routes(app, passport) {
    var dao = app.get('dao');

    //var authController = require('./controller/authcontroller')(dao, passport);
    //app.use('/auth', authController);

    // TODO remove and create actual tests.
    dao.user.findOne({email: 'miri@miri.com'}, function (error, result) {
        if(!error && !result) {
            dao.user.extendedCreate({name: 'miri', email: 'miri@miri.com'});
        }
    });

    var apiController = require('./apiController')(dao);
    app.use('/api', passport.authenticate('bearer', {session: false}), apiController);

    var openController = require('./openController')(dao);
    app.use('/open', openController);

    app.get('/', function (req, res) {
        res.sendfile(__dirname + '/public/index.html');
    });
}

module.exports = routes;