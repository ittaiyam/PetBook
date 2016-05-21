/**
 * Created by Ittai on 21/5/2016.
 */
'use strict';

/**
 * The function is exported and when invoked will add the message model to our dao instance.
 * @param dao
 */
function appendModel(dao) {
    var mongoose = require('mongoose');

    var messageSchema = new mongoose.Schema({
        content: {type: String, required: true},
        petReference: {type: mongoose.Schema.Types.ObjectId, ref: 'Pet'},
        date: {type: Date, default: Date.now},
        to: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        from: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        previous: {type: mongoose.Schema.Types.ObjectId, ref: 'message'},
        next: {type: mongoose.Schema.Types.ObjectId, ref: 'message'}
    });

    dao.message = mongoose.model('Message', messageSchema);
}

module.exports = appendModel;
