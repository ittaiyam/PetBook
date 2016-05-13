'use strict';

function routes(app, passport) {
    var dao = app.get('dao');

    //var authController = require('./controller/authcontroller')(dao, passport);
    //app.use('/auth', authController);

    //var apiController = require('./controller/apicontroller')(dao);
    //app.use('/api', passport.authenticate('bearer', {session: false}), apiController);

    app.get('/', function(req, res){
        res.sendfile(__dirname + '/public/index.html');
    });
}

module.exports = routes;