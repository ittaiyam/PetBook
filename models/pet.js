'use strict';

/**
 * The function is exported and when invoked will add the pet model to our dao instance.
 * @param dao
 */
function appendModel(dao) {
    var mongoose = require('mongoose');
    var species = ['cat', 'dog', 'horse', 'parrot', 'other'];
    var gender = ['male', 'female', 'unknown'];

    var petSchema = new mongoose.Schema({
        name: {type: String, required: true},
        description: {type: String, required: true},
        age: {type: Number, default: null},
        species: {type: String, required: true, enum: species},
        type: {type: String, required: true},
        gender: {type: String, enum: gender, required: true},
        adopted: {type: Boolean, default: false},
        createDate: {type: Date, default: Date.now},
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
    });

    dao.pet = mongoose.model('Pet', petSchema);
}

module.exports = appendModel;