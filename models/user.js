'use strict';

/**
 * The function is exported and when invoked will add the user model to our dao instance.
 * @param dao
 */
function appendModel(dao) {
    var mongoose = require('mongoose');
    var randtoken = require('rand-token');

    var userSchema = new mongoose.Schema({
        name: {type: String, required: true},
        email: {type: String, unique: true},
        token: {type: mongoose.Schema.ObjectId, ref: 'Token', default: null},
        regDate: {type: Date, default: Date.now},
        enabled: {type: Boolean, default: true}
    });

    userSchema.statics.extendedCreate = extendedCreate;
    userSchema.methods.generateToken = generateToken;

    dao.user = mongoose.model('User', userSchema);

    /**
     * A static function. Handles creation of a new user.
     * @param data
     * @param done
     * @param sendBackTokenValue Determines what to send back on done.
     */
    function extendedCreate(data, done, sendBackTokenValue) {
        sendBackTokenValue = sendBackTokenValue || false;
        var user = new dao.user();
        var token = new dao.token();

        token.value = randtoken.generate(32);
        token.user = user._id;

        user.name = data.name;
        user.email = data.email;
        user.token = token._id;

        token.save(onTokenSaved);

        function onTokenSaved(error, result) {
            if (error || !result) {
                done(error, result);
            } else {
                token = result;
                user.save(onUserSaved);
            }
        }

        function onUserSaved(error, result) {
            if (error || !result) {
                done(error, result);
            } else {
                user = result;
                done(null, sendBackTokenValue ? token.value : user);
            }
        }
    }

    /**
     * A user method. Will (re)generate the user's token value.
     * @param done
     */
    function generateToken(done) {
        var self = this;
        var token;
        dao.token.findOneAndUpdate({user: this._id}, {value: randtoken.generate(32)}, {
            upsert: true,
            new: true
        }, onUpdateDone);

        function onUpdateDone(error, result) {
            if (error || !result) {
                done(error, result);
            } else {
                token = result;
                self.token = token._id;
                self.save(onSaveDone);
            }
        }

        function onSaveDone(error, result) {
            if (error || !result) {
                done(error, result);
            } else {
                done(null, token);
            }
        }
    }
}

module.exports = appendModel;