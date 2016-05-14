'use strict';
/**
 * The function is exported and when invoked will add the token model to our dao instance.
 * @param dao
 */
function appendModel(dao) {
    var mongoose = require('mongoose');

    var tokenSchema = new mongoose.Schema({
        value: {type: String, unique: true},
        user: {type: mongoose.Schema.Types.ObjectId, unique: true,  ref: 'User'}/*,
         expiresAt: {type: Date, expires: 60*60*24*356, default: Date.now}*/
    });

    dao.token =  mongoose.model('Token',tokenSchema);
}

module.exports = appendModel;