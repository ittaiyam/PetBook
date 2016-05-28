'use strict';

/**
 * @param dao The data access object instance.
 * @param passport
 * @returns {*} The router component.
 */
function authController(dao, passport){
    var express = require('express');
    var router = express.Router();

    router.get('/google', passport.authenticate('google', { scope: ['openid', 'profile', 'email'] }));
    router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), onLogin);

    /**
     * Handles login procedure.
     * @param req
     * @param res
     */
    function onLogin(req, res){
        var user = req.user;
        if(user.token){
            dao.token.findOne({_id: user.token}).exec(onTokenFound);
        }else{
            user.generateToken(onTokenGenerated);
        }

        function onTokenFound(error, foundToken){
            if (error || !foundToken) {
                user.generateToken(onTokenGenerated);
            } else {
                sendResponse(foundToken);
            }
        }

        /**
         * Handles result of token generation action on a user.
         * @param error
         * @param generatedToken
         */
        function onTokenGenerated(error, generatedToken) {
            if (error || !generatedToken) {
                res.status(500).json({msg: 'A token could not be generated/retrieved.'});
            } else {
                sendResponse(generatedToken);
            }
        }

        function sendResponse(token) {
            res.json({access_token: token.value});
        }
    }

    return router;
}

module.exports = authController;